import React, { useState } from 'react'
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx/xlsx.mjs';

export default function ExportExcel({ transactions, filter }) {
    const [menuOpen, setMenuOpen] = useState(false);

    const exportData = (data, filename) => {
        if (data.length === 0) {
            toast.error("Tidak ada data untuk diexport", {
                position: "top-center",
                duration: 2000,
                iconTheme: {
                    primary: '#d80d0dff'
                },
                style: {
                    fontSize: "10px",
                    textAlign: "center"
                }
            });
            return;
        }

        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Transaksi");
        XLSX.writeFile(workbook, filename);
    };

    // Export Berdasarkan perbulan
    const exportMonthly = () => {
        const monthName = new Date(filter.year, filter.month).toLocaleString("id-ID", {
            month: "long",
        });

        const filtered = transactions.filter((t) => {
            const d = new Date(t.tanggal);
            return d.getMonth() === filter.month && d.getFullYear() === filter.year;
        });

        const mapped = filtered.map((t, index) => ({
            No: index + 1,
            Tanggal: t.tanggal,
            Tipe: t.type,
            Kategori: t.kategori,
            Nominal: t.nominal,
            Catatan: t.catatan || "-",
        }));

        exportData(mapped, `Transaksi-${monthName}-${filter.year}.xlsx`);
    };

    //Export berdasarkan tahunan
    const exportYearly = () => {
        const filtered = transactions.filter((t) => {
            const d = new Date(t.tanggal);
            return d.getFullYear() === filter.year
        });

        const mapped = filtered.map((t, index) => ({
            No: index + 1,
            Tanggal: t.tanggal,
            Tipe: t.type,
            Kategori: t.kategori,
            Nominal: t.nominal,
            Catatan: t.catatan || "-",
        }));

        exportData(mapped, `Transaksi-${filter.year}.xlsx`);
    };
    
  return (
    <div className='relative inline-block'>
        <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className='border-2 border-gray-300 p-1 text-sm rounded-lg shadow-md font-semibold hover:bg-green-300 cursor-pointer'
        >
            Export Excel
        </button>

        {menuOpen && (
            <div className="absolute mt-2 bg-white shadow-lg rounded-md w-40 p-1 z-10">
                <button
                    onClick={() => {exportMonthly(), setMenuOpen(false)}}
                    className='block w-fit text-left px-4 py-2 text-xs hover:bg-gray-200 font-medium cursor-pointer'
                >
                    Export Per Bulan
                </button>
                <button
                    onClick={() => {exportYearly(), setMenuOpen(false)}}
                    className='block w-fit   text-left px-4 py-2 text-xs hover:bg-gray-200 font-medium cursor-pointer'
                >
                    Export Per Tahun
                </button>
            </div>
        )}
    </div>
  )
}
