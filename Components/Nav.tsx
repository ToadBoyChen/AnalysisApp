"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

const Nav = () => {
  const [stockData, setStockData] = useState<
    { symbol: string; price: number; percentage_change: number }[]
  >([]);

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/stock_data");

        const parsedData = response.data.map((item: string) => {
          const [symbol, price, percentage_change] = item.split(": ").map((val, index) =>
            index === 0 ? val : parseFloat(val)
          );

          return { symbol, price, percentage_change };
        });

        setStockData(parsedData);
      } catch (error) {
        console.error("Error fetching stock data:", error);
      }
    };

    fetchStockData();
    const interval = setInterval(fetchStockData, 40000);

    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="flex justify-between items-center p-5 bg-[var(--colour-background-tertiary)] shadow-md">
        <div className="overflow-hidden w-full">
            <div className="whitespace-nowrap flex animate-marquee gap-10">
                {[...stockData, ...stockData].map(({ symbol, price, percentage_change }, index) => {
                    const isPositive = percentage_change >= 0;
                    return (
                        <div key={symbol + index} className="inline-flex items-center space-x-2">
                            <span className="font-bold text-[var(--colour-background-primary)]">{symbol}</span>
                            <span className="text-[var(--colour-background-primary)]">{price.toFixed(2)}</span>
                            <span className={`border border-2 rounded-sm px-2 py-0.5 ${isPositive ? "border-[var(--colour-buy)] text-[var(--colour-buy)]" : "border-[var(--colour-sell)] text-[var(--colour-sell)]"}`}>
                                {Math.abs(percentage_change).toFixed(2)}%
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    </nav>
);

};

export default Nav;
