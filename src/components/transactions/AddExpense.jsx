import { useState } from 'react';
import { push, ref } from 'firebase/database';
import { auth,database } from '../../utils/Firebase';
import { BiAddToQueue} from 'react-icons/bi';
import { CgClose } from 'react-icons/cg';

export default function AddExpense ()  {
    const [openModal, setOpenModal] = useState(false);
    const [form, setForm] = useState({
        tanggal: "",
        kategori: "",
        nominal: "",
        catatan: ""
    });

    const modalForm = [
        { id: 1, text: "Tanggal", name: "tanggal", type: "date" },
        { id: 2, text: "Kategori", name: "kategori", type: "text" },
        { id: 3, text: "Nominal", name: "nominal", type: "number" },
        { id: 4, text: "Catatan", name: "catatan", type: "text" },
    ];

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = auth.currentUser;
            if (!user) {
                alert("Harap login terlebih dahulu");
                return;
            }

            const transactionRef = ref(database, `transactions/${user.uid}/expense`);
            await push(transactionRef, {
                ...form,
                nominal: Number(form.nominal),
                type: "expense",
                createdAt: Date.now()
            });

            alert("Expense berhasil ditambahkan");
            setForm({ tanggal: "", kategori: "", nominal: "", catatan: "" });
            setOpenModal(false);
        } catch (error) {
            console.error(error)
        }
    };
   

    return (
        <div>
            <button 
                onClick={() =>setOpenModal(true)}
                className='flex items-center gap-1 bg-red-400 p-2 text-white rounded-xl'
            >
                <BiAddToQueue className='text-md'/>
                <span className='font-semibold text-xs md:text-md whitespace-nowrap'>Tambah Pengeluaran</span>
            </button>

            {openModal ? (
                 <div className='fixed z-50 inset-0  p-8 flex justify-center items-center bg-black/40 backdrop-blur-sm'>
                    <div className='relative bg-white px-10 py-8 border rounded-lg w-[400px] '>

                        <button className='absolute right-2 top-2'>
                            <CgClose className='w-6 cursor-pointer' onClick={() => setOpenModal(false)}/>
                        </button>

                        <h1 className='px-5 py-3 bg-[#F6ABAB] rounded-lg font-bold text-xs md:text-lg text-center'>
                            Tambah Pengeluaran
                        </h1>
                        
                        <form className='mt-6' onSubmit={handleSubmit}>
                            <div className='flex flex-col space-y-5'>
                                {modalForm.map((field) => (
                                    <div key={field.id} className='flex grid grid-cols-3 items-center gap-2'>

                                        <label className='col-span-1 flex justify-between' >
                                            <span>{field.name}</span>
                                            <span>:</span>
                                        </label> 
                                        
                                    
                                     <input
                                        name={field.name}
                                        type={field.type}
                                        value={form[field.name]}
                                        onChange={handleChange}
                                        placeholder={`Masukkan ${field.text}`}
                                        className="shadow-md col-span-2 px-2 py-1 rounded border"
                                        required
                                        />

                                    </div>
                                ))}

                                <button type='submit' className='container mx-auto bg-blue-500 font-bold text-white w-fit px-5 py-2 rounded'>
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            ) : 
            
            null
        }

        </div>
    )
};