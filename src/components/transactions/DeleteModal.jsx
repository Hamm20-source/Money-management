import React from 'react'
import { deleteTransactions } from '../../services/UpdateAndDelete';
import toast from 'react-hot-toast';

export default function DeleteModal({ transactionsDelete, onClose, onDeleted }) {
    const handleDelete = async () => {
        const confirmDelete = window.confirm("Yakin mau hapus transaksi ini");

        if (!confirmDelete) return;

        await deleteTransactions(
            transactionsDelete.type === "Pemasukan" ? "income" : "expense",
            transactionsDelete.id
        )

        if (onDeleted) onDeleted(transactionsDelete.id)
        console.log("Deleting:", transactionsDelete);
        toast.success("Delete Succes", {
          position: "top-center",
          duration: 2000,
          iconTheme: {
            primary: '#d80d0dff'
          }
        })

        onClose()
    };

  return (
    <div className='w-full z-50'>
      <div className='absolute right-0 top-0 bg-white shadow-lg h-30 p-2 rounded-lg space-y-4'>
        <h1 className='font-bold'>Yakin mau hapus transaksi ini?</h1>
        <div className='flex justify-center items-center gap-5'>
          <button className='bg-red-500 px-4 py-2 text-white font-medium cursor-pointer' onClick={handleDelete}>Ya</button>
          <button className='cursor-pointer' onClick={onClose}>Batal</button>
        </div>
      </div>
    </div>
  )
};

