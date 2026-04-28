import React, { useMemo, useState } from 'react'
import EditingTransactionsForm from "./EditingTransactionsForm";
import useTransactionStore from '../../Store/UseTransactionStore';
import DeleteModal from "./DeleteModal";
import AddTransactions from './AddTransactions';
import TransactionsFilter from '../filter/TransactionsFilter';
import ExportExcel from '../../features/exportexcel/ExportExcel';
import Pagination from '../filter/Pagination';
import { GrUpdate } from 'react-icons/gr';
import { BiTrash } from 'react-icons/bi';


export default function AllTransactionsTable() {
   const {
    transactions,
    loading, 
    addTransactions,
    updateTransactions,
    deleteTransactions
  } = useTransactionStore();
  const [editingTransactions, setEditingTransactions] = useState(null);
  const [transactionDelete, setTransactionsDelete] = useState(null);

  const [filter, setFilter] = useState({ 
    type: "all",
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
    transactionsType: "all"
   });
   const [currentPage, setCurrentPage] = useState(1);
   const transactionsPerPage = 20;
   
   const filteredTransactions = useMemo(() => {
     return transactions.filter((t) => {
       const date = new Date(t.tanggal);
       let isMatch = true;
       
       if (filter.type === "today") {
         const today = new Date();
         isMatch =
         date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
        } else if (filter.type === "month") {
          isMatch =
          date.getMonth() === filter.month &&
          date.getFullYear() === filter.year;
        } else if (filter.type === "year") {
              isMatch = date.getFullYear() === filter.year;
            }

        if (filter.transactionsType !== "all") {
          isMatch = 
            isMatch && 
            (filter.transactionsType === "income"
              ? t.type === "income"
              : t.type === "expense"
            ) 
          };
          
          return isMatch;
        });
      }, [transactions, filter]);
          

  const indefOfLastTransactions = currentPage * transactionsPerPage;
  const indexOfFirstTransactions = indefOfLastTransactions - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstTransactions, indefOfLastTransactions);

  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage)
  const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="animate-pulse text-lg font-semibold">Loading...</p>
        </div>
      );
    }
 
  return (
    <div className='p-5 md:p-20 z-0'> 
      <h1 className='font-bold text-xl mb-10'>Semua Transaksi</h1>

      <div className='flex flex-wrap justify-between items-center mb-4'>
        <TransactionsFilter filter={filter} setFilter={setFilter}/>
          <div className='flex flex-wrap items-center gap-4 mt-5'>
            <AddTransactions onSuccess={addTransactions}/>
            <ExportExcel transactions={filteredTransactions} filter={filter}/>
          </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6 p-5 md:p-2">
            <div className={`overflow-x-auto transition-all duration-300 ${editingTransactions || transactionDelete ? "md:w-2/3 w-full" : "w-full"}`}>
              <table className="min-w-full text-center rounded-lg h-64 md:44 shadow-md ">
                <thead className="border-b-2 border-gray-200 bg-blue-200">
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
                    {currentTransactions.length > 0 ? (
                      currentTransactions.map((t, index) => (
                        <tr key={t.id}>
                          <td className="border border-gray-300 text-xs lg:text-base">{indexOfFirstTransactions + index + 1}</td>
                          <td className="border-t border-b border-gray-300 text-xs lg:text-base">{t.tanggal}</td>
                          <td className="border-t border-b border-gray-300 text-xs lg:text-base">{t.type}</td>
                          <td className="border-t border-b border-b-gray-300 text-xs lg:text-base">{t.kategori}</td>
                          <td className={`border-t border-b border-gray-300 text-xs lg:text-base ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                            {t.type === "income" ? "+" : "-"} {" "}
                            Rp{(t.nominal || 0).toLocaleString("id-ID")}
                          </td>
                          <td className="border-t border-b border-gray-300 text-xs lg:text-base">{t.catatan || "-"}</td>
                          <td className="border-t border-b border-gray-300 text-xs lg:text-base">
                            <button className="text center cursor-pointer" onClick={() => setEditingTransactions(t)}>
                                <GrUpdate className='text-xs lg:text-base'/>
                            </button>
                          </td>
                          <td className="border-t border-r border-b border-gray-300 ">
                            <button className="text-center cursor-pointer" onClick={() => setTransactionsDelete(t)}>
                               <BiTrash className='text-xs lg:text-base'/>
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
                  onUpdated={(updatedData) => {
                    updateTransactions(editingTransactions.id, updatedData);
                    setEditingTransactions(null);
                  }}
                />
              </div>
            )}

            {transactionDelete && (
              <div className='w-full md:w-1/3'>
                <DeleteModal
                  transactionsDelete={transactionDelete}
                  onClose={() => setTransactionsDelete(null)}
                  onDeleted={() => {
                    deleteTransactions(transactionDelete.id);
                    setTransactionsDelete(null);
                  }}
                />
              </div>
            )}
    
          </div>
            
            {filteredTransactions.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onNext={goToNextPage}
                onPrev={goToPrevPage}
              />
            )}
    </div>
  )
};

