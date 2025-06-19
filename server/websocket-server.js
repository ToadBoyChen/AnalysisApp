const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const WebSocket = require('ws');
const Redis = require('ioredis');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Redis client for caching (optional)
let redis = null;
try {
  redis = new Redis({
    host: 'localhost',
    port: 6379,
    retryDelayOnFailover: 100,
    enableOfflineQueue: false,
    lazyConnect: true,
    maxRetriesPerRequest: 1
  });
  
  redis.on('error', (err) => {
    console.log('Redis connection error, running without cache:', err.message);
    redis = null;
  });
} catch (error) {
  console.log('Redis not available, running without cache');
  redis = null;
}

app.use(cors());
app.use(express.json());

// Stock symbols to track
const STOCKS = [
  "AAPL", "TSLA", "GOOGL", "MSFT", "NVDA", "AMZN", "META", "NFLX", "BA", "DIS",
  "IBM", "AMD", "INTC", "V", "PYPL", "JPM", "GS", "TSM", "XOM", "WMT"
];

// Finnhub WebSocket connection
let finnhubWs = null;
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || 'sandbox_token'; // Use sandbox for demo

// Store latest prices
const latestPrices = new Map();

// Initialize Finnhub WebSocket
function initializeFinnhubWebSocket() {
  finnhubWs = new WebSocket(`wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`);
  
  finnhubWs.on('open', function open() {
    console.log('Connected to Finnhub WebSocket');
    
    // Subscribe to all stocks
    STOCKS.forEach(symbol => {
      finnhubWs.send(JSON.stringify({'type':'subscribe','symbol': symbol}));
    });
  });

  finnhubWs.on('message', function message(data) {
    try {
      const response = JSON.parse(data);
      if (response.type === 'trade') {
        response.data.forEach(trade => {
          const stockData = {
            symbol: trade.s,
            price: trade.p,
            timestamp: trade.t,
            volume: trade.v
          };
          
          // Update latest prices
          latestPrices.set(trade.s, stockData);
          
          // Cache in Redis if available
          if (redis) {
            try {
              redis.setex(`stock:${trade.s}`, 300, JSON.stringify(stockData));
            } catch (err) {
              console.log('Redis cache error:', err.message);
            }
          }
          
          // Broadcast to all connected clients
          io.emit('stockUpdate', stockData);
        });
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  });

  finnhubWs.on('close', function close() {
    console.log('Finnhub WebSocket connection closed. Reconnecting...');
    setTimeout(initializeFinnhubWebSocket, 5000);
  });

  finnhubWs.on('error', function error(err) {
    console.error('Finnhub WebSocket error:', err);
  });
}

// Mock stock data for demonstration
function generateMockStockData() {
  const baseData = {
    AAPL: 175.50, TSLA: 245.30, GOOGL: 142.80, MSFT: 378.90, NVDA: 875.20,
    AMZN: 155.40, META: 485.60, NFLX: 445.70, BA: 205.80, DIS: 95.30,
    IBM: 165.40, AMD: 142.50, INTC: 43.20, V: 265.80, PYPL: 58.90,
    JPM: 178.40, GS: 385.60, TSM: 105.70, XOM: 118.50, WMT: 165.20
  };
  
  return STOCKS.map(symbol => {
    const basePrice = baseData[symbol] || 100;
    const variation = (Math.random() - 0.5) * 10; // ±5 price variation
    const price = Math.max(basePrice + variation, 1);
    const previousClose = basePrice;
    const change = price - previousClose;
    const changePercent = (change / previousClose) * 100;
    
    return {
      symbol,
      price: Math.round(price * 100) / 100,
      previousClose: Math.round(previousClose * 100) / 100,
      change: Math.round(change * 100) / 100,
      changePercent: Math.round(changePercent * 100) / 100,
      high: Math.round((price + Math.random() * 5) * 100) / 100,
      low: Math.round((price - Math.random() * 5) * 100) / 100,
      timestamp: Date.now()
    };
  });
}

// Fallback data fetcher using REST API or mock data
async function fetchStockDataREST() {
  try {
    // For demo purposes, return mock data
    console.log('Generating mock stock data for demonstration');
    return generateMockStockData();
  } catch (error) {
    console.error('Error generating stock data:', error);
    return [];
  }
}

// REST API endpoints
app.get('/api/stock_data', async (req, res) => {
  try {
    const stockData = await fetchStockDataREST();
    res.json(stockData);
  } catch (error) {
    console.error('Error in /api/stock_data:', error);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

app.get('/api/stock/:symbol/history', async (req, res) => {
  const { symbol } = req.params;
  const { resolution = 'D', from, to } = req.query;
  
  try {
    const toTimestamp = to || Math.floor(Date.now() / 1000);
    const fromTimestamp = from || (toTimestamp - 7 * 24 * 60 * 60); // 7 days ago
    
    const response = await fetch(
      `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${fromTimestamp}&to=${toTimestamp}&token=${FINNHUB_API_KEY}`
    );
    const data = await response.json();
    
    if (data.s === 'ok') {
      const candles = data.t.map((timestamp, index) => ({
        time: timestamp,
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index]
      }));
      
      res.json(candles);
    } else {
      res.status(404).json({ error: 'No data found' });
    }
  } catch (error) {
    console.error(`Error fetching history for ${symbol}:`, error);
    res.status(500).json({ error: 'Failed to fetch historical data' });
  }
});

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send current prices to newly connected client
  latestPrices.forEach((data, symbol) => {
    socket.emit('stockUpdate', data);
  });
  
  socket.on('subscribe', (symbols) => {
    console.log('Client subscribed to:', symbols);
    // Handle individual stock subscriptions if needed
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Initialize WebSocket connection
initializeFinnhubWebSocket();

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('WebSocket server ready for real-time stock data');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  if (finnhubWs) {
    finnhubWs.close();
  }
  if (redis) {
    redis.disconnect();
  }
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
