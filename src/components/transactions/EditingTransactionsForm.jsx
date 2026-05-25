import React, { useState } from 'react'
import useTransactionStore from '../../Store/UseTransactionStore';
import toast from 'react-hot-toast';


export default function EditingTransactionsForm  ({ transactions, onClose })  {
    const updateTransactions = useTransactionStore((state) => state.updateTransaction);
    const [formData, setFormData] = useState({
        nominal: transactions.nominal || 0,
        kategori: transactions.kategori || "",
        catatan: transactions.catatan || "",
        account: transactions.account || "",
    });

    const categoryMap = {
        income: ["Gaji", "Bonus", "Investasi", "Hadiah", "Penjualan", "Lainnya"],
        expense: ["Makanan", "Transportasi", "Hiburan", "Kesehatan", "Pendidikan", "Lainnya"]
    };

    const accountOptions = [ 
        "Cash",
        
        // Bank
        "BCA",
        "BRI",
        "BNI",
        "Mandiri",
        "CIMB Niaga",
        "BTN",
        "Permata Bank",
        "Bank Jago",
        "SeaBank",
        "Jenius",
        "Neo Bank",

        // E-Wallet
        "Dana",
        "GoPay",
        "OVO",
        "ShopeePay",
        "LinkAja",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
          if (name === "nominal") {
          // hapus semua titik lalu parse ke angka
          const raw = value.replace(/\./g, "");
          setFormData({
            ...formData,
            nominal: raw ? Number(raw) : 0,
          });
        } else {
          setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

      try {
          const result = await updateTransactions(
          transactions.id,
          formData
          );
          
        if (result) {
            toast.success("Updated Success", {
              duration: 3000,
              position: "top-center",
            })
            onClose();
        } else {
          toast.error("Failed to update transaction", {
            duration: 3000,
            position: "top-center",
          });
        }
      } catch (error) {
        console.error("Error updating transaction:", error);
      } 
      
    };

  return (
    <div>
      <div className="p-4 border border-gray-300  rounded-lg bg-white">
        <h2 className="font-bold mb-3">Edit Transaksi {transactions.tanggal} / {transactions.type}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="nominal"
            value={formData.nominal.toLocaleString("id-ID")}
            onChange={handleChange}
            placeholder="Nominal"
            className="border border-gray-300 p-1 mb-2 w-full rounded"
          />

          <select 
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            className="border border-gray-300 p-1 mb-2 w-full rounded"
          >
            <option value="">Pilih Kategori</option>
            {categoryMap[transactions.type]?.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select> 

          <select 
            name="account"
            value={formData.account}
            onChange={handleChange}
            className="border border-gray-300 p-1 mb-2 w-full rounded"
          >
            <option value="">Pilih Akun</option>
            {accountOptions.map((acc) => (
              <option key={acc} value={acc}>{acc}</option>
            ))}
          </select> 

          <textarea
            name="catatan"
            value={formData.catatan}
            onChange={handleChange}
            placeholder="Catatan"
            className="border border-gray-300 p-1 mb-2 w-full rounded"
          />

          <div className="flex gap-2">
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer">
              Simpan
            </button>
            <button type="button" onClick={onClose} className="bg-gray-300 px-4 py-2 rounded cursor-pointer">
              Batal
            </button>
          </div>
        </form>
     </div>
    </div>
  )
}

