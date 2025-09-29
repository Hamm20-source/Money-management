import { fetchIncome, fetchExpense } from "./Firebase";

// type: "income" | "expense"
export async function fetchGridTransactions(uid, type) {
  if (!uid) return [];

  const data = type === "income" ? await fetchIncome(uid) : await fetchExpense(uid);

  // buat list 7 hari terakhir
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i)); // urutan dari lama ke terbaru
    return d.toISOString().split("T")[0];
  });

  // group by tanggal
// group by tanggal
const grouped = days.map((day) => {
  return data
    .filter((t) => t.tanggal === day) // ✅ langsung compare string
    .reduce((sum, t) => sum + (t.nominal || 0), 0);
});

  return { labels: days, values: grouped };
}
