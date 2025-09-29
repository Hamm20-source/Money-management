import React from 'react'
import { useNavigate } from 'react-router-dom';

export default function GuestPage() {
  const navigate = useNavigate();

  const loginButton = () => {
    navigate("/login");
  };

  return (
    <div className='flex container mx-auto justify-center items-center h-screen '>
      <div className='flex flex-col justify-center items-center space-y-20  bg-[#FBFBFB] shadow-lg p-20 border border-gray-200 rounded-lg m-10 md:m-0'>
        <h1 className='text-xl font-medium'>Anda belum bisa masuk sesi ini, silahkan</h1>
        <div>
          <button 
            onClick={loginButton} 
            className='bg-[#59C883] px-15 py-3 text-white font-bold rounded-full text-lg cursor-pointer'
          > 
            Login 
          </button>
        </div>
      </div>
    </div>
  )
};