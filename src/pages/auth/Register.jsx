import React, { useState } from 'react';
import logoKasku from '../../assets/Prototype Money Management/Logo-2.png';
import { auth, db } from '../../utils/Firebase';
import { collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [visibility, setVisibilty] = useState({
    password: false,
    confirm: false
  });

  const toggleVisibility = (field) => {
    setVisibilty((prev) => ({...prev, [field]: !prev[field] }));
  }

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");


  if (password !== confirmPassword) {
    setError("Password dan Confirm Password tidak sama!");
    return;
  }

    try {
      const userRef = collection(db, "users");
      const snapshot = await getDocs(userRef);

      if (snapshot.size >= 2) {
        setError("Regristasi ditutup, hanya 2 user yang diperbolehkan");
        return;
      };

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email, 
        username,
        createdAt: new Date(),
      });

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center min-h-screen  space-y-8'>
        <img src={logoKasku} alt='kassku' className='w-50'/>
        
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}


        <form  onSubmit={handleRegister} className='flex flex-col'>
            <label 
              htmlFor="username" 
              className='font-semibold text-xl mb-2'
            >
              Username
            </label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-80 py-2 border-2 border-gray-300 shadow-md outline-none mb-4' 
            />

            <label 
              htmlFor="email" 
              className='font-semibold text-xl mb-2'
            >
              Email
            </label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-80 py-2 border-2 border-gray-300 shadow-md outline-none mb-4' 
            />

            <label 
              htmlFor="password" 
              className='font-semibold text-xl mb-2'
            >
              Password
            </label>
            <div className='relative'>
              <input 
                type={visibility.password ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className='w-80 py-2 border-2 border-gray-300 shadow-md outline-none mb-4' 
              />
              <button type="button" className='absolute right-2 top-3' onClick={() => toggleVisibility("password")}>
                {visibility.password ? <FaEye/> : <FaEyeSlash/>}
              </button>
            </div>

            <label 
              htmlFor="password" 
              className='font-semibold text-xl mb-2'
            >
              Confirm Password
            </label>
            <div className='relative'>
              <input 
                type={visibility.confirm ? "text" : "password"} 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className='w-80 py-2 border-2 border-gray-300 shadow-md outline-none mb-2' 
              />
                <button type="button" className='absolute right-2 top-3' onClick={() => toggleVisibility("confirm")}>
                {visibility.confirm ? <FaEye/> : <FaEyeSlash/>}
              </button>
            </div>

            <span className='font-semibold text-xs text-center mb-5'>
              Already have an account? {""}
              <a href='/login' className='text-[#2C9BDC] hover:underline cursor-pointer'>Login Now</a>
            </span>
            <button type='submit' className='font-bold text-xl text-white bg-[#26AFEF] w-fit container mx-auto px-6 py-3 rounded-xl'>Register</button>
        </form>
    </div>
  )
}

export default Register;