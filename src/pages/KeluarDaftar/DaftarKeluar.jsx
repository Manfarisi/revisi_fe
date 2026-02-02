import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrashAlt, FaInbox, FaSearch } from "react-icons/fa";

const DaftarKeluar = ({ url }) => {
  const [list, setList] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [bulan, setBulan] = useState(""); // bulan format "01" - "12"
  const [tahun, setTahun] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");

  const navigate = useNavigate();

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/bahanBaku/daftarBarangTersisa`);
      if (response.data.success) {
        setList(response.data.data);
        setFiltered(response.data.data);
      } else {
        toast.error("Gagal mengambil data!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat mengambil data!");
    }
  };

  const hapusBahanKeluar = async (id) => {
    try {
      const response = await axios.post(`${url}/api/bahanBaku/hapusBahanKeluar`, { id });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Gagal menghapus data!");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghapus data!");
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

  const editBahanKeluar = (id) => {
    navigate(`/daftarKeluar/edit/${id}`);
  };

  const filterData = () => {
    let data = [...list];

    if (search.trim()) {
      data = data.filter((item) =>
        item.nama.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (bulan) {
      data = data.filter((item) => {
        const tanggal = new Date(item.tanggal);
        return String(tanggal.getMonth() + 1).padStart(2, "0") === bulan;
      });
    }

    if (tahun) {
      data = data.filter((item) => {
        const tanggal = new Date(item.tanggal);
        return String(tanggal.getFullYear()) === tahun;
      });
    }

    if (jenisFilter) {
      data = data.filter((item) => item.jenisPengeluaran === jenisFilter);
    }

    setFiltered(data);
  };

  useEffect(() => {
    fetchList();
  }, []);

  useEffect(() => {
    filterData();
  }, [search, bulan, tahun, jenisFilter, list]);

  const jenisOptions = [...new Set(list.map((item) => item.jenisPengeluaran))];

  const tahunOptions = Array.from(
    new Set(list.map((item) => new Date(item.tanggal).getFullYear()))
  ).sort();

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-blue-200">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">📦 Daftar Barang Keluar</h1>
            <p className="text-gray-600">Manajemen stok barang keluar harian</p>
          </div>
        </div>

        {/* Filter & Search */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex items-center gap-2">
            <FaSearch className="text-gray-500" />
            <input
              type="text"
              placeholder="Cari nama barang..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={bulan}
            onChange={(e) => setBulan(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Semua Bulan</option>
            {[
              "01", "02", "03", "04", "05", "06",
              "07", "08", "09", "10", "11", "12",
            ].map((val, idx) => (
              <option key={idx} value={val}>
                {new Date(0, parseInt(val) - 1).toLocaleString("id-ID", { month: "long" })}
              </option>
            ))}
          </select>

          <select
            value={tahun}
            onChange={(e) => setTahun(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Semua Tahun</option>
            {tahunOptions.map((th, idx) => (
              <option key={idx} value={th}>
                {th}
              </option>
            ))}
          </select>

          <select
            value={jenisFilter}
            onChange={(e) => setJenisFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Semua Jenis</option>
            {jenisOptions.map((jenis, index) => (
              <option key={index} value={jenis}>
                {jenis}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl shadow">
          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                {[
                  "Nama Barang",
                  "Jumlah",
                  "Harga",
                  "Satuan",
                  "Tanggal",
                  "Pegawai",
                  "Jenis Pengeluaran",
                  "Keterangan",
                  "Aksi",
                ].map((title) => (
                  <th
                    key={title}
                    className="px-5 py-3 font-semibold text-center text-base"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-blue-200 hover:bg-blue-50"
                  >
                    <td className="px-5 py-3 font-medium text-center text-base">
                      {item.nama}
                    </td>
                    <td className="px-5 py-3 text-center text-base">{item.jumlah}</td>
                    <td className="px-5 py-3 text-center text-base">{item.harga}</td>
                    <td className="px-5 py-3 text-center text-base">
                      <span className="bg-blue-200 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {item.satuan}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center text-base">
                      {formatTanggal(item.tanggal)}
                    </td>
                    <td className="px-5 py-3 text-center text-base">
                      {(item.kodePetugas)}
                    </td>
                    <td className="px-5 py-3 text-center text-base">
                      <span className="text-purple-600 font-semibold">
                        {item.jenisPengeluaran}
                      </span>
                    </td>
                    <td className="px-5 py-3 max-w-xs truncate text-gray-600 text-center text-base">
                      {item.keterangan}
                    </td>
                    <td className="px-5 py-3 text-center text-base">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => editBahanKeluar(item._id)}
                          className="p-2 rounded-full bg-green-400 hover:bg-green-500 text-white shadow-md"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => hapusBahanKeluar(item._id)}
                          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md"
                        >
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex flex-col items-center text-gray-500 text-lg">
                      <FaInbox size={48} className="mb-3" />
                      <h3 className="text-xl font-semibold">
                        Tidak ada data ditemukan
                      </h3>
                      <p className="mb-4">
                        Ubah filter atau tambahkan barang keluar baru.
                      </p>
                      <button
                        onClick={() => navigate("/keluar")}
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
      </div>
    </div>
  );
};

export default DaftarKeluar;
