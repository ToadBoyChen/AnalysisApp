import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time } from 'lightweight-charts';
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

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  symbol: string;
  height?: number;
  width?: string;
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({ 
  symbol, 
  height = 400, 
  width = '100%' 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlestickSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const socketRef = useRef<Socket | null>(null);
  
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize chart
  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: height,
      layout: {
        background: { color: 'transparent' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      crosshair: {
        mode: 1,
      },
      rightPriceScale: {
        borderColor: '#485c7b',
      },
      timeScale: {
        borderColor: '#485c7b',
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Create candlestick series
    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#4bffb5',
      downColor: '#ff4976',
      borderDownColor: '#ff4976',
      borderUpColor: '#4bffb5',
      wickDownColor: '#ff4976',
      wickUpColor: '#4bffb5',
    });

    // Create volume series
    const volumeSeries = chart.addHistogramSeries({
      color: '#26a69a',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: '',
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
    });

    chartRef.current = chart;
    candlestickSeriesRef.current = candlestickSeries;
    volumeSeriesRef.current = volumeSeries;

    // Handle resize
    const handleResize = () => {
      if (chartContainerRef.current && chart) {
        chart.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [height]);

  // Fetch historical data
  useEffect(() => {
    const fetchHistoricalData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:5000/api/stock/${symbol}/history`);
        const data: CandleData[] = await response.json();
        
        if (data && data.length > 0) {
          const candleData: CandlestickData[] = data.map(candle => ({
            time: candle.time as Time,
            open: candle.open,
            high: candle.high,
            low: candle.low,
            close: candle.close,
          }));

          const volumeData = data.map(candle => ({
            time: candle.time as Time,
            value: candle.volume,
            color: candle.close >= candle.open ? '#4bffb5' : '#ff4976',
          }));

          if (candlestickSeriesRef.current && volumeSeriesRef.current) {
            candlestickSeriesRef.current.setData(candleData);
            volumeSeriesRef.current.setData(volumeData);
          }

          // Set initial price info
          const lastCandle = data[data.length - 1];
          setCurrentPrice(lastCandle.close);
          
          if (data.length > 1) {
            const prevClose = data[data.length - 2].close;
            const change = lastCandle.close - prevClose;
            const changePercent = (change / prevClose) * 100;
            setPriceChange(change);
            setPriceChangePercent(changePercent);
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching historical data:', error);
        setIsLoading(false);
      }
    };

    if (symbol) {
      fetchHistoricalData();
    }
  }, [symbol]);

  // Setup WebSocket connection for real-time updates
  useEffect(() => {
    socketRef.current = io('http://localhost:5000');

    socketRef.current.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketRef.current.on('stockUpdate', (data: StockData) => {
      if (data.symbol === symbol) {
        setCurrentPrice(data.price);
        
        if (data.change !== undefined) {
          setPriceChange(data.change);
        }
        if (data.changePercent !== undefined) {
          setPriceChangePercent(data.changePercent);
        }

        // Update the chart with real-time price
        if (candlestickSeriesRef.current) {
          const currentTime = Math.floor(Date.now() / 1000) as Time;
          
          // For real-time updates, we'll update the last candle or create a new one
          // This is a simplified approach - in production, you'd want more sophisticated logic
          candlestickSeriesRef.current.update({
            time: currentTime,
            open: data.price,
            high: data.price,
            low: data.price,
            close: data.price,
          });
        }
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [symbol]);

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
    return `${sign}${formatPrice(change)} (${sign}${percent.toFixed(2)}%)`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Price Header */}
      <div className="mb-4 p-4 bg-[var(--colour-background-secondary)] rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-[var(--colour-text-primary)]">{symbol}</h3>
            {currentPrice && (
              <div className="flex items-center gap-4">
                <span className="text-2xl font-semibold text-[var(--colour-text-primary)]">
                  {formatPrice(currentPrice)}
                </span>
                <span className={`text-sm font-medium ${
                  priceChange >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {formatChange(priceChange, priceChangePercent)}
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-[var(--colour-text-secondary)]">Live</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div 
        ref={chartContainerRef} 
        style={{ width, height }}
        className="rounded-lg overflow-hidden border border-[var(--colour-background-tertiary)]"
      />
    </div>
  );
};

export default CandlestickChart;
