import React from 'react'

export default function TransactionsFilter({ filter, setFilter }) {
  return (
    <div className='flex flex-wrap  gap-4 space-x-5'>
        <select 
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
            className='border-2 border-gray-300 text-sm font-semibold p-2 rounded-lg shadow-lg outline-none'
        >
            <option value="all">Semua</option>
            <option value="today">Harian</option>
            <option value="month">Bulanan</option>
            <option value="year">Tahunan</option>localhost
        </select>

        {/*Pilih Bulan Jika type month*/}
        {filter.type === "month" &&(
            <>
                <select
                        value={filter.month}
                        onChange={(e) => setFilter({ ...filter, month: parseInt(e.target.value)})}
                        className='border-2 border-gray-300 text-sm font-semibold p-2 rounded-lg shadow-lg outline-none'
                    >
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i} value={i}> 
                                {new Date(0, i).toLocaleString("id-ID", {month: "long"})}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filter.year}
                        onChange={(e) =>
                        setFilter({ ...filter, year: parseInt(e.target.value) })
                        }
                        className="border-2 border-gray-300 text-sm font-semibold p-2 rounded-lg shadow-lg outline-none"
                    >
                        {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() - i;
                        return (
                            <option key={year} value={year}>
                               {year}
                            </option>
                        );
                        })}
                </select>
            </>
        )}

      {/* Pilih Tahun (jika type === year) */}
      {filter.type === "year" && (
        <select
          value={filter.year}
          onChange={(e) =>
            setFilter({ ...filter, year: parseInt(e.target.value) })
          }
          className="border-2 border-gray-300 text-sm font-semibold rounded-lg shadow-lg p-2 outline-none"
        >
          {Array.from({ length: 10 }, (_, i) => {
            const year = new Date().getFullYear() - i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      )}

      <select 
        value={filter.transactionsType}
        onChange={((e) => 
          setFilter({...filter, transactionsType: e.target.value})
        )}
        className='border-2 border-gray-300 text-sm font-bold p-1 rounded-lg shadow-lg outline-none'
      >
        <option value="all">Semua</option>
        <option value="Pemasukan">Pemasukan</option>
        <option value="Pengeluaran">Pengeluaran</option>
      </select>

    </div>
  )
};

