import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../assets/Prototype Money Management/Logo-2.png';
import { BiExit } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { CgClose } from 'react-icons/cg';

export default function Sidebar({ user }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

    // jika tidak ada userData, jangan redirect di sini — cuma return null
    if (!user) return null;

     const buttonLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("avatar");
        navigate('/guest');
    };


  return (
    <>
    <div className="flex relative">

      <aside className="hidden lg:block w-64 min-h-screen bg-white shadow-md flex flex-col p-5 border-r border-gray-200">

        {/* Logo */}
        <Link to="/">
          <img src={Logo} alt="logo" className="w-24 mb-10" />
        </Link>

        {/* Menu */}
        <div className="flex flex-col gap-5 text-sm font-medium">
          <span>Halo, {user?.user_metadata?.full_name}</span>

          <Link to="/" className="hover:text-blue-500">
            Dashboard
          </Link>

          <Link to="/alltransactions" className="hover:text-blue-500">
            Semua Transaksi
          </Link>

          <Link to="/profile" className="hover:text-blue-500">
            Profile
          </Link>

          <button
            onClick={buttonLogout}
            className="flex items-center gap-2 text-red-500 hover:underline"
          >
            Logout <BiExit />
          </button>

        </div>

      </aside>

      <div className="lg:hidden h-full">
        <div className="flex items-center p-5">
              <button onClick={() => setOpen(true)}>
                  <GiHamburgerMenu className='text-xl'/>
              </button>

              <div 
                  className={`fixed top-0 left-0 h-full w-64 p-5 bg-white shadow-lg transform transition-transform duration-300 z-50
                  ${open ? "translate-x-0" : "-translate-x-full"} lg:hidden`}>
                      <div className='flex justify-between items-center'>
                          <Link to="/">
                              <img src={Logo} alt="logo" className='w-15' />
                          </Link>
                          <button onClick={() => setOpen(false)} className='cursor-pointer'>
                              <CgClose className='text-xl '/>
                          </button>
                      </div>
                      <div className='mt-10 flex flex-col space-y-5'>
                          <span>Halo, {user?.user_metadata?.full_name}</span>
                          <Link to="/profile" className='hover:text-blue-500'>
                            Profile
                          </Link>
                          <Link to="/" className='hover:text-blue-500'>
                            Dashboard
                          </Link>
                          <Link to="/alltransactions" className='hover:text-blue-500'>
                            Semua Transaksi
                          </Link>
                          <button 
                              className='flex items-center gap-2 text-red-500 hover:underline'
                              onClick={buttonLogout}
                          >
                              Logout <BiExit/>
                          </button>
                      </div>
              </div>
        </div>
    </div>
  </div>
    </>
  );
}