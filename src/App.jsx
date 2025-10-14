import { useEffect, useState } from "react";
import { Navigate} from "react-router-dom";
import {  Route, Routes, useLocation } from "react-router-dom";

//Auth Pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

//Nav and sidebar
import Navbar from "./layout/Navbar";
import Sidebar from "./layout/Sidebar";

//Dashboard Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import AllTransactionsTable from "./components/transactions/AllTransactionsTable";

//Guest Pages
import GuestPage from "./pages/guest/GuestPage";

//Private Routes
import ProtectedRoute from "./utils/ProtectedRoute";

//Toaster dari Editing Form
import { Toaster } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./utils/Firebase";
import Profile from "./pages/profile/Profile";
import PublicRoute from "./utils/PublicRoute";

function App() {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const hideLayout = ["/register", "/login", "/guest", ].includes(location.pathname);
  
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else setUid(null)
      setTimeout(() => setLoading(false), 700);
    })
    return () => unsub();
  }, []); 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="animate-pulse text-lg font-semibold">Loading...</p>
      </div>
    )
  }

  return (
    <>
      <Toaster/>
          {!hideLayout && uid && (
            <> 
              <Navbar/>
              <Sidebar/>
            </>
          )}

          <Routes>
            <Route element={<ProtectedRoute/>}>
              <Route path="/" element={<Dashboard uid={uid}/>}/>
              <Route path="/alltransactions" element={<AllTransactionsTable/>}/>
              <Route path="/profile" element={<Profile/>}/>
            </Route>
            
            <Route element={<PublicRoute/>}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/guest" element={<GuestPage />} />
            </Route>
          </Routes>
    </>
  )
}

export default App;
