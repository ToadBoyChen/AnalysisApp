import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface StockData {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
  change?: number;
  changePercent?: number;
  high?: number;
  low?: number;
  previousClose?: number;
}

const LiveTicker: React.FC = () => {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Fetch initial data
    const fetchInitialData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/stock_data');
        const data = await response.json();
        setStocks(data);
      } catch (error) {
        console.error('Error fetching initial stock data:', error);
      }
    };

    fetchInitialData();

    // Setup WebSocket connection
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Ticker connected to WebSocket');
      setIsConnected(true);
    });

    newSocket.on('stockUpdate', (data: StockData) => {
      setStocks(prevStocks => {
        const updatedStocks = [...prevStocks];
        const index = updatedStocks.findIndex(stock => stock.symbol === data.symbol);
        
        if (index !== -1) {
          updatedStocks[index] = { ...updatedStocks[index], ...data };
        } else {
          updatedStocks.push(data);
        }
        
        return updatedStocks;
      });
    });

    newSocket.on('disconnect', () => {
      console.log('Ticker disconnected from WebSocket');
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
  };

  return (
    <div className="bg-[var(--colour-background-secondary)] rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[var(--colour-text-primary)]">
          Live Market Data
        </h2>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <span className="text-sm text-[var(--colour-text-secondary)]">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-2" style={{ minWidth: 'max-content' }}>
          {stocks.map((stock) => (
            <div
              key={stock.symbol}
              className="flex-shrink-0 bg-[var(--colour-background-tertiary)] rounded-lg p-3 min-w-[200px]"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[var(--colour-text-primary)]">
                  {stock.symbol}
                </span>
                <span className="text-lg font-bold text-[var(--colour-text-primary)]">
                  {formatPrice(stock.price)}
                </span>
              </div>
              
              {(stock.change !== undefined && stock.changePercent !== undefined) && (
                <div className={`text-sm font-medium ${
                  stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatChange(stock.change, stock.changePercent)}
                </div>
              )}
              
              {stock.high && stock.low && (
                <div className="text-xs text-[var(--colour-text-secondary)] mt-1">
                  H: {formatPrice(stock.high)} L: {formatPrice(stock.low)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LiveTicker;
