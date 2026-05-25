import React, { useMemo} from "react";
import dayjs from "dayjs";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

//Zustand Store component
import useTransactionStore from "../../Store/UseTransactionStore";

// register chart
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip);

const GridTransaction = () => {
  const transaction = useTransactionStore((state) => state.transactions);
 
  const parseNominal = (value) => {
    if (value == null) return 0;
    const cleaned = String(value).replace(/[^[0-9],-]/g, "").replace(/,/g, ".");
    return Number(cleaned) || 0;
  };

  // ================= TOTAL =================
  const total = useMemo(() => {
    const totalIncome = transaction
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + parseNominal(t.nominal), 0);

    const totalExpense = transaction
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + parseNominal(t.nominal), 0);

    return {
      income: totalIncome,
      expense: totalExpense,
      balance: totalIncome - totalExpense,
    };
  }, [transaction]);

  // ================= DATE RANGE (30 HARI) =================
  const days = useMemo(
    () =>
      Array.from({ length: 30 }, (_, i) =>
        dayjs().subtract(29 - i, "day").format("YYYY-MM-DD")
      ),
    []
  );

  const labels = useMemo(
    () => days.map((d) => dayjs(d).format("DD")),
    [days]
  );

  // ================= MAPPING DATA =================
  const normalizeDate = (value) => {
    const date = dayjs(value);
    return date.isValid() ? date.format("YYYY-MM-DD") : null;
  };

  const { incomeSeries, expenseSeries, balanceSeries } = useMemo(() => {
    const incomeByDay = new Map(days.map((day) => [day, 0]));
    const expenseByDay = new Map(days.map((day) => [day, 0]));

    transaction.forEach((item) => {
      const day = normalizeDate(item.tanggal);
      if (!day || !incomeByDay.has(day)) return;

      const nominal = parseNominal(item.nominal);
      if (item.type === "income") {
        incomeByDay.set(day, incomeByDay.get(day) + nominal);
      } else if (item.type === "expense") {
        expenseByDay.set(day, expenseByDay.get(day) + nominal);
      }
    });

    const incomeSeries = days.map((day) => incomeByDay.get(day) || 0);
    const expenseSeries = days.map((day) => expenseByDay.get(day) || 0);
    const balanceSeries = incomeSeries.reduce((acc, inc, idx) => {
      const prevBalance = idx === 0 ? 0 : acc[idx - 1];
      acc.push(prevBalance + inc - expenseSeries[idx]);
      return acc;
    }, []);

    return { incomeSeries, expenseSeries, balanceSeries };
  }, [transaction, days]);

  // ================= CHART CONFIG =================
  const createChartData = (label, data, color) => ({
    labels,
    datasets: [
      {
        label,
        data,
        borderColor: color,
        backgroundColor: color + "33",
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 0,
        hitRadius: 10,
        borderWith: 2,
      },
    ],
  });

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => {
            const val = ctx.raw;
            return `Rp${Number(val).toLocaleString("id-ID")}`;
          },
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  };

  return (
    <div className="mt-5">
      <h1 className="font-semibold text-xl mb-5">Ringkasan Bulanan</h1>

      {transaction.length === 0 ? (
        <div className="flex justify-center items-center h-64 w-full p-5 shadow-2xl border border-gray-300 rounded-lg">
          <p className="text-gray-500 text-lg">
            Belum ada data yang dimasukkan
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          <div className="p-4 shadow-lg rounded space-y-4">
            <h2 className="font-semibold">Total Saldo</h2>
            <p>Rp{total.balance.toLocaleString("id-ID")}</p>
            <Line
              data={createChartData("Saldo", balanceSeries, "#2196F3")}
              options={options}
            />
          </div>

          <div className="p-4 shadow-lg rounded space-y-4">
            <h2 className="font-semibold">Pengeluaran</h2>
            <p>Rp{total.expense.toLocaleString("id-ID")}</p>
            <Line
              data={createChartData("Expense", expenseSeries, "#F44336")}
              options={options}
            />
          </div>

          <div className="p-4 shadow-lg rounded space-y-4">
            <h2 className="font-semibold">Pemasukan</h2>
            <p>Rp{total.income.toLocaleString("id-ID")}</p>
            <Line
              data={createChartData("Income", incomeSeries, "#4CAF50")}
              options={options}
            />
          </div>

        </div>
      )}
    </div>
  );
};

export default GridTransaction;