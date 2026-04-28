import React, {useState} from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { BiAddToQueue } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import useTransactionStore from "../../Store/UseTransactionStore";

export default function AddTransactions({ onSuccess }) {
    const addTransactions = useTransactionStore((state) => state.addTransactions);
    const [open, setOpen] = useState(false);

    const [form, setForm] = useState({
            type: 'income',
            tanggal: "",
            kategori: "",
            nominal: "",
            catatan: ""
        });

    //Mapping kategori
    const categoryMap = {
        income: ["Gaji", "Bonus", "Investasi", "Hadiah", "Penjualan", "Lainnya"],
        expense: ["Makanan", "Transportasi", "Hiburan", "Kesehatan", "Pendidikan", "Lainnya"]
    };

    const categories = categoryMap[form.type] || [];    

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
                await addTransactions({
                ...form,
                nominal: Number(form.nominal)
            })

            toast.success("Transaksi berhasil ditambahkan");
            setForm({ type: 'income', tanggal: "", kategori: "", nominal: "", catatan: "" });
            setOpen(false);

            onSuccess?.();

        } catch (error) {
            console.error('Error fetching session:', error);
            toast.error("Gagal menambahkan transaksi");
        }
    };

    const isIncome = form.type === 'income';

    return (
        <>
        <Toaster position="top-right" />

        {/* BUTTON */}
        <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 bg-black font-semibold text-white text-sm px-4 py-1 rounded-lg cursor-pointer"
        >
            <BiAddToQueue />
            Tambah Transaksi
        </button>

        {/* MODAL */}
        {open && (
            <div className="fixed inset-0 flex justify-center items-center bg-black/40 backdrop-blur-sm z-50">
            <div className="relative bg-white p-8 rounded-xl w-[400px]">

                {/* CLOSE */}
                <button
                onClick={() => setOpen(false)}
                className="absolute top-3 right-3"
                >
                <CgClose />
                </button>

                {/* TITLE */}
                <h2
                className={`text-center font-bold py-2 rounded-lg mb-6 ${
                    isIncome ? "bg-green-400" : "bg-red-400"
                }`}
                >
                {isIncome ? "Tambah Pemasukan" : "Tambah Pengeluaran"}
                </h2>

                {/* FORM */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">

                {/* TYPE */}
                <div>
                    <label className="block text-sm font-medium">Tipe</label>
                    <select
                    name="type"
                    value={form.type}
                    onChange={(e) =>
                        setForm({
                        ...form,
                        type: e.target.value,
                        kategori: "" // reset kategori
                        })
                    }
                    className="w-full border px-2 py-1 rounded"
                    >
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                    </select>
                </div>

                {/* TANGGAL */}
                <div>
                    <label className="block text-sm font-medium">Tanggal</label>
                    <input
                    type="date"
                    name="tanggal"
                    value={form.tanggal}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                    required
                    />
                </div>

                {/* KATEGORI */}
                <div>
                    <label className="block text-sm font-medium">Kategori</label>
                    <select
                    name="kategori"
                    value={form.kategori}
                    onChange={handleChange}
                    className="w-full border px-2 py-1 rounded"
                    required
                    >
                    <option value="">Pilih Kategori</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>
                        {cat}
                        </option>
                    ))}
                    </select>
                </div>

                {/* NOMINAL */}
                <div>
                    <label className="block text-sm font-medium">Nominal</label>
                    <input
                    type="number"
                    name="nominal"
                    value={form.nominal}
                    onChange={handleChange}
                    placeholder="Masukkan nominal"
                    className="w-full border px-2 py-1 rounded"
                    required
                    />
                </div>

                {/* CATATAN */}
                <div>
                    <label className="block text-sm font-medium">Catatan</label>
                    <input
                    type="text"
                    name="catatan"
                    value={form.catatan}
                    onChange={handleChange}
                    placeholder="Opsional"
                    className="w-full border px-2 py-1 rounded"
                    />
                </div>

                {/* SUBMIT */}
                <button
                    type="submit"
                    className={`mt-3 py-2 rounded-lg font-semibold  border-2 border-gray-400 transition-all duration-300 cursor-pointer ${
                    isIncome ? "hover:bg-green-200" : "hover:bg-red-200"
                    }`}
                >
                    Simpan
                </button>

                </form>
            </div>
            </div>
        )}
        </>
    );

}