import React, { useEffect, useState } from 'react';
import { database, auth } from '../../utils/Firebase';
import { ref, get } from 'firebase/database';
import Chart from "react-apexcharts";


const DoughnutChart = () => {
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.warn("User belum login");
        return;
      }

      try {
        const snapshot = await get(ref(database, `transactions/${user.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();

          // income
          const incomeData = data.income ? Object.values(data.income) : [];
          const totalIncome = incomeData.reduce(
            (acc, item) => acc + (item.nominal || item.amount || 0),
            0
          );

          // expense
          const expenseData = data.expense ? Object.values(data.expense) : [];
          const totalExpense = expenseData.reduce(
            (acc, item) => acc + (item.nominal || item.amount || 0),
            0
          );

          setIncome(totalIncome);
          setExpense(totalExpense);

          console.log("Total Income:", totalIncome);
          console.log("Total Expense:", totalExpense);
        } else {
          console.log("Data kosong untuk user ini");
          setIncome(0);
          setExpense(0);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const options = {

    chart : {
      type: "donut",
      toolbar: { show: true },
      fontFamily : "Roboto Mono, monospace"
    },

      labels: ['Pemasukan', 'Pengeluaran'],
      colors:  ["#1d86afff", "#F44336"],
      legend: {
        position: "top"
      },

      dataLabels: {
        enabled: true,
        formatter: (val) => `${val.toFixed(1)}%`
      },

      tooltip: {
          y: {
            formatter: (val) =>
              `Rp ${val.toLocaleString("id-ID")}` // Rp di tooltip
          }
      },

       plotOptions: {
          pie: {
            donut: {
              size: "65%",
              labels: {
                show: true,
                name: {
                  show: true
                },
        }
      }
    }
  }

    
 
  };

  const series = [income, expense]

  return (
    <div className="w-full p-3 mt-10 shadow-lg rounded">
      <h1 className="font-bold text-xl mb-5">Pemasukan dan Pengeluaran</h1>
      <Chart options={options} series={series} type='donut' height={400}/>
    </div>
  );
};

export default DoughnutChart;
