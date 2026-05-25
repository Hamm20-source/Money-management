import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../utils/supabase';
import logoKasku from '../../assets/Prototype Money Management/Transparant_Logo.png';
import logoGoogle from '../../assets/Prototype Money Management/google.png';
import logoGithub from '../../assets/Prototype Money Management/github.png';

const LoginProvider = () => {
  const navigate = useNavigate();

  //Login dengan Google
  const handleLoginGoogle = async () => {
    // Implement your Supabase login logic here
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'google', // You can choose other providers like 'github', 'facebook', etc.
      options: {
        redirectTo: `${window.location.origin}/`, // Redirect back to this page after login
      },
    });

    if (error) {
      console.error('Login error:', error.message);
    }
  };

  //Login dengan github
  const handleLoginGithub = async () => {
    const {error} = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/`
      },
    });

    if (error) {
      console.error('Login error:', error.message);
    }
  };

  // ambil user setelah redirect dari Google
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          //  cek jumlah user (limit 5 akun)
          const { data: users } = await supabase
            .from("users")
            .select("*");

          const existingUser = users.find(
            (u) => u.email === user.email
          );

          if (!existingUser && users.length >= 5) {
            toast.error("User sudah penuh (max 5 akun)");
            await supabase.auth.signOut();
            return;
          }

          //  insert user jika belum ada
          if (!existingUser) {
            await supabase.from("users").insert([
              {
                id: user.id,
                email: user.email,
                username: user.user_metadata.full_name,
                avatar: user.user_metadata.avatar_url,
              },
            ]);
          }

          // simpan ke localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({
              uid: user.id,
              email: user.email,
              username: user.user_metadata.full_name,
              avatar: user.user_metadata.avatar_url,
            })
          );

          navigate("/");
        } catch (err) {
          console.error(err);
        }
      }
    };

    getUser();
  }, [navigate]);



  return (
    <div className='flex flex-col justify-center items-center min-h-screen  space-y-8'>
        <img src={logoKasku} alt='kassku' className='w-50'/>


      <div className='flex flex-col gap-4'>
        <div className='flex items-center w-80 p-1 gap-5 bg-blue-400 text-white rounded-md'>
          <img src={logoGoogle} alt='Google' className='w-10 p-2 bg-white rounded-lg' />
          <button
            onClick={handleLoginGoogle}
            className='flex-1 text-center font-semibold cursor-pointer'
          >
            Login with Google
          </button>
        </div>

        <div className='flex items-center w-80 p-1 gap-5 bg-black text-white rounded-md'>
          <img src={logoGithub} alt='Github' className='w-10 p-2 bg-white rounded-lg' />
          <button
            onClick={handleLoginGithub}
            className='flex-1 text-center font-semibold cursor-pointer'
          >
            Login with Github
          </button>
       </div>
      </div>
    </div>
  );
}

export default LoginProvider;