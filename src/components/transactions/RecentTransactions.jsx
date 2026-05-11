import { useState } from "react";
//Transaction and editing components
import EditingTransactionsForm from "./EditingTransactionsForm";
import DeleteModal from "./DeleteModal";
import AddTransactions from "./AddTransactions";
import useTransactionStore from "../../Store/UseTransactionStore";

//React Icons
import { GrUpdate } from "react-icons/gr";
import { BiTrash } from "react-icons/bi";

// src/components/TransactionTable.jsx
export default function RecentTransactions() {
  const {
    transactions,
    loading, 
    addTransactions,
    updateTransactions,
    deleteTransactions
  } = useTransactionStore();

  const [editingTransactions, setEditingTransactions] = useState(null);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  const latestTransactions = [...transactions]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0,3)
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="animate-pulse text-lg font-semibold">Loading...</p>
        </div>
      )
    };



  return (
    <div>
      <h1 className='font-semibold text-lg lg:text-xl'>List Transaksi Terbaru</h1>
      <div className="relative mt-5 shadow-2xl border border-gray-300 rounded-lg p-0 md:p-6">
        <div className='flex flex-col md:flex-row items-center justify-between gap-5 mt-6 mb-10'>
          <div className="flex items-center gap-4">
            <AddTransactions onSucces={addTransactions}/>
          </div>
        </div>


        <div className="flex flex-col md:flex-row gap-6 p-5 md:p-0 h-full ">
          <div className={`overflow-x-auto transition-all duration-300 ${editingTransactions || transactionToDelete ? "md:w-2/3 w-full " : "w-full"}`}>
            <table className="min-w-full text-center rounded-lg shadow-md h-64 md:h-44">
              <thead className="border-b-2 border-gray-200">
                <tr className="text-center text-base bg-blue-200">
                  <th className="px-4 py-2 border-b font-semibold">Tanggal</th>
                  <th className="px-4 py-2 border-b font-semibold">Tipe</th>
                  <th className="px-4 py-2 border-b font-semibold">Kategori</th>
                  <th className="px-4 py-2 border-b font-semibold">Nominal</th>
                  <th className="px-4 py-2 border-b font-semibold">Catatan</th>
                  <th className="px-4 py-2 border-b font-semibold">Update</th>
                  <th className="px-4 py-2 border-b font-semibold">Delete</th>
                </tr>
              </thead>
              <tbody>
                  {latestTransactions.length > 0 ? (
                    latestTransactions.map((t, idx) => (
                      <tr key={idx}>
                        <td className="border-t border-t-gray-300 text-xs lg:text-base">{t.tanggal}</td>
                        <td className="border-t border-t-gray-300 text-xs lg:text-base">{t.type}</td>
                        <td className="border-t border-t-gray-300 text-xs lg:text-base">{t.kategori}</td>
                        <td className={`border-t border-t-gray-300 text-xs lg:text-base  ${t.type === "income" ? "text-green-500" : "text-red-500"}`}>
                          {t.type === "income" ? "+" : "-"} {" "}
                          Rp{(t.nominal || 0).toLocaleString("id-ID")}
                        </td>
                        <td className="border-t border-t-gray-300 text-xs lg:text-base">{t.catatan || "-"}</td>
                        <td className="border-t border-t-gray-300 text-xs lg:text-base  ">
                          <button className="text center cursor-pointer" 
                              onClick={() => setEditingTransactions(t)} 
                          >
                            <GrUpdate className="text-xs lg:text-xl" />
                          </button>
                        </td>
                        <td className="border-t border-t-gray-300">
                          <button className="text-center cursor-pointer" onClick={() => setTransactionToDelete(t)}>
                              <BiTrash className="text-xs lg:text-xl"/>
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
                    updateTransactions(
                      editingTransactions.id,
                      updatedData
                    );
                    setEditingTransactions(null)
                  }}
                />
              </div>
            )}
            
            {transactionToDelete && (
              <div className="w-full md:w-1/3 ">
                <DeleteModal
                  transactionsDelete={transactionToDelete}
                  onClose={() => setTransactionToDelete(null)}
                  onDeleted={() => {
                  deleteTransactions(
                      transactionToDelete.id
                  );
                  setTransactionToDelete(null)
                  }}
                />
              </div>
            )}
        </div>
            
      </div>
    </div>
  );
}
