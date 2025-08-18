import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrashAlt,
  FaInbox,
  FaExclamationTriangle,
  FaSearch,
} from "react-icons/fa";

const TransaksiBahanBarang = ({ url, onTotalChange }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterPersediaan, setFilterPersediaan] = useState("");
  const [sortByStok, setSortByStok] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const itemsPerPage = 8;

  const fetchList = async () => {
    try {
      const res = await axios.get(`${url}/api/bahanBaku/daftarBahanBaku`);
      if (res.data.success) {
        setList(res.data.data);
      } else {
        toast.error("Gagal mengambil data!");
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengambil data!");
    }
  };

  const formatTanggal = (isoDate) => {
    const tanggal = new Date(isoDate);
    return tanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list.filter((item) => {
    const cocokNama = item.nama
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const cocokTanggal = filterTanggal
      ? new Date(item.tanggal).toISOString().slice(0, 10) === filterTanggal
      : true;
    const cocokJenis = filterJenis ? item.jenisPemasukan === filterJenis : true;
    const cocokPersediaan =
      filterPersediaan === "rendah"
        ? item.jumlah <= 5
        : filterPersediaan === "cukup"
        ? item.jumlah > 5
        : true;

    return cocokNama && cocokTanggal && cocokJenis && cocokPersediaan;
  });

  if (sortByStok === "terbesar") {
    filteredList.sort((a, b) => b.jumlah - a.jumlah);
  } else if (sortByStok === "terkecil") {
    filteredList.sort((a, b) => a.jumlah - b.jumlah);
  }

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  // Hitung total keseluruhan dari list yang sudah difilter
const totalKeseluruhan = filteredList.reduce((acc, item) => {
    const harga = Number(item.hargaBeli) || 0;
    const jumlah = Number(item.jumlah) || 0;
    const totalItem = item.total ? Number(item.total) : harga * jumlah;
    return acc + totalItem;
  }, 0);

  useEffect(() => {
  if (onTotalChange) {
    onTotalChange(totalKeseluruhan);
  }
}, [totalKeseluruhan, onTotalChange, filteredList]);


  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-blue-200">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">
              Daftar Pembelian Bahan Dan Barang
            </h1>
            <p className="text-gray-600">Manajemen stok bahan dan barang</p>
          </div>
        </div>


        {/* Filter */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Cari nama barang..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <input
            type="date"
            value={filterTanggal}
            onChange={(e) => setFilterTanggal(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          />
          <select
            value={filterJenis}
            onChange={(e) => setFilterJenis(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Semua Jenis</option>
            <option value="Produk Hasil">Produk Hasil</option>
            <option value="Bahan Baku">Bahan Baku</option>
          </select>
        </div>

        {/* Total Transaksi */}
        <div className="flex justify-end mt-4 mb-4">
          <div className="bg-red-100 border border-red-300 text-red-800 px-6 py-3 rounded-lg shadow font-semibold">
            Total Keseluruhan:{""}
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
            }).format(totalKeseluruhan)}
          </div>
        </div>


        {/* Tabel */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                {[
                  "Nama Bahan / Barang",
                  "Kode Bahan / Barang",
                  "Harga Beli",
                  "Jumlah",
                  "Total",
                  "Tanggal Masuk",
                ].map((title) => (
                  <th
                    key={title}
                    className="px-5 py-3 text-center text-base font-semibold"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-blue-200 hover:bg-blue-50"
                  >
                    <td className="px-5 py-3 text-center">{item.nama}</td>
                    <td className="px-5 py-3 text-center">{item.kodeBahan}</td>
                    <td className="px-5 py-3 text-center">
                      {item.hargaBeli
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.hargaBeli)
                        : new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                    </td>{" "}
                    <td className="px-5 py-3 text-center">{item.jumlah}</td>
                    <td className="px-5 py-3 text-center">
                      {item.total
                        ? new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.total)
                        : new Intl.NumberFormat("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          }).format(item.hargaBeli * item.jumlah)}
                    </td>{" "}
                    <td className="px-5 py-3 text-center">
                      {formatTanggal(item.tanggal)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center py-12">
                    <div className="flex flex-col items-center text-gray-500 text-lg">
                      <FaInbox size={48} className="mb-3" />
                      <h3 className="text-xl font-semibold">
                        Tidak ada data ditemukan
                      </h3>
                      <p className="mb-4">
                        Ubah filter atau tambahkan barang baru.
                      </p>
                      <button
                        onClick={() => navigate("/masuk")}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg shadow"
                      >
                        <FaPlus /> Tambah Barang
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 text-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-md border disabled:bg-gray-200 disabled:text-gray-500"
            >
              Sebelumnya
            </button>
            <span className="text-gray-600">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-md border disabled:bg-gray-200 disabled:text-gray-500"
            >
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransaksiBahanBarang;
