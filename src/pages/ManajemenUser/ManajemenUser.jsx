import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

function VerifikasiUser({ url }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getPendingUsers();
  }, []);

 const getPendingUsers = async () => {
  try {
    const res = await axios.get(`${url}/api/user/user`);
    const pending = res.data.data.filter(
      (user) => user.kategori === "Pegawai" && user.status === "pending"
    );
    setUsers(pending);
  } catch (err) {
    console.error("Gagal ambil user", err);
  }
};

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`${url}/api/user/status/${id}`);
      if (res.data.success) {
        Swal.fire("Berhasil!", "User telah di-ACC", "success");
        getPendingUsers();
      } else {
        Swal.fire("Gagal!", res.data.message, "error");
      }
    } catch (error) {
      Swal.fire("Error", "Gagal mengupdate status user", "error");
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus user ini?",
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axios.delete(`${url}/api/user/user-delete/${id}`);
          console.log("Delete response:", res.data);

        if (res.data.success) {
          Swal.fire("Dihapus!", "User berhasil dihapus.", "success");
          getPendingUsers();
        } else {
          Swal.fire("Gagal!", res.data.message, "error");
        }
      } catch (error) {
        Swal.fire("Error", "Gagal menghapus user", "error");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-6">
      <h2 className="text-2xl font-bold mb-6 text-blue-700 border-b pb-2">
        Verifikasi Pengguna Baru
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500 italic">
          Tidak ada pengguna yang menunggu persetujuan.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 border text-left text-sm font-semibold text-gray-700">Nama Lengkap</th>
                <th className="px-4 py-3 border text-left text-sm font-semibold text-gray-700">Divisi</th>
                <th className="px-4 py-3 border text-left text-sm font-semibold text-gray-700">Jenis Kelamin</th>
                <th className="px-4 py-3 border text-left text-sm font-semibold text-gray-700">Email</th>
                <th className="px-4 py-3 border text-left text-sm font-semibold text-gray-700">No Telepon</th>
                <th className="px-4 py-3 border text-center text-sm font-semibold text-gray-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={user._id}
                  className={`hover:bg-blue-50 transition-colors ${
                    i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 border">{user.namaLengkap}</td>
                  <td className="px-4 py-3 border">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.bagian === "Gudang"
                          ? "bg-green-100 text-green-700"
                          : user.bagian === "Keuangan"
                          ? "bg-yellow-100 text-yellow-700"
                          : user.bagian === "Produksi"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {user.bagian}
                    </span>
                  </td>
                  <td className="px-4 py-3 border">{user.jenisKelamin}</td>
                  <td className="px-4 py-3 border">{user.email}</td>
                  <td className="px-4 py-3 border">{user.noTelepon}</td>
                  <td className="px-4 py-3 border text-center">
                    <button
                      onClick={() => handleApprove(user._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Terima
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition ml-2"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default VerifikasiUser;
