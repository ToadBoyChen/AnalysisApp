"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ScrollTracker from "./ScrollTracker";

interface StockData {
  symbol: string;
  price: number;
  changePercent: number;
}

const Nav = () => {
  const [stockData, setStockData] = useState<StockData[]>([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stock_data");
        setStockData(response.data);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 30000); // Fetch every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="flex flex-col justify-between items-center p-2 bg-[var(--colour-background-tertiary)] shadow-md w-full fixed top-0 left-0 z-50">
      <div className="overflow-hidden w-full">
        <div className="whitespace-nowrap flex animate-marquee gap-10">
          {[...stockData, ...stockData].map(({ symbol, price, changePercent }, index) => {
            const isPositive = (changePercent || 0) >= 0;
            return (
              <div key={symbol + index} className="inline-flex items-center space-x-4">
                {/* Stock Symbol */}
                <span className="font-bold text-[var(--colour-background-primary)]">{symbol}</span>

                {/* Stock Price */}
                <span className="text-[var(--colour-background-primary)]">
                  ${(price || 0).toFixed(2)}
                </span>

                {/* Percentage Change */}
                <span className={`border border-2 rounded-sm px-2 py-0 ${isPositive ? "border-[var(--colour-buy)] text-[var(--colour-buy)]" : "border-[var(--colour-sell)] text-[var(--colour-sell)]"}`}>
                  {Math.abs(changePercent || 0).toFixed(2)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="w-full absolute bottom-0">
        <ScrollTracker />
      </div>
    </nav>
  );
};

export default Nav;
