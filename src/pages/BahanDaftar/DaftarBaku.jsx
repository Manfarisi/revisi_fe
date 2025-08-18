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
  FaSortAmountDown,
  FaSortAmountUp,
  FaFilter,
} from "react-icons/fa";

const DaftarBaku = ({ url }) => {
  const [list, setList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTanggal, setFilterTanggal] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [filterPersediaan, setFilterPersediaan] = useState("");
  const [sortByStok, setSortByStok] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const itemsPerPage = 8;

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${url}/api/bahanBaku/daftarBahanBaku`);
      if (res.data.success) {
        setList(res.data.data);
      } else {
        toast.error("Gagal mengambil data!");
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengambil data!");
    } finally {
      setIsLoading(false);
    }
  };

  const hapusBahanBaku = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus data ini?")) return;
    
    try {
      const res = await axios.post(`${url}/api/bahanBaku/hapusBahanBaku`, { id });
      if (res.data.success) {
        toast.success(res.data.message);
        fetchList();
      } else {
        toast.error("Gagal menghapus data!");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menghapus data!");
    }
  };

  const editBahanBaku = (id) => navigate(`/daftarBaku/edit/${id}`);

  const formatTanggal = (isoDate) => {
    const tanggal = new Date(isoDate);
    return tanggal.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  useEffect(() => {
    fetchList();
  }, []);

  const filteredList = list.filter((item) => {
    const cocokNama = item.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const cocokTanggal = filterTanggal
      ? new Date(item.tanggal).toISOString().slice(0, 10) === filterTanggal
      : true;
    const cocokJenis = filterJenis ? item.jenis === filterJenis : true;
    const cocokPersediaan =
      filterPersediaan === "rendah"
        ? item.jumlah <= 5
        : filterPersediaan === "cukup"
        ? item.jumlah > 5
        : true;

    return cocokNama && cocokTanggal && cocokJenis && cocokPersediaan;
  });

  const sortedList = [...filteredList].sort((a, b) => {
    if (sortByStok === "terbesar") return b.jumlah - a.jumlah;
    if (sortByStok === "terkecil") return a.jumlah - b.jumlah;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedList.length / itemsPerPage);

  const totalKeseluruhan = sortedList.reduce(
    (acc, item) => acc + (item.total || item.hargaBeli * item.jumlah),
    0
  );

  const stokRendahCount = sortedList.filter((i) => i.jumlah < 10).length;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                📥 Daftar Penyimpanan Bahan dan Barang
              </h1>
              <p className="text-blue-100">
                Manajemen stok bahan dan barang secara menyeluruh
              </p>
            </div>
            <button
              onClick={() => navigate("/masuk")}
              className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 px-5 py-2.5 rounded-lg shadow-md font-medium transition-all"
            >
              <FaPlus /> Tambah Barang
            </button>
          </div>
        </div>

        {/* Notification */}
        {stokRendahCount > 0 && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mx-6 mt-4 rounded-r-lg flex items-start gap-3">
            <FaExclamationTriangle className="mt-1 flex-shrink-0" />
            <div>
              <p className="font-medium">
                Ada <span className="font-bold">{stokRendahCount}</span> barang dengan stok rendah!
              </p>
              <p className="text-sm">Segera lakukan restock untuk barang-barang ini.</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="p-6 border-b">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Cari nama barang..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => {
                setFilterTanggal(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />

            <select
              value={filterJenis}
              onChange={(e) => {
                setFilterJenis(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Jenis</option>
              <option value="BAHAN">BAHAN</option>
              <option value="BARANG">BARANG</option>
            </select>

            <select
              value={filterPersediaan}
              onChange={(e) => {
                setFilterPersediaan(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Semua Persediaan</option>
              <option value="rendah">Stok Rendah (≤5)</option>
              <option value="cukup">Stok Cukup (&gt;5)</option>
            </select>

            <select
              value={sortByStok}
              onChange={(e) => {
                setSortByStok(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Urutkan Stok</option>
              <option value="terbesar">
                <FaSortAmountUp /> Stok Terbanyak
              </option>
              <option value="terkecil">
                <FaSortAmountDown /> Stok Terkecil
              </option>
            </select>
          </div>
        </div>

        {/* Summary */}
        <div className="px-6 py-3 bg-blue-50 border-b flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Menampilkan {currentItems.length} dari {sortedList.length} barang
          </div>
          <div className="font-semibold text-blue-700">
            Total Nilai: {formatCurrency(totalKeseluruhan)}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Nama Barang",
                  "Jenis",
                  "Kode",
                  "Harga Beli",
                  "Jumlah",
                  "Total",
                  "Satuan",
                  "Pegawai",
                  "Tanggal",
                  "Keterangan",
                  "Status",
                  "Aksi",
                ].map((header, idx) => (
                  <th
                    key={idx}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      idx === 0 ? "rounded-tl-lg" : ""
                    } ${
                      idx === 11 ? "rounded-tr-lg" : ""
                    }`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan="12" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Memuat data...</p>
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr
                    key={item._id}
                    className={`hover:bg-blue-50 transition-colors ${
                      item.jumlah <= 5 ? "bg-red-50" : ""
                    }`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{item.nama}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          item.jenis === "BAHAN"
                            ? "bg-green-100 text-green-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                      >
                        {item.jenis}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {item.kodeBahan}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatCurrency(item.hargaBeli)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {item.jumlah}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      {formatCurrency(item.total || item.hargaBeli * item.jumlah)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                        {item.satuan}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {item.kodePetugas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {formatTanggal(item.tanggal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-purple-600 font-medium">
                      {item.keterangan || "-"}
                    </td>
                     <td
                      className={`px-6 py-4 text-sm font-semibold ${
                        item.jumlah < 10 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.jumlah} Persediaan
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editBahanBaku(item._id)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => hapusBahanBaku(item._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition-colors"
                          title="Hapus"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="12" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <FaInbox className="h-12 w-12 mb-3" />
                      <h3 className="text-lg font-medium text-gray-500">
                        Tidak ada data ditemukan
                      </h3>
                      <p className="mb-4 text-gray-400">
                        Coba ubah filter pencarian Anda
                      </p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setFilterTanggal("");
                          setFilterJenis("");
                          setFilterPersediaan("");
                          setSortByStok("");
                        }}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Reset semua filter
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
          <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Sebelumnya
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                Selanjutnya
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Menampilkan <span className="font-medium">{indexOfFirstItem + 1}</span> -{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, sortedList.length)}
                  </span>{" "}
                  dari <span className="font-medium">{sortedList.length}</span> hasil
                </p>
              </div>
              <div>
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Sebelumnya</span>
                    &larr;
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                          currentPage === page
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="sr-only">Selanjutnya</span>
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DaftarBaku;