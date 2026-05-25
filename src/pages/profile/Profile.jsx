import React, { useEffect, useState } from 'react';
import AvatarChange from '../../features/avatarchange/AvatarChange';
import { CgClose } from 'react-icons/cg';
import { BsPencilFill } from 'react-icons/bs';
import { BiUser } from 'react-icons/bi';
import { supabase } from '../../utils/supabase';



export default function Profile() {
  const [user, setUser] = useState(null);
  const [googleAvatar, setGoogleAvatar] = useState(null);
  const [customAvatar, setCustomAvatar] = useState(null);
  const [choosingAvatar, setChoosingAvatar] = useState(false);
  const [loading, setLoading] = useState(true);

  const selectedAvatar = customAvatar || googleAvatar;
  const createdAt = user ? new Date(user.created_at) : null;

  useEffect(() => {
    const getProfile = async () => {
      setLoading(true);

      const {data: sessionData} = await supabase.auth.getSession();
      const currentUser = sessionData?.session?.user || null;

      if (!currentUser) {
        setLoading(false);
        return;
      };

      setUser(currentUser);
    
      const avatar = 
              currentUser.user_metadata.avatar_url ||
              currentUser.identities?.[0]?.identity_data?.avatar_url ||
              null;

      setGoogleAvatar(avatar);

      setLoading(false);

      const { data: profile } = await supabase
        .from("users")
        .select("avatar")
        .eq("id", currentUser.id)
        .single();

        if (profile?.avatar) {
          setCustomAvatar(profile.avatar);
          localStorage.setItem("avatar", profile.avatar);
        } else {
          localStorage.setItem("avatar", currentUser.user_metadata.avatar_url);
        }
    };

    getProfile();
  }, []);

  const handleSelectAvatar = async (avatar) => {
    if (!user) return;

    const {data, error } = await supabase
      .from("users")
      .upsert({
        id: user.id,
        email: user.email,
        avatar: avatar,
      })
      .select()

      console.log("Data:", data);
      console.log("Error:", error);

      if (error) {
        console.error("Error updating avatar:", error);
        return;
      }
      
    setCustomAvatar(avatar);
    localStorage.setItem("avatar", avatar);
    setChoosingAvatar(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="animate-pulse text-lg font-semibold">Loading Profile...</p>
      </div>
    )
  };

  return (
    <div className='relative flex flex-col gap-6 justify-center items-center min-h-screen'>

        <div className='relative bg-gray-200 p-2 rounded-full shadow-lg'>
          {selectedAvatar ? (
            <img
              src={selectedAvatar}
              alt="avatar"
              referrerPolicy='no-referrer'
              className='w-32 h-32 rounded-full object-cover'
            />
          ) : (
            <div className='w-32 h-32 rounded-full bg-gray-400 flex justify-center items-center text-white text-4xl'>
              <BiUser />
            </div>
          )}
          <button 
            onClick={() => setChoosingAvatar(true)}
            className='absolute bottom-1 right-3 bg-green-400 hover:bg-white p-2 rounded-full transition-all duration-200 cursor-pointer'
          >
            <BsPencilFill className='text-gray-600'/>
          </button>

        </div>

      <div className='flex flex-col gap-6 border border-gray-200 p-3 md:p-20 rounded-lg shadow-md bg-white/80 backdrop-blur-md'>
        <div>
          <label className='font-medium text-lg'>Username</label>
          <div className='p-2 border-2 border-gray-200 bg-white w-96 rounded-lg shadow-sm mt-2'>
            {user?.user_metadata?.full_name || "Tidak tersedia"}
          </div>
        </div>


        <div>
            <label className='font-medium text-lg'>Email</label>
            <div className='p-2 border-2 border-gray-200 bg-white w-96 rounded-lg shadow-sm mt-2'>
              {user?.email || "Tidak tersedia"}
            </div>
        </div>

       <div>
          <label className='font-medium text-lg'>Password</label>
          <div className='p-2 border-2 border-gray-200 bg-white w-96 rounded-lg shadow-sm mt-2'>
            ********
          </div>
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
        <div className='fixed inset-0 z-50 flex justify-center items-center shadow-xl bg-black/80 backdrop-blur-sm p-6'>
          <div className='relative bg-white p-20 max-w-5xl rounded-lg shadow-md shadow-white'>
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
