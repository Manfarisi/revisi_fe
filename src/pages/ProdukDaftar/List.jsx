import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaEdit,
  FaTrashAlt,
  FaPlus,
  FaSearch,
  FaExclamationTriangle,
} from "react-icons/fa";
import Swal from "sweetalert2";


const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("");

  const itemsPerPage = 8;

  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Gagal mengambil data makanan!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data!");
    }
  };

  const editFood = (id) => {
    navigate(`/list/edit/${id}`);
  };

const removeFood = async (id) => {
  const result = await Swal.fire({
    title: "Yakin ingin menghapus?",
    text: "Data makanan yang dihapus tidak bisa dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  });

  if (result.isConfirmed) {
    try {
      const response = await axios.post(`${url}/api/food/remove`, { id });
      if (response.data.success) {
        Swal.fire("Berhasil!", response.data.message, "success");
        fetchList();
      } else {
        Swal.fire("Gagal!", "Gagal menghapus data!", "error");
      }
    } catch (error) {
      Swal.fire("Error!", "Terjadi kesalahan saat menghapus data!", "error");
    }
  }
};


  useEffect(() => {
    fetchList();
  }, []);

const filteredList = list.filter((item) => {
  const matchSearch = item.namaProduk
    ?.toLowerCase()
    .includes(search.toLowerCase());
  const matchCategory = selectedCategory
    ? item.kategori === selectedCategory
    : true;
  return matchSearch && matchCategory;
});


  const lowStockItems = filteredList.filter((item) => item.jumlah < 10);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);

  return (
    <div className="flex justify-center p-6 bg-gray-100 min-h-screen">
      <div className="w-full max-w-7xl bg-white shadow-xl rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center md:text-left">
              Daftar Produk
            </h1>
            <p className="text-gray-600 text-center md:text-left">
              Manajemen Menu Produk
            </p>
          </div>
          <button
            onClick={() => navigate("/add")}
            className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
          >
            <FaPlus className="mr-2" /> Tambah Makanan
          </button>
        </div>

        {lowStockItems.length > 0 && (
          <div className="bg-red-100 text-red-700 p-4 mb-4 rounded-md flex items-center space-x-3">
            <FaExclamationTriangle className="w-5 h-5" />
            <p>
              Terdapat <strong>{lowStockItems.length}</strong> produk dengan
              persediaan rendah. Segera lakukan penambahan stok!
            </p>
          </div>
        )}

        <div className="mb-4 flex items-center space-x-2">
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama produk..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-6 max-w-7xl mx-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 text-gray-700 shadow"
          >
            <option value="">Semua Kategori</option>
            <option value="Hampers">Hampers</option>
            <option value="Frozen">Frozen</option>
            <option value="Paket Mini Frozen">Paket Mini Frozen</option>
            <option value="Paket Matang">Paket Matang</option>
            <option value="Hampers Neela Klappertart">
              Hampers Neela Klappertart
            </option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-center">
            <thead className="bg-blue-50">
              <tr>
                {[
                  "Gambar",
                  "Nama",
                  "Kode Produk",
                  "Petugas",
                  "Kategori",
                  "Deskripsi",
                  "Jumlah",
                  "HPP",
                  "Harga",
                  "Aksi",
                ].map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-xs font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((item) => (
                  <tr key={item._id}>
                    <td className="px-6 py-4">
                      <img
                        src={`${url}/images/${item.image}`}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-md border border-gray-200 mx-auto"
                      />
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.namaProduk}
                    </td>
                       <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.kodeProduk}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.kodePetugas}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {item.kategori}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 break-words max-w-xs mx-auto">
                      {item.keterangan}
                    </td>
                    <td
                      className={`px-6 py-4 text-sm font-semibold ${
                        item.jumlah < 10 ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {item.jumlah} Persediaan
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Rp {item.hpp?.toLocaleString("id-ID") || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      Rp {item.harga?.toLocaleString("id-ID") || "-"}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => editFood(item._id)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors"
                          title="Edit"
                        >
                          <FaEdit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => removeFood(item._id)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-100 transition-colors"
                          title="Hapus"
                        >
                          <FaTrashAlt className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <FaPlus className="h-12 w-12 text-gray-400" />
                      <h3 className="text-xl font-semibold">
                        Belum ada produk terdaftar
                      </h3>
                      <p className="text-gray-500">
                        Mulai dengan menambahkan menu produk baru.
                      </p>
                      <button
                        onClick={() => navigate("/add")}
                        className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center"
                      >
                        <FaPlus className="mr-2" /> Tambah Makanan
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-6 space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === 1}
            >
              &laquo;
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              disabled={currentPage === totalPages}
            >
              &raquo;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default List;
