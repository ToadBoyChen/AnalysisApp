import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, LineData, Time } from 'lightweight-charts';
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

interface LiveChartProps {
  symbol: string;
  height?: number;
  width?: string;
}

const LiveChart: React.FC<LiveChartProps> = ({ 
  symbol, 
  height = 400, 
  width = '100%' 
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineSeriesRef = useRef<ISeriesApi<'Line'> | null>(null);
  const socketRef = useRef<Socket | null>(null);
  
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceChange, setPriceChange] = useState<number>(0);
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

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

    // Create line series
    const lineSeries = chart.addLineSeries({
      color: '#4bffb5',
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
    });

    chartRef.current = chart;
    lineSeriesRef.current = lineSeries;

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
          const lineData: LineData[] = data.map(candle => ({
            time: candle.time as Time,
            value: candle.close,
          }));

          if (lineSeriesRef.current) {
            lineSeriesRef.current.setData(lineData);
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
      setIsConnected(true);
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
        if (lineSeriesRef.current) {
          const currentTime = Math.floor(Date.now() / 1000) as Time;
          
          lineSeriesRef.current.update({
            time: currentTime,
            value: data.price,
          });
        }
      }
    });

    socketRef.current.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
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
            <div className={`w-2 h-2 rounded-full ${
              isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
            }`}></div>
            <span className="text-sm text-[var(--colour-text-secondary)]">
              {isConnected ? 'Live' : 'Disconnected'}
            </span>
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

export default LiveChart;
