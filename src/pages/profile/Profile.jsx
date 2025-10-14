import React, { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { auth, db } from '../../utils/Firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import AvatarChange from '../../features/avatarchange/AvatarChange';
import Background from "../../assets/Prototype Money Management/Bg_Profile.png";
import { CgClose } from 'react-icons/cg';
import { BsPencilFill } from 'react-icons/bs';
import { BiUser } from 'react-icons/bi';
import { TiArrowBack } from 'react-icons/ti';



export default function Profile() {
  const [createdAt, setCreatedAt] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(
    localStorage.getItem("avatar") || null
  );
  const [choosingAvatar, setChoosingAvatar] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [formValue, setFormValue] = useState("");
  const userData = JSON.parse(localStorage.getItem("user"));


  const handleSelectAvatar = async (avatar) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      const useRef = doc(db, "users", user.uid);
      await updateDoc(useRef, {avatar})

      setSelectedAvatar(avatar);
      localStorage.setItem("avatar", avatar);
      setChoosingAvatar(false);
    } catch (err) {
      console.error("Erorr", err) 
    }
  };

  const startEditing = (field) => {
    setEditingField(field);
    setFormValue(field === "username" ? userData.username : "")
  };

 const handleSave = async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    if (editingField === "username") {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { username: formValue });

      const updatedUser = { ...userData, username: formValue };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Username berhasil diupdate!");
    }

    if (editingField === "password") {
      // ✅ Minta password lama user
      if (!oldPassword) {
        alert("Password lama wajib diisi.");
        return;
      }

      if (formValue.length < 6) {
        alert("Password baru minimal 6 karakter");
        return;
      };

      // ✅ Buat credential dan reauthenticate
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);

      // ✅ Setelah sukses reauth, baru update password
      await updatePassword(user, formValue);
      alert("Password berhasil diubah!");
    }

    setEditingField(null);
    setFormValue("");
    setOldPassword("");
  } catch (err) {
    console.error("Gagal update:", err);
    if (err.code === "auth/wrong-password") {
      alert("Password lama salah, coba lagi.");
    } else if (err.code === "auth/weak-password") {
      alert("Password baru terlalu lemah. Gunakan minimal 6 karakter.");
    } else {
      alert("Terjadi kesalahan saat update data.");
    }
  }
};

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (!user) return;

      if  (userData?.createdAt) {
        const { seconds } = userData.createdAt;
        const date = new Date( seconds * 1000);
        setCreatedAt(date)
      }

      const useRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(useRef);
      if (userSnap.exists()) {
        const data = userSnap.data()
        if (data.avatar) {
          setSelectedAvatar(data.avatar);
          localStorage.setItem("avatar", data.avatar)
        }
      } 
    };
    fetchUser();
  }, []);


  return (
    <div className='relative flex flex-col gap-6 justify-center items-center min-h-screen'>
        <div className='absolute inset-0 -z-10' >
          <img src={Background} alt='background' className='w-full h-full object-cover'/>
        </div>


        <div className='relative bg-gray-200 p-2 rounded-full shadow-lg'>
          {selectedAvatar ? (
            <img src={selectedAvatar} alt="userimage" className='w-40 h-40 rounded-full' />
          ):(
            <BiUser className='text-4xl text-gray-600'/>
          )}
          <button 
            onClick={() => setChoosingAvatar(true)}
            className='absolute bottom-1 right-3 bg-green-400 hover:bg-white p-2 rounded-full transition-all duration-200 cursor-pointer'
          >
            <BsPencilFill className='text-gray-600'/>
          </button>

        </div>

      <div className='flex flex-col gap-6 border border-gray-200 p-2 md:p-20 rounded-lg shadow-md bg-white/80 backdrop-blur-md'>
        <div>
          <label className='font-medium text-lg'>Username</label>
          {editingField === "username" ? (
            <div className="flex flex-col gap-2 mt-2">
              <input
                type="text"
                value={formValue}
                onChange={(e) => setFormValue(e.target.value)}
                className="p-2 border-2 border-gray-200 rounded-lg flex-1"
              />
              <button onClick={handleSave} className="bg-green-500 text-white p-1 rounded-lg">Save</button>
              <button onClick={() => setEditingField(null)} className="bg-gray-400 text-white p-1 rounded-lg">Cancel</button>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-2 p-2 border-2 border-gray-200 rounded-lg bg-white">
              <span>{userData.username}</span>
              <button onClick={() => startEditing("username")} className="text-blue-500 text-sm underline">Edit</button>
            </div>
          )}
        </div>


        <div>
            <label className='font-medium text-lg'>Email</label>
            <div className='p-2 border-2 border-gray-200 bg-white w-96 rounded-lg shadow-sm mt-2'>
              {userData.email}
            </div>
        </div>

       <div>
          <label className='font-medium text-lg'>Password</label>
          {editingField === "password" ? (
            <div className="flex flex-col gap-2 mt-2">
              <div className='flex flex-col gap-2'>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="p-2 border-2 border-gray-200 rounded-lg flex-1"
                  placeholder="Masukkan password lama"
                />
                <input
                  type="password"
                  value={formValue}
                  onChange={(e) => setFormValue(e.target.value)}
                  className="p-2 border-2 border-gray-200 rounded-lg flex-1"
                  placeholder="Masukkan password Baru"
                />
              </div>
              <button onClick={handleSave} className="bg-green-500 text-white p-1 rounded-lg">Save</button>
              <button onClick={() => setEditingField(null)} className="bg-gray-400 text-white p-1 rounded-lg">Cancel</button>
            </div>
          ) : (
            <div className="flex justify-between items-center mt-2 p-2 border-2 border-gray-200 rounded-lg bg-white">
              <span>••••••••</span>
              <button onClick={() => startEditing("password")} className="text-blue-500 text-sm underline">Edit</button>
            </div>
          )}
        </div>

        <div>
            <label className='font-medium text-lg'>Created At</label>
            <div className='p-2 border-2 border-gray-200 bg-white w-96 rounded-lg shadow-sm mt-2'>
              {createdAt
                ? createdAt.toLocaleString("en-EN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Tidak tersedia"}
            </div>
        </div>
      </div>

      {choosingAvatar && (
        <div className='fixed inset-0 z-50 flex justify-center items-center shadow-xl bg-black/80 backdrop-blur-sm'>
          <div className='relative bg-white p-20 max-w-5xl p-10 rounded-lg shadow-md shadow-white'>
              <button 
                onClick={() => setChoosingAvatar(false)}
                className='absolute top-5 right-5 p-2 bg-red-300 rounded-full cursor-pointer'
              >
                <CgClose className='text-2xl text-black'/>
              </button>

             <h2 className='font-bold text-xl text-center mb-10'>Pilih Avatarmu</h2>
             <AvatarChange onSelect={handleSelectAvatar}/>
          </div>
        </div>
      )}

    </div>
  )
};
