import GridTransaction from '../../components/transactions/GridTransaction'
import DoughnutChart from '../../features/charts/DoughnutChart'
import LineChart from '../../features/charts/LineChart'
import TransactionTable from '../../components/transactions/TransactionTable'

export default function Dashboard({uid}) {

  return (
    <div className='m-2 px-4 py-2 space-y-10'>
          <GridTransaction uid={uid}/>
        <div className='flex flex-col md:flex-row gap-5'>
          <DoughnutChart uid={uid}/>
          <LineChart uid={uid}/>
        </div>
          <TransactionTable/>
    </div>
  )
}

 