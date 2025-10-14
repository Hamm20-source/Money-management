import React, { useEffect, useState } from 'react'
import { auth, database } from '../../utils/Firebase';
import { get, ref } from 'firebase/database';
import EditingTransactionsForm from "./EditingTransactionsForm";
import DeleteModal from "./DeleteModal";
import TransactionsFilter from '../filter/TransactionsFilter';
import { onAuthStateChanged } from 'firebase/auth';
import { GrUpdate } from 'react-icons/gr';
import { BiTrash } from 'react-icons/bi';


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
              let isMatch = true;
              
              if (filter.type === "today") {
                const today = new Date();
                isMatch =
                  date.getDate() === today.getDate() &&
                  date.getMonth() === today.getMonth() &&
                  date.getFullYear() === today.getFullYear()
              } else if (filter.type === "month") {
                isMatch =
                  date.getMonth() === filter.month &&
                  date.getFullYear() === filter.year 
              } else if (filter.type === "year") {
                  isMatch = date.getFullYear() === filter.year;
              }
              if (filter.transactionsType !== "all") {
                isMatch = isMatch && t.type === filter.transactionsType
              }
              return isMatch;
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
    <div className='relative p-5 md:p-20 z-0'> 
      <h1 className='font-bold text-xl mb-10'>Semua Transaksi</h1>

      <TransactionsFilter filter={filter} setFilter={setFilter}/>

      <div className="flex flex-col md:flex-row gap-6 p-5 md:p-2">
            <div className={`overflow-x-auto transition-all duration-300 ${editingTransactions ? "md:w-2/3 w-full" : "w-full"}`}>
              <table className="min-w-full text-center  rounded-lg h-64 md:44 shadow-md ">
                <thead className="border-b-2 border-gray-200">
                  <tr className="text-center">
                    <th className="px-4 py-2 border-b">No</th>
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
                    {transactions.length > 0 ? (
                      transactions.map((t, index) => (
                        <tr key={t.id}>
                          <td className="border  border-gray-300 text-xs md:text-lg">{index + 1}</td>
                          <td className="border-t border-t-gray-300 text-xs md:text-lg">{t.tanggal}</td>
                          <td className="border-t border-t-gray-300 text-xs md:text-lg">{t.type}</td>
                          <td className="border-t border-t-gray-300 text-xs md:text-lg">{t.kategori}</td>
                          <td className={`border-t border-t-gray-300 text-xs md:text-lg ${t.type === "Pemasukan" ? "text-green-500" : "text-red-500"}`}>
                            {t.type === "Pemasukan" ? "+" : "-"} {" "}
                            {(t.nominal || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="border-t border-t-gray-300 text-xs md:text-lg">{t.catatan || "-"}</td>
                          <td className="border-t border-t-gray-300 text-xs md:text-lg">
                            <button className="text center cursor-pointer" onClick={() => setEditingTransactions(t)}>
                                <GrUpdate className='text-xs md:text-lg'/>
                            </button>
                          </td>
                          <td className="border-t border-r border -gray-300 ">
                            <button className="text-center cursor-pointer" onClick={() => setTransactionsDelete(t)}>
                               <BiTrash className='text-xs md:text-xl'/>
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

