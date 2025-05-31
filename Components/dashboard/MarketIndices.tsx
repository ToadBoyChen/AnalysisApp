import React, { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface IndexData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const MarketIndices: React.FC = () => {
  const [indices, setIndices] = useState<IndexData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIndicesData = async () => {
      try {
        // For demo purposes, we'll use mock data
        // In production, you'd fetch from a real API
        const mockIndices: IndexData[] = [
          {
            symbol: '^GSPC',
            name: 'S&P 500',
            price: 4756.50,
            change: 23.45,
            changePercent: 0.49
          },
          {
            symbol: '^IXIC',
            name: 'NASDAQ',
            price: 14845.12,
            change: -45.23,
            changePercent: -0.30
          },
          {
            symbol: '^DJI',
            name: 'Dow Jones',
            price: 36204.44,
            change: 156.78,
            changePercent: 0.43
          },
          {
            symbol: '^RUT',
            name: 'Russell 2000',
            price: 2234.56,
            change: -12.34,
            changePercent: -0.55
          }
        ];

        // Simulate API delay
        setTimeout(() => {
          setIndices(mockIndices);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching indices data:', error);
        setIsLoading(false);
      }
    };

    fetchIndicesData();
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatChange = (change: number, percent: number) => {
    const sign = change >= 0 ? '+' : '';
    return `${sign}${change.toFixed(2)} (${sign}${percent.toFixed(2)}%)`;
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--colour-background-secondary)] rounded-lg p-6">
        <h2 className="text-lg font-semibold text-[var(--colour-text-primary)] mb-4">
          Market Indices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-[var(--colour-background-tertiary)] rounded-lg p-4">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--colour-background-secondary)] rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold text-[var(--colour-text-primary)] mb-4">
        Market Indices
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {indices.map((index) => (
          <div
            key={index.symbol}
            className="bg-[var(--colour-background-tertiary)] rounded-lg p-4 hover:bg-opacity-80 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-[var(--colour-text-primary)] text-sm">
                {index.name}
              </h3>
              {getTrendIcon(index.change)}
            </div>
            
            <div className="mb-2">
              <span className="text-xl font-bold text-[var(--colour-text-primary)]">
                {formatPrice(index.price)}
              </span>
            </div>
            
            <div className={`text-sm font-medium ${
              index.change >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {formatChange(index.change, index.changePercent)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketIndices;
