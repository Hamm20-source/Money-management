import React, { useEffect, useState } from 'react';
import { get, ref } from 'firebase/database';
import { auth } from '../../utils/Firebase';
import { database } from '../../utils/Firebase';
import Chart from "react-apexcharts";

const LineChart = () => {
  const [monthlyExpense, setMonthlyExpense] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;

     try {
        const snapshot = await get(ref(database, `transactions/${user.uid}/expense`));
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Ambil semua expense, lalu group by bulan
          const grouped = {};

          Object.values(data).forEach((item) => {
            const amount = item.nominal || item.amount || 0;
            const date = item.tanggal ? new Date(item.tanggal) : new Date(); // asumsi ada field `date`
            const monthKey = `${date.getFullYear()} - ${String(date.getMonth() + 1).padStart(2, "0")}`;

            if (!grouped[monthKey]) grouped[monthKey] = 0;
            grouped[monthKey] += amount;
          });

          setMonthlyExpense(grouped);
          console.log("Grouped Expense:", grouped);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  
  const currentYear = new Date().getFullYear();

  const months = Array.from({ length: 12}, (_, i) => {
    const month = String(i + 1).padStart(2, "0");
    return `${currentYear} - ${month}`;
  });

  const dataValues = months.map((m) => monthlyExpense[m] || 0);

 const chartOptions = {
  chart: {
    type: "area",
    toolbar: { 
      show: true, 
        tools: {
          download: true,  // tombol download
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
      },

    },
    dropShadow: {
      enabled: true,
      top: 8,
      left: 2,
      blur: 6,
      opacity: 0.3,
      color: "#d4291dff", // warna shadow sama dengan line
    },
  },
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3, // bikin lebih tebal biar menyala
      colors: ["#FF1744"], // neon red
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.7,
        gradientToColors: ["#e0574bff"], // gradasi merah ke pink
        inverseColors: false,
        opacityFrom: 0.9,
        opacityTo: 0.3,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: months,
      labels: { style: { colors: "#555", fontWeight: 500 } },
    },
    yaxis: {
      labels: { style: { colors: "#000000ff", fontWeight: 500 } },
    },
    tooltip: {
      theme: "dark", // biar glow lebih terasa
    },
  };


  const series = [
    {
      name: "Pengeluaran per Bulan",
      data: dataValues,
    },
  ];
  return (
    <div className='w-full p-3 mt-10 shadow-lg rounded'>
      <h1 className='font-bold text-xl mb-5'>Pengeluaran Perbulan</h1>
      <Chart series={series} options={chartOptions} height={400}/>
    </div>
  )
}

export default LineChart;