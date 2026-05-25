import React, { useMemo } from "react";
import useTransactionStore from "../../Store/UseTransactionStore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

// register
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const LineChart = () => {
  const transactionData = useTransactionStore((state) => state.transactions);
  const currentYear = new Date().getFullYear();

  const months = Array.from({ length: 12 }, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    return `${currentYear}-${month}`;
  });

  // ================== MAPPING DATA ==================
  const monthlyExpense = useMemo(() => {
   const result = {};
    (transactionData).forEach((transaction) => {
      if (transaction.type !== "expense") return;
      const date = new Date(transaction.created_at);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      
      if (!result[monthYear]) {
        result[monthYear] = 0;
      }
      result[monthYear] += transaction.nominal;
    });
    return result;
  }, [transactionData]);
    

  const dataValues = months.map((m) =>   
    monthlyExpense[m] !== undefined ? monthlyExpense[m] : 0
  );

  // DATA CHART (fix)
  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Pengeluaran per Bulan",
        data: dataValues,
        borderColor: "#FF1744",
        backgroundColor: "rgba(255, 23, 68, 0.2)", // area fill
        fill: true,
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  // OPTIONS
  const options = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },

    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#999",
        },
      },
      y: {
        beginAtZero: true,
        grid: { display: false },
        ticks: {
          color: "#666",
        },
      },
    },

    elements: {
      line: {
        borderWidth: 3,
      },
    },
  };

  return (
    <div className="w-full min-w-0 flex flex-col space-y-4 mt-10">
      <h1 className="font-semibold text-lg lg:text-xl mb-5">
        Pengeluaran Berdasarkan Tahun {currentYear}
      </h1>
        {transactionData.length === 0 ? (
          <div className="flex justify-center items-center h-64 w-full p-5 shadow-2xl border border-gray-300 rounded-lg">
            <p className="text-gray-500 text-lg">
              Belum ada data yang dimasukkan
            </p>
          </div>
        ) : (
          <div className="w-full p-5 shadow-2xl border border-gray-300 rounded-lg">
            <div className="h-[300px] lg:h-[400px]">
              <Line data={chartData} options={options} />
            </div>
          </div>
        )}
    </div>
  );
};

export default LineChart;