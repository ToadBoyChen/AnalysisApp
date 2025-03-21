import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Demo = () => {  const data = {
    labels: ["January", "February", "March", "April", "May"],
    datasets: [
      {
        label: "Demo Bar Chart",
        data: [12, 19, 3, 5, 2],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Example chart options
  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Demo Chart",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="text-center rounded-lg shadow-lg bg-[var(--colour-background-secondary)]">
      <Bar data={data} options={options} />
    </div>
  );
};

export default Demo;
