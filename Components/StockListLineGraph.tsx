import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import * as echarts from "echarts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/ui/select";

interface StockData {
  symbol: string;
  price: number;
  previousClose?: number;
  change?: number;
  changePercent?: number;
  high?: number;
  low?: number;
  timestamp: number;
}

const calculateBoxPlotStats = (data: number[]) => {
  const sortedData = [...data].sort((a, b) => a - b);

  // Function to calculate the median of an array
  const median = (arr: number[]) => {
    const mid = Math.floor(arr.length / 2);
    return arr.length % 2 === 0
      ? (arr[mid - 1] + arr[mid]) / 2
      : arr[mid];
  };

  // Calculate Q1 (lower quartile) and Q3 (upper quartile)
  const lowerHalf = sortedData.slice(0, Math.floor(sortedData.length / 2));
  const upperHalf = sortedData.slice(Math.ceil(sortedData.length / 2));

  const Q1 = median(lowerHalf);  // Median of the lower half
  const Q3 = median(upperHalf);  // Median of the upper half

  // Calculate the median (Q2)
  const Q2 = median(sortedData);

  // Calculate low (minimum) and high (maximum)
  const low = Math.min(...data);
  const high = Math.max(...data);

  return { mean: Q2, low, high, Q1, Q3 };  // Q2 is the median here
};


const Demo = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStock, setSelectedStock] = useState("IBM"); // Set default to "IBM"
  const [filteredData, setFilteredData] = useState<StockData | null>(null); // Store filtered data for the selected stock
  const chartRef = useRef<HTMLDivElement | null>(null); // Ref for the chart container

  // Function to fetch stock data from the API
  const fetchStockData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/stock_data");
      setStockData(response.data);

      // Set "IBM" as the default if not already selected
      if (!selectedStock) {
        const ibmStock = response.data.find((item: StockData) => item.symbol === "IBM");
        if (ibmStock) {
          setSelectedStock("IBM");
        }
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stock data:", error);
      setLoading(false);
    }
  };

  // Filter the stock data when a stock is selected
  useEffect(() => {
    if (selectedStock) {
      const stock = stockData.find((item: StockData) => item.symbol === selectedStock);
      setFilteredData(stock || null);
    }
  }, [selectedStock, stockData]);

  // Fetch data on mount and setup interval for live updates
  useEffect(() => {
    fetchStockData(); // Initial data fetch

    // Poll every 30 seconds for updated data
    const interval = setInterval(fetchStockData, 30000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Prepare data for box plot calculation
  const stockPrices = filteredData ? [filteredData.price, filteredData.previousClose || filteredData.price] : [];
  const { mean, low, high, Q1, Q3 } = calculateBoxPlotStats(stockPrices);

  const options = {
    title: {
      text: 'Stock Box Plot',
    },
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Box Plot'],
    },
    xAxis: {
      type: 'category',
      data: ['Stock Data'],
      axisLabel: {
        formatter: (value: string) => value,
      },
    },
    yAxis: {
      type: 'value',
      min: low - 5, // Set minimum value based on the data
      max: high + 5, // Set maximum value based on the data
      axisLabel: {
        formatter: (value: number) => value.toLocaleString(),
      },
    },
    series: [
      {
        name: "Box Plot",
        type: 'boxplot',
        data: [
          [low, Q1, mean, Q3, high], // Box plot data in the format: [low, LB, Q1, mean, Q3, UB, high]
        ],
        itemStyle: {
          color: '#5470C6',
        },
      },
    ],
  };

  useEffect(() => {
    if (filteredData && chartRef.current) {
      const chart = echarts.init(chartRef.current);
      chart.setOption(options);
      return () => {
        chart.dispose();
      };
    }
  }, [filteredData]);

  return (
    <div className="flex flex-col rounded-lg shadow-lg bg-[var(--colour-background-secondary)] p-5">
      <div>Stock Selector</div>
      <Select onValueChange={(value) => setSelectedStock(value)} value={selectedStock}>
        <SelectTrigger className="mb-4">
          <SelectValue placeholder="Select a stock" />
        </SelectTrigger>
        <SelectContent className="p-2">
          {stockData.map((stock) => (
            <SelectItem key={stock.symbol} value={stock.symbol}>
              {stock.symbol}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading ? (
        <div>Loading...</div>
      ) : filteredData ? (
        <div ref={chartRef} style={{ width: '100%', height: '400px' }}></div>
      ) : (
        <div>Select a stock to view its data.</div>
      )}
    </div>
  );
};

export default Demo;
