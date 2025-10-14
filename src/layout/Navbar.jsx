import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BiDotsHorizontal, BiExit, BiUser } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowUp } from 'react-icons/md';
import Logo from '../assets/Prototype Money Management/Logo-2.png';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation()
  const [time, setTime] = useState(new Date());
  const [toogleLogout, setToogleLogout] = useState(false);

  // ⏰ Update jam real-time
  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);

  // 📅 Format jam & tanggal
  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}.${minutes}`;
  const formattedDate = `${time.getDate().toString().padStart(2, '0')}/${(time.getMonth() + 1)
    .toString()
    .padStart(2, '0')}/${time.getFullYear()}`;

  // 👤 Ambil user dari localStorage
  const userData = JSON.parse(localStorage.getItem("user") || "null");

  // 🚨 Kalau user hilang, redirect ke /guest (tapi cuma sekali)
  useEffect(() => {
    if (!userData) {
      navigate("/guest");
    }
  }, [userData, navigate]);

  // 🚪 Logout button
  const buttonLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("avatar");
    navigate('/guest');
  };

  if (!userData) return null;

  

  return (
    <nav className='hidden md:flex justify-between items-center p-2'>
      <a href="/">
        <img src={Logo} alt='Logo' className='w-20' />
      </a>
      <div className='flex items-center gap-5'>
        <p className='text-md'>{formattedTime}</p>
        <p>{formattedDate}</p>
        <div
          className='relative flex items-center gap-2 bg-gray-200 p-2 rounded-xl cursor-pointer'
          onClick={() => setToogleLogout(prev => !prev)}
        >
          <BiUser className='text-xl' />
          <p className='text-md font-semibold'>{userData?.username}</p>
          <MdKeyboardArrowUp className={`text-2xl transition-transform ${toogleLogout ? 'rotate-180' : ''}`} />

          {toogleLogout && (
            <div className='absolute flex flex-col gap-5 top-12 right-0 w-fit bg-white shadow-lg hover:shadow-xl px-4 py-2 rounded-lg z-50'>

              {location.pathname !== '/profile' && (
                <Link to='/profile' className='flex items-center space-x-2'>
                  <span className='text-xs font-semibold'>Profile</span>
                  <BiDotsHorizontal className='w-4' />
                </Link>
              )}

              <div className='flex items-center space-x-4' onClick={buttonLogout}>
                <span className='text-xs font-semibold'>Logout</span>
                <BiExit className='w-4' />
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
