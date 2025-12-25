import GridTransaction from '../../components/transactions/GridTransaction'
import DoughnutChart from '../../features/charts/DoughnutChart'
import LineChart from '../../features/charts/LineChart'
import TransactionTable from '../../components/transactions/TransactionTable'
import { useState } from 'react'

export default function Dashboard({uid}) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  }

  return (
    <div className='m-2 px-4 py-2 space-y-10'>
          <GridTransaction uid={uid} refreshKey={refreshKey}/>
        <div className='flex flex-col md:flex-row gap-5'>
          <DoughnutChart uid={uid} refreshKey={refreshKey}/>
          <LineChart uid={uid} refreshKey={refreshKey}/>
        </div>
          <TransactionTable refreshKey={refreshKey} onRefresh={handleRefresh}/>
    </div>
  )
}

 