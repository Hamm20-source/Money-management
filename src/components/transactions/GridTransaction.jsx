import React, { useEffect, useState } from "react";
import { fetchExpense, fetchIncome } from "../../utils/Firebase";
import Chart from "react-apexcharts";
import dayjs from "dayjs";

const GridTransaction = ({ uid }) => {
  const [income, setIncome] = useState([]);
  const [expense, setExpense] = useState([]);
  const [total, setTotal] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  useEffect(() => {
    if (!uid) return;

    fetchIncome(uid).then((data) => {
      console.log("Income Data:", data);
      setIncome(data);
    });

    fetchExpense(uid).then((data) => {
      console.log("Expense Data:", data);
      setExpense(data);
    });
  }, [uid]);

  useEffect(() => {
    const totalIncome = income.reduce((sum, item) => sum + (Number(item.nominal) || 0), 0);
    const totalExpense = expense.reduce((sum, item) => sum + (Number(item.nominal) || 0), 0);

    setTotal({
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    });
  }, [income, expense]);

  // === MAPPING DATA PER HARI SELAMA 30 HARI TERAKHIR ===
  const days = Array.from({ length: 30 }, (_, i) =>
    dayjs().subtract(29 - i, "day").format("YYYY-MM-DD")
  );

  const mapToDaily = (data) => {
    return days.map((day) => {
      const sum = data
        .filter((item) => item.tanggal === day)
        .reduce((acc, cur) => acc + (Number(cur.nominal) || 0), 0);
      return sum;
    });
  };

  const incomeSeries = mapToDaily(income);
  const expenseSeries = mapToDaily(expense);
  const balanceSeries = incomeSeries.map((val, i) => val - (expenseSeries[i] || 0));

  const baseOptions = {
    chart: { type: "line", sparkline: { enabled: true } },
    stroke: { curve: "smooth", width: 3 },
    tooltip: {
      y: { 
        formatter: (val) => {
          const formatted = Math.abs(val).toLocaleString("id-ID");
          return (val < 0 ?  `- Rp${formatted}` : `Rp${formatted}`)
        }
       },
    },
    xaxis: {
      categories: days.map((d) => dayjs(d).format("DD")), // cuma hari doang biar singkat
    },
  };

  return (
    <div className="mt-5">
      <h1 className="font-bold text-xl mb-5">Ringkasan Bulanan</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 font-semibold space-y-4 md:space-y-0">
        
        {/* Saldo */}
        <div className="p-4 w-full shadow-lg rounded space-y-6">
          <h2 className="font-bold">Total Saldo</h2>
          <p>Rp{total.balance.toLocaleString()}</p>
          <Chart
            options={{ ...baseOptions, colors: ["#2196F3"] }}
            series={[{ name: "Saldo", data: balanceSeries }]}
            type="line"
            height={100}
          />
        </div>

        {/* Pengeluaran */}
        <div className="p-4 w-full shadow-lg rounded space-y-6">
          <h2 className="font-bold">
            Pengeluaran
          </h2>
          <p>Rp{total.expense.toLocaleString()}</p>
          <Chart
            options={{ ...baseOptions, colors: ["#F44336"] }}
            series={[{ name: "Pengeluaran", data: expenseSeries }]}
            type="line"
            height={100}
          />
        </div>

        {/* Pemasukan */}
        <div className="p-4 w-full shadow-lg rounded space-y-6">
          <h2 className="font-bold">
            Pemasukan
          </h2>
          <p>Rp{total.income.toLocaleString()}</p>
          <Chart
            options={{ ...baseOptions, colors: ["#4CAF50"] }}
            series={[{ name: "Pemasukan", data: incomeSeries }]}
            type="line"
            height={100}
          />
        </div>
      </div>
    </div>
  );
};

export default GridTransaction;
