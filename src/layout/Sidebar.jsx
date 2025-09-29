import React, { useState } from 'react';
import { CgClose } from 'react-icons/cg';
import { GiHamburgerMenu } from 'react-icons/gi';
import Logo from '../assets/Prototype Money Management/Logo-2.png';
import { useNavigate } from 'react-router-dom';
import { BiExit } from 'react-icons/bi';

export default function Sidebar() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);

    const userData = JSON.parse(localStorage.getItem("user"));

     const buttonLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate('/guest');
    };



  return (
    <aside className='md:hidden block relative'>
        <div className='absolute right-0 top-0'>
            <button onClick={() => setOpen(true)}>
               <GiHamburgerMenu className='text-xl'/>
            </button>

            <div 
                className={`fixed top-0 right-0 h-full w-64 p-5 bg-white shadow-lg transform transition-transform duration-300 z-50
                ${open ? "translate-x-0" : "translate-x-full"} md:hidden`}>
                    <div className='flex justify-between items-center'>
                        <button onClick={() => setOpen(false)} className='cursor-pointer'>
                            <CgClose className='text-xl '/>
                        </button>
                        <img src={Logo} alt="logo" className='w-15' />
                    </div>
                    <div className='mt-10 flex flex-col space-y-5'>
                        <span>Halo {userData.username} 👐</span>
                        <a href="/" className='hover:underline'>Dashboard</a>
                        <a href="/alltransactions" className='hover:underline'>Semua Transaksi</a>
                        <button 
                            className='flex gap-2 p-1 items-center bg-gray-300 font-semibold w-fit rounded shadow cursor-pointer hover:underline'
                            onClick={buttonLogout}
                        >
                            Logout <BiExit/>
                        </button>
                    </div>
            </div>
        </div>
    </aside>
  )
}

