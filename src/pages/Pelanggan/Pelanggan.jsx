import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const DaftarPelanggan = ({ url }) => {
  const [pelanggan, setPelanggan] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka || 0);

  const fetchPelanggan = async () => {
    try {
      const res = await fetch(`${url}/api/pelanggan/daftar`);
      const data = await res.json();
      if (data.success) {
        setPelanggan(data.data);
      } else {
        console.error("Gagal mengambil data pelanggan");
      }
    } catch (err) {
      console.error("Kesalahan saat fetch pelanggan:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Yakin ingin menghapus?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:4000/api/pelanggan/hapus/${id}`,
          {
            method: "DELETE",
          }
        );
        const data = await res.json();

        if (data.success) {
          setPelanggan(pelanggan.filter((p) => p._id !== id));
          Swal.fire("Terhapus!", "Data pelanggan telah dihapus.", "success");
        } else {
          Swal.fire("Gagal", "Gagal menghapus data pelanggan.", "error");
        }
      } catch (err) {
        console.error("Gagal menghapus:", err);
        Swal.fire("Error", "Terjadi kesalahan saat menghapus.", "error");
      }
    }
  };

  const handleDiskon = (customer) => {
    Swal.fire({
      title: `Diskon untuk ${customer.customerNumber}?`,
      text: "Berikan diskon 10% untuk pembelian berikutnya?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Kirim Diskon",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        // Simulasi: kirim diskon ke nomor WA atau simpan ke database
        Swal.fire("Berhasil!", "Diskon telah dikirim ke pelanggan.", "success");
      }
    });
  };

  useEffect(() => {
    fetchPelanggan();
  }, []);

  if (loading)
    return <p className="text-center mt-4">Memuat data pelanggan...</p>;

  return (
    <div className="max-w-6xl mx-auto mt-10 p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Riwayat Pelanggan
      </h2>
      <table className="w-full border text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">No.</th>
            <th className="border px-2 py-1">Nomor Handpone Pembeli</th>
            <th className="border px-2 py-1">Total Transaksi</th>
            <th className="border px-2 py-1">Status</th>
            <th className="border px-2 py-1">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {pelanggan.map((item, index) => {
            const isLoyal = item.totalTransaksi >= 1000000; // lebih dari 1 juta
            return (
              <tr key={item._id} className="text-center">
                <td className="border px-2 py-1">{index + 1}</td>
                <td className="border px-2 py-1">{item.customerNumber || "-"}</td>
                <td className="border px-2 py-1">{formatRupiah(item.totalTransaksi)}</td>
                <td className="border px-2 py-1">
                  {isLoyal ? (
                    <span className="text-green-600 font-semibold">Pelanggan Setia</span>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="border px-2 py-1 space-x-1">
                  <button
                    onClick={() => handleDiskon(item)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded text-xs"
                  >
                    Kirim Diskon
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DaftarPelanggan;
