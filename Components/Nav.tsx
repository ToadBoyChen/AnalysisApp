"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import ScrollTracker from "./ScrollTracker";

const Nav = () => {
  const [stockData, setStockData] = useState<
    { symbol: string; today_close: number; percentage_change: number}[]
  >([]);

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
    const interval = setInterval(fetchStockData, 30000); // Fetch every 40 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="flex flex-col justify-between items-center p-2 bg-[var(--colour-background-tertiary)] shadow-md w-full fixed top-0 left-0 z-50">
      <div className="overflow-hidden w-full">
        <div className="whitespace-nowrap flex animate-marquee gap-10">
          {[...stockData, ...stockData].map(({ symbol, today_close, percentage_change}, index) => {
            const isPositive = percentage_change >= 0;
            return (
              <div key={symbol + index} className="inline-flex items-center space-x-4">
                {/* Stock Symbol */}
                <span className="font-bold text-[var(--colour-background-primary)]">{symbol}</span>

                {/* Stock today_close */}
                <span className="text-[var(--colour-background-primary)]">${today_close.toFixed(2)}</span>

                {/* Percentage Change */}
                <span className={`border border-2 rounded-sm px-2 py-0 ${isPositive ? "border-[var(--colour-buy)] text-[var(--colour-buy)]" : "border-[var(--colour-sell)] text-[var(--colour-sell)]"}`}>
                  {Math.abs(percentage_change).toFixed(2)}%
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
