import React, { useState, useEffect } from 'react'
import { auth } from '../../utils/Firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Navbar from '../../layout/Navbar'
import Sidebar from '../../layout/Sidebar'
import GridTransaction from '../../components/transactions/GridTransaction'
import DoughnutChart from '../../features/charts/DoughnutChart'
import LineChart from '../../features/charts/LineChart'
import TransactionTable from '../../components/transactions/TransactionTable'
import AddIncome from '../../components/transactions/AddIncome'
import AddExpense from '../../components/transactions/AddExpense'

export default function Dashboard() {
  const [uid, setUid] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) setUid(user.uid);
      else setUid(null);

      setTimeout(() => setLoading(false), 700);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="animate-pulse text-lg font-semibold">Loading...</p>
      </div>
    );
  }

  if (!uid) return <p className='flex justify-center items-center h-screen'>Loading...</p>;


  return (
    <div className='m-2 px-4 py-2 space-y-10'>
          <Navbar/>
          <Sidebar/>
          <GridTransaction uid={uid}/>
        <div className='flex flex-col md:flex-row gap-5'>
          <DoughnutChart uid={uid}/>
          <LineChart uid={uid}/>
        </div>
          <TransactionTable/>
    </div>
  )
}

