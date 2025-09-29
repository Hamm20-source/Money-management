import { ref, remove, update } from "firebase/database";
import { database, auth } from "../utils/Firebase";

export const updateTransactions = async (type, id, updatedData) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await update(ref(database, `transactions/${user.uid}/${type}/${id}`), updatedData)
        console.log("Transaksi berhasil diupdate")
    } catch (error) {
        console.log("Transaksi gagal diupdate", error)
    }
};

export const deleteTransactions = async (type, id) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
        await remove(ref(database, `transactions/${user.uid}/${type}/${id}`))
        console.log("Transaksi berhasil dihapus")
    } catch (error) {
        console.log("Transaksi gagal dihapus", error)
    }
};