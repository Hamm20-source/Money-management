import React, { useEffect, useState } from 'react'
import { auth, database } from '../../utils/Firebase';
import { get, ref } from 'firebase/database';
import updateIcon from "../../assets/Prototype Money Management/UpdateIcon.png";
import deleteIcon from "../../assets/Prototype Money Management/DeleteIcon.png";
import EditingTransactionsForm from "./EditingTransactionsForm";
import DeleteModal from "./DeleteModal";
import TransactionsFilter from '../filter/TransactionsFilter';
import { onAuthStateChanged } from 'firebase/auth';


export default function AllTransactionsTable() {
  const [transactions, setTransactions] = useState([]);
  const [editingTransactions, setEditingTransactions] = useState(null);
  const [transactionDelete, setTransactionsDelete] = useState(null);
  const [filter, setFilter] = useState({ 
    type: "all",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    transactionsType: "all"
   });
   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData =  onAuthStateChanged(auth, async (user) => {
       if (!user) {
        setLoading(false);
        setTransactions([]);
        return;
      }
      try {
        setLoading(true)
        const snapshot = await get(ref(database, `transactions/${user.uid}`));

          if (snapshot.exists()) {
            const data = snapshot.val();
  
            const incomeData = data.income 
            ? Object.entries(data.income).map(([key, item]) => ({
              ...item,
              id: key,
              type: "Pemasukan"
            })) : [];
  
            const expenseData = data.expense
            ? Object.entries(data.expense).map(([key, item]) => ({
              ...item,
              id: key,
              type: "Pengeluaran"
            })) : [];
  
            let alltransactions = [...incomeData, ...expenseData];
            alltransactions.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
            alltransactions = alltransactions.filter((t) => {
              const date = new Date(t.tanggal);
              
              if (filter.type === "today") {
                const today = new Date();
                return (
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear()
                );
              }
              if (filter.type === "month") {
                return (
                  date.getMonth() === filter.month &&
                  date.getFullYear() === filter.year 
                )
              }
              if (filter.type === "year") {
                  return date.getFullYear() === filter.year;
              }
              if (filter.transactionsType !== "all") {
                return t.type === filter.transactionsType
              }
              return true;
            });
  
            setTransactions(alltransactions)
          } else {
            setTransactions([]);
          }
      } catch (error) {
        console.error("Error Fetching transactions", error)
      } finally {
        setLoading(false);
      };
    });
    return () => fetchData()
  }, [filter]);


  if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="animate-pulse text-lg font-semibold">Loading...</p>
        </div>
      );
    }

  return (
    <div className='p-0 md:p-20'> 
      <h1 className='font-bold text-xl mb-10'>Semua Transaksi</h1>

      <TransactionsFilter filter={filter} setFilter={setFilter}/>

      <div className="flex flex-col md:flex-row gap-6">
            <div className={`overflow-x-auto transition-all duration-300 ${editingTransactions ? "md:w-2/3 w-full" : "w-full"}`}>
              <table className="min-w-full text-center  rounded-lg border border-gray-300 shadow-md">
                <thead className="border-2 border-gray-200">
                  <tr className="bg-[#6f94e4] text-white text-center">
                    <th className="px-4 py-2 border">Tanggal</th>
                    <th className="px-4 py-2 border">Tipe</th>
                    <th className="px-4 py-2 border">Kategori</th>
                    <th className="px-4 py-2 border">Nominal</th>
                    <th className="px-4 py-2 border">Catatan</th>
                    <th className="px-4 py-2 border">Update</th>
                    <th className="px-4 py-2 border">Delete</th> 
                  </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                      transactions.map((t) => (
                        <tr key={t.id}>
                          <td className="border-t border-r border-r-gray-300">{t.tanggal}</td>
                          <td className="border-t border-r border-r-gray-300">{t.type}</td>
                          <td className="border-t border-r border-r-gray-300">{t.kategori}</td>
                          <td className="border-t border-r border-r-gray-300">{(t.nominal || 0).toLocaleString("id-ID")}</td>
                          <td className="border-t border-r border-r-gray-300">{t.catatan || "-"}</td>
                          <td className="border-t border-r border-r-gray-300">
                            <button className="text center cursor-pointer" onClick={() => setEditingTransactions(t)}>
                                <img src={updateIcon} className="w-6"/>
                            </button>
                          </td>
                          <td className="border-t">
                            <button className="text-center cursor-pointer" onClick={() => setTransactionsDelete(t)}>
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
                    setTransactions((prev) => 
                    prev.map((t) => (t.id === updated.id ? {...t, ...updated } : t))
                    )
                  }}
                />
              </div>
            )}
          </div>
            {transactionDelete && (
                <DeleteModal
                  transactionsDelete={transactionDelete}
                  onClose={() => setTransactionsDelete(null)}
                   onDeleted={(deletedId) => {
                    // langsung update state biar tabel auto refresh
                    setTransactions((prev) => prev.filter(t => t.id !== deletedId));
                  }}
                />
            )}
    
    </div>
  )
};

