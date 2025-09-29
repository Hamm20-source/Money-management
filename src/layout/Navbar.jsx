import React, { useEffect, useState } from 'react';
import Logo from '../assets/Prototype Money Management/Logo-2.png';
import { useNavigate } from 'react-router-dom';


export default function Navbar() {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());
  const [toogleLogout, setToogleLogout] = useState(false);

  useEffect(() => {
 

    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);
    
    return () => clearInterval(timerId);

  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');
  const formattedTime = `${hours}.${minutes}`;

  const day = time.getDate().toString().padStart(2, '0');
  const month = (time.getMonth() + 1).toString().padStart(2, '0');
  const year = time.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;

  const userData = JSON.parse(localStorage.getItem("user"))

  const buttonLogout = () => {
    
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        navigate('/guest');
  }

  return (
    <nav className='hidden md:flex justify-between items-center'>
      <img src={Logo} alt='Logo' className='w-20' />
      <div className='flex items-center gap-5'>
        <p className='text-md'>{formattedTime}</p>
        <p>{formattedDate}</p>
        <div className='relative flex items-center gap-2  bg-gray-200 p-2 rounded-xl z-0 '
             onClick={() => setToogleLogout((prev) => !prev)}
        >
          <img src='https://img.icons8.com/pastel-glyph/user-male-circle.png' className='w-8'/>
          <p className='text-md font-semibold'>{userData.username}</p>
          <img src='https://img.icons8.com/ios/expand-arrow.png' className={`w-4 ${toogleLogout ? 'rotate-180' : ''}`}/>

        {toogleLogout && (
          <div className='absolute flex items-center gap-2 bottom-[-40px] right-0 w-fit shadow-lg hover:shadow-xl px-4 py-2 rounded-lg cursor-pointer'>
            <button className='text-xs font-semibold' onClick={buttonLogout}>Logout</button>
            <img src="https://img.icons8.com/badges/exit.png" alt="exit" className='w-4'/>
          </div>
        )}
        </div>
        
      </div>
    </nav>
  );
}
