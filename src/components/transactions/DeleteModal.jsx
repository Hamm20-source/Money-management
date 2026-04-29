import toast from 'react-hot-toast';
import useTransactionStore from '../../Store/UseTransactionStore';

export default function DeleteModal({ transactionsDelete, onClose }) {
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
    const handleDelete = async () => {
       try {
        const result = await deleteTransaction(
          transactionsDelete.id
        );

        if (!result) {
          toast.error("Delete Failed", {
            position: "top-center",
            duration: 2000,
            iconTheme: {
              primary: '#d80d0dff'
            }
          })
          return
        };
        
         toast.success("Delete Succes", {
           position: "top-center",
           duration: 2000,
           iconTheme: {
             primary: '#d80d0dff'
           }
         })
 
         onClose()
       } catch (error) {
          console.error("Error deleting transaction:", error);
          toast.error("there is an error", {
            position: "top-center",
            duration: 2000,
            iconTheme: {
              primary: '#d80d0dff'
            }
          })
       }
    };

  return (
      <div className='shadow-lg p-5 mt-10 h-auto  flex flex-col justify-center items-center gap-5'>
        <h1 className='font-medium'>Yakin mau hapus transaksi
          {" "} 
          <span className='font-bold'>{transactionsDelete.tanggal} / {transactionsDelete.type}</span> ?
        </h1>
        <div className='flex justify-center items-center gap-5'>
          <button className='bg-red-500 px-4 py-2 text-white font-medium cursor-pointer' onClick={handleDelete}>Ya</button>
          <button className='cursor-pointer' onClick={onClose}>Batal</button>
        </div>
      </div>
    
  )
};

