import React from 'react';

export default function Pagination({ currentPage, totalPages, onNext, onPrev }) {
  return (
    <div className='flex justify-center items-center mt-10 gap-5'>
        <button
            onClick={onPrev}
            disabled={currentPage === 1}
            className={`p-2 rounded text-xs md:text-sm text-white ${
                currentPage === 1 ?
                "bg-gray-400 cursor-not-allowed" 
                :
                "bg-blue-400 cursor-pointer"
            }`}
        >
            Prev
        </button>

        <span className='text-xs md:text-sm'>
            Halaman {currentPage} dari {totalPages}
        </span>

          <button
            onClick={onNext}
            disabled={currentPage === totalPages | totalPages === 0}
            className={`p-2 rounded text-xs md:text-md text-white ${
               currentPage === totalPages | totalPages === 0 ?
                "bg-gray-400 cursor-not-allowed" 
                :
                "bg-blue-400 cursor-pointer"
            }`}
        >
            Next
        </button>
    </div>
  )
}
