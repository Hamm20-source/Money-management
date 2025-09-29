import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { database, auth } from "../../utils/Firebase";
import { get, ref } from "firebase/database";
import AddExpense from "./AddExpense";
import AddIncome from "./AddIncome";
import updateIcon from "../../assets/Prototype Money Management/UpdateIcon.png";
import deleteIcon from "../../assets/Prototype Money Management/DeleteIcon.png";
import EditingTransactionsForm from "./EditingTransactionsForm";
import DeleteModal from "./DeleteModal";

// src/components/TransactionTable.jsx
export default function TransactionTable() {
  const navigate = useNavigate()
  const [latestTransactions, setLatestTransactions] = useState([]);
  const [editingTransactions, setEditingTransactions] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) return;


      try {
        const snapshot = await get(ref(database, `transactions/${user.uid}`));
        if (snapshot.exists()) {
          const data = snapshot.val();

          const incomeData = data.income 
          ? Object.entries(data.income).map(([key, item]) =>({
            ...item,
            id: key,
            type: "Pemasukan"
          }))
          : [];

          const expenseData = data.expense
          ? Object.entries(data.expense).map(([key, item]) => ({
            ...item,
            id: key,
            type: "Pengeluaran"
          }))
          : [];

          const alltransactions = [...incomeData, ...expenseData];

          alltransactions.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));

          setLatestTransactions(alltransactions.slice(0, 3));
        } else {
          setLatestTransactions([]);
        }
      } catch (error) {
        console.error("Error fetching transactions", error)
      }
    };

    fetchData();
  }, []);


  return (
    <div className="relative mt-10 shadow-2xl inset-shadow-2xs rounded ">
      <div className='flex flex-col items-center justify-between gap-5 mb-10'>
        <h1 className='font-bold text-xl'>List Transaksi</h1>
        <div className="flex items-center gap-4">
          <AddIncome/>
          <AddExpense/>
        </div>
      </div>


      <div className="flex flex-col md:flex-row gap-6">
        <div className={`overflow-x-auto transition-all duration-300 ${editingTransactions ? "md:w-2/3 w-full" : "w-full"}`}>
          <table className="min-w-full text-center  rounded-lg shadow-md">
            <thead className="border-b-2 border-gray-200">
              <tr className="text-center">
                <th className="px-4 py-2 border-b">Tanggal</th>
                <th className="px-4 py-2 border-b">Tipe</th>
                <th className="px-4 py-2 border-b">Kategori</th>
                <th className="px-4 py-2 border-b">Nominal</th>
                <th className="px-4 py-2 border-b">Catatan</th>
                <th className="px-4 py-2 border-b">Update</th>
                <th className="px-4 py-2 border-b">Delete</th>
              </tr>
            </thead>
            <tbody>
                {latestTransactions.length > 0 ? (
                  latestTransactions.map((t, idx) => (
                    <tr key={idx}>
                      <td className="border-t border-t-gray-300">{t.tanggal}</td>
                      <td className="border-t border-t-gray-300">{t.type}</td>
                      <td className="border-t border-t-gray-300">{t.kategori}</td>
                      <td className={`border-t border-t-gray-300 ${t.type === "Pemasukan" ? "text-green-500" : "text-red-500"}`}>
                        {t.type === "Pemasukan" ? "+" : "-"} {" "}
                        Rp{(t.nominal || 0).toLocaleString("id-ID")}
                      </td>
                      <td className="border-t border-t-gray-300">{t.catatan || "-"}</td>
                      <td className="border-t border-t-gray-300">
                        <button className="text center cursor-pointer" onClick={() => setEditingTransactions(t)}>
                            <img src={updateIcon} className="w-6"/>
                        </button>
                      </td>
                      <td className="border-t border-t-gray-300">
                        <button className="text-center cursor-pointer" onClick={() => setTransactionToDelete(t)}>
                            <img src={deleteIcon} className="w-6"/>
                        </button>
                      </td>
                    </tr>
                  ))
                ):(
                  <tr>
                    <td>
                      Belum Ada Transaksi
                    </td>
                  </tr>
                )}
            </tbody>
          </table>
        </div>
        {editingTransactions && (
          <div className="w-full md:w-1/3">
            <EditingTransactionsForm
              transactions={editingTransactions}
              onClose={() => setEditingTransactions(null)}
              onUpdated={(updated) => {
                setLatestTransactions((prev) => 
                prev.map((t) => (t.id === updated.id ? {...t, ...updated } : t))
                )
              }}
            />
          </div>
        )}
      </div>
        {transactionToDelete && (
            <DeleteModal
              transactionsDelete={transactionToDelete}
              onClose={() => setTransactionToDelete(null)}
               onDeleted={(deletedId) => {
                // langsung update state biar tabel auto refresh
                setLatestTransactions((prev) => prev.filter(t => t.id !== deletedId));
              }}
            />
        )}


      <div className="flex justify-center mt-10">
        <button className="w-fit font-bold bg-[#C0C0C0] px-6 py-3 rounded-2xl shadow cursor-pointer"
         onClick={() => navigate("/alltransactions")}
        >
          Lihat Semua
        </button>
      </div>
          
    </div>
  );
}
