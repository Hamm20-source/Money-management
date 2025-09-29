import { BrowserRouter, Route, Routes } from "react-router-dom";

//Auth Pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";

//Dashboard Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import AllTransactionsTable from "./components/transactions/AllTransactionsTable";

//Guest Pages
import GuestPage from "./pages/guest/GuestPage";

//Private Routes
import ProtectedRoute from "./utils/ProtectedRoute";

//Toaster dari Editing Form
import { Toaster } from "react-hot-toast";

function App() {

  return (
    <>
      <Toaster/>
      <BrowserRouter>
          <Routes>
            <Route element={<ProtectedRoute/>}>
              <Route path="/" element={<Dashboard/>}/>
              <Route path="/alltransactions" element={<AllTransactionsTable/>}/>
          
            </Route>
              <Route path="/register" element={<Register/>}/>
              <Route path="/login" element={<Login/>}/> 
              <Route path="/guest" element={<GuestPage/>}/>
          </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
