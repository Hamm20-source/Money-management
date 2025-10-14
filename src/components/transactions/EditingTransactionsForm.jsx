import React, { useState } from 'react'
import { updateTransactions } from '../../services/UpdateAndDelete';
import toast, { Toaster } from 'react-hot-toast';

export default function EditingTransactionsForm  ({ transactions, onClose, onUpdated })  {
    const [formData, setFormData] = useState({
        nominal: transactions.nominal || 0,
        kategori: transactions.kategori || "",
        catatan: transactions.catatan || ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
          if (name === "nominal") {
          // hapus semua titik lalu parse ke angka
          const raw = value.replace(/\./g, "");
          setFormData({
            ...formData,
            nominal: raw ? parseInt(raw) : 0,
          });
        } else {
          setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
          ...formData,
          id: transactions.id,
          type: transactions.type
        };

        await updateTransactions(
            transactions.type === "Pemasukan" ? "income" : "expense",
            transactions.id,
            formData
        );


        if (onUpdated) onUpdated(updatedData)
        console.log("Update", transactions);
        toast.success("Updated Success", {
          duration: 3000,
          position: "top-center",
        })

        onClose();
    };

  return (
    <div>
      <div className="p-4 border border-gray-200 shadow-md rounded bg-white shadow">
        <h2 className="font-bold mb-3">Edit Transaksi</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            name="nominal"
            value={formData.nominal.toLocaleString("id-ID")}
            onChange={handleChange}
            placeholder="Nominal"
            className="border p-1 mb-2 w-full"
          />
          <input
            type="text"
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            placeholder="Kategori"
            className="border p-1 mb-2 w-full"
          />
          <textarea
            name="catatan"
            value={formData.catatan}
            onChange={handleChange}
            placeholder="Catatan"
            className="border p-1 mb-2 w-full"
          />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Simpan
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded">
              Batal
            </button>
          </div>
        </form>
     </div>
    </div>
  )
}

