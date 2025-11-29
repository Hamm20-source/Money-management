import React, { useState } from 'react';
import logoKasku from '../../assets/Prototype Money Management/Logo-2.png';
import { auth, db } from '../../utils/Firebase';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { BsEyeSlash } from 'react-icons/bs';
import { doc, getDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';


const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visibility, setVisibilty] = useState({ password: false });

  const toggleVisibility = (field) => {
    setVisibilty((prev) => ({...prev, [field]: !prev[field] }))
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();

        localStorage.setItem("accessToken", token)
        localStorage.setItem("user", JSON.stringify({
          uid: user.uid,
          email: user.email,
          ...userData
        }))
        navigate("/")
      } else {
        console.log("User data not found in Firestore")
      }

    } catch (err) {
      console.log("Email atau Password salah", err)
      toast.error("Email atau Password salah", {
          position: "top-center",
          duration: 2000,
          iconTheme: {
            primary: '#d80d0dff'
          }
        })
    }
  };

  return (
    <div className='flex flex-col justify-center items-center min-h-screen  space-y-8'>
        <img src={logoKasku} alt='kassku' className='w-50'/>
        <form onSubmit={handleLogin} className='flex flex-col'>
            <label 
              htmlFor="email" 
              className='font-semibold text-xl mb-2'
            >
              Email
            </label>
            <input 
              type="email" 
              placeholder='Masukkan email'
              value={email}
              onChange={(e) =>setEmail(e.target.value)}
              className='w-80 p-2 border-2 border-gray-300 shadow-md outline-none mb-4 rounded-lg' 
            />

            <label 
              htmlFor="password" 
              className='font-semibold text-xl mb-2'
            >
              Password
            </label>
            <div className='relative'>
              <input 
                placeholder='Masukkan password'
                value={password}
                onChange={(e) =>setPassword(e.target.value)}
                type={visibility.password ? 'text' : 'password'} 
                className='w-80 p-2 border-2 border-gray-300 shadow-md outline-none mb-4 rounded-lg' 
              />
              <button type='button' className='absolute right-2 top-4' onClick={() => toggleVisibility('password')}>
                {visibility.password ? <FaEye/> : <FaEyeSlash/>}
              </button>
            </div>

            <span className='font-semibold text-xs text-center mb-5'>
                Already have an account? {""}
                <Link to='/register' className='text-[#2C9BDC] hover:underline cursor-pointer'>Register Now</Link>
            </span>
            <button type='submit' className='font-bold text-xl text-white bg-[#26AFEF] w-fit container mx-auto px-6 py-2 rounded-md'>Login</button>
        </form>
    </div>
  )
}

export default Login;
