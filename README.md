📘 README – Realtime Update pada Money Management App

🧩 Deskripsi Singkat
Aplikasi ini menggunakan React + Firebase Realtime Database untuk mencatat dan menampilkan transaksi keuangan. 
Fitur utama yang dijelaskan di sini adalah sinkronisasi otomatis (realtime) antara penambahan transaksi (AddIncome) dan tabel daftar transaksi (AllTransactionsTable).

⚙️ Struktur Utama Komponen

1. AddIncome.jsx
Komponen ini berfungsi untuk menambahkan data pemasukan baru ke Firebase.

- Mengambil user aktif dari auth.currentUser.
- Menggunakan fungsi push() untuk menulis data baru ke path:
  transactions/{user.uid}/income
- Setelah data berhasil ditambahkan, Firebase akan mengirimkan sinyal update ke semua listener aktif.

2. AllTransactionsTable.jsx
Komponen ini menampilkan seluruh transaksi user (baik pemasukan maupun pengeluaran).
------------------------------------------------------

🔄 Alur Realtime Update
1. User mengisi form pada AddIncome dan klik Submit.
2. Fungsi push() menambahkan data baru ke Firebase Realtime Database.
3. Firebase mendeteksi adanya data baru dan memicu event onValue() pada AllTransactionsTable.
4. AllTransactionsTable otomatis menerima snapshot terbaru dan melakukan setTransactions() untuk memperbarui tampilan.
5. Hasil: data baru muncul langsung tanpa perlu refresh halaman.

📦 Dependensi yang Digunakan
- React
- Firebase v9 Modular SDK
- react-icons
- TailwindCSS

✅ Tips Tambahan
- Gunakan onValue() hanya saat data memang perlu realtime.
- Gunakan get() untuk data statis.
- Jangan lupa membersihkan listener dengan return () => listener(); agar tidak ada memori bocor.

👨‍💻 Penulis
Dikembangkan sebagai bagian dari proyek Money Management App — sistem pencatatan keuangan dengan fitur login, filter transaksi, edit, dan penghapusan data.
