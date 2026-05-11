import React, { useMemo} from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import useTransactionStore from "../../Store/UseTransactionStore";

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = () => {
  const transactions = useTransactionStore((state) => state.transactions);
  const loading = useTransactionStore((state) => state.loading);


  const summary = useMemo(() => {
    let income = 0;
    let expense = 0;
    
    transactions.forEach((t) => {
      let nominal = t.nominal || t.amount || 0;
      if (t.type === "income" || t.type === "pemasukan") {
        income += nominal;
      } else if (t.type === "expense" || t.type === "pengeluaran") {
        expense += nominal;
      }
    });


    return { income, expense };
  }, [transactions]);
  

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <p className="animate-pulse text-lg font-semibold">Loading...</p>
      </div>
    );
  };


  // DATA
  const data = {
    labels: ["Pemasukan", "Pengeluaran"],
    datasets: [
      {
        data: [summary.income, summary.expense],
        backgroundColor: ["#1d86af", "#F44336"],
        borderWidth: 0,
        cutout: "65%", // 🔥 donut size
      },
    ],
  };

  // OPTIONS
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `Rp ${context.raw.toLocaleString("id-ID")}`;
          },
        },
      },
    },
  };
  

  return (
    <div className="w-full min-w-0 flex flex-col space-y-4 mt-10">
      <h1 className="font-semibold text-lg lg:text-xl mb-5">
        Perbadingan Pemasukan & Pengeluaran
      </h1>
      <div className="w-full  p-5 shadow-2xl border border-gray-300 rounded-lg">

      {transactions.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500 text-lg">
            Belum ada data yang dimasukkan
          </p>
        </div>
      ) : ( 
        <div className="h-[300px] lg:h-[400px] flex justify-center ">
          <Doughnut data={data} options={options} />
        </div>
      )}
      
      </div>
    </div>
  );
};

export default DoughnutChart;