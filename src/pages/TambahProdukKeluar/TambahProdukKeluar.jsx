import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaHashtag,
  FaTags,
  FaMoneyBillWave,
  FaPlus,
  FaCommentDots,
} from "react-icons/fa";
import { BsCalendar2CheckFill } from "react-icons/bs";

const ProdukKeluar = ({ url }) => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    namaProduk: "",
    jumlah: "",
    keterangan: "",
    tanggal: "",
    jenisPengeluaran: "",
    harga: 0,
    total: 0,
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setData((prev) => ({ ...prev, tanggal: today }));
    fetchList();
  }, []);

  const fetchList = async () => {
    try {
      const res = await axios.get(`${url}/api/food/list`);
      if (res.data.success) {
        setList(res.data.data);
      } else {
        toast.error("Gagal mengambil data produk!");
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengambil data produk!");
    }
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    if (name === "namaProduk") {
      const selected = list.find((item) => item.namaProduk === value);
      const harga = Number(selected?.harga) || 0;
      const jumlah = Number(data.jumlah) || 0;
      const total = harga * jumlah;
      setData((prev) => ({
        ...prev,
        namaProduk: value,
        harga,
        total,
      }));
    } else if (name === "jumlah") {
      const jumlah = Number(value);
      const harga = Number(data.harga) || 0;
      const total = harga * jumlah;
      setData((prev) => ({
        ...prev,
        jumlah,
        total,
      }));
      if (!data.harga || data.harga === 0) {
        toast.error("Harga produk tidak ditemukan. Harap periksa kembali daftar produk!");
        setLoading(false);
        return;
      }
    } else {
      setData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${url}/api/bahanKeluar/produkKeluar`, data);
      if (res.data.success) {
        toast.success("Produk keluar berhasil ditambahkan!");
        setData({
          namaProduk: "",
          jumlah: "",
          harga: 0,
          total: 0,
          jenisPengeluaran: "",
          keterangan: "",
          tanggal: new Date().toISOString().split("T")[0],
        });
        setTimeout(() => {
          navigate("/daftarProdukKeluar");
        }, 1000);
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Terjadi kesalahan saat mengirim data!");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    if (!angka) return "";
    return "Rp " + angka.toLocaleString("id-ID");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <FaPlus className="text-red-600" />
          Tambah Produk Keluar
        </h2>

<form onSubmit={onSubmitHandler} className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Baris 1 */}
    <div>
      <label className="block font-semibold text-gray-700 mb-1">
        <FaBox className="inline mr-2 text-blue-500" />
        Nama Produk
      </label>
      <select
        name="namaProduk"
        value={data.namaProduk}
        onChange={onChangeHandler}
        className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring focus:ring-blue-300"
        required
      >
        <option value="">-- Pilih Produk --</option>
        {list.map((item, i) => (
          <option key={i} value={item.namaProduk}>
            {item.namaProduk}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block font-semibold text-gray-700 mb-1">
        <FaHashtag className="inline mr-2 text-indigo-500" />
        Jumlah
      </label>
      <input
        type="number"
        name="jumlah"
        value={data.jumlah}
        onChange={onChangeHandler}
        placeholder="Masukkan jumlah"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300"
        required
      />
    </div>

    {/* Baris 2 */}
    <div>
      <label className="block font-semibold text-gray-700 mb-1">
        <FaMoneyBillWave className="inline mr-2 text-green-500" />
        Harga Satuan
      </label>
      <input
        type="text"
        value={data.harga ? `Rp ${data.harga.toLocaleString()}` : ""}
        disabled
        className="w-full px-4 py-2 border bg-gray-100 rounded-md"
      />
    </div>

    <div>
      <label className="block font-semibold text-gray-700 mb-1">
        <FaMoneyBillWave className="inline mr-2 text-emerald-500" />
        Total Harga
      </label>
      <input
        type="text"
        value={data.total ? `Rp ${data.total.toLocaleString()}` : ""}
        disabled
        className="w-full px-4 py-2 border bg-gray-100 rounded-md"
      />
    </div>

    {/* Baris 3 */}
    <div>
      <label className="block font-semibold text-gray-700 mb-1">
        <FaTags className="inline mr-2 text-purple-500" />
        Jenis Pengeluaran
      </label>
      <select
        name="jenisPengeluaran"
        value={data.jenisPengeluaran}
        onChange={onChangeHandler}
        className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring focus:ring-purple-300"
        required
      >
        <option value="">-- Pilih Jenis --</option>
        <option value="Penjualan">Penjualan</option>
        <option value="Sample">Sample</option>
        <option value="Rusak">Rusak</option>
        <option value="Lainnya">Lainnya</option>
      </select>
    </div>

    <div>
      <label className="block font-semibold text-gray-700 mb-1">
        <BsCalendar2CheckFill className="inline mr-2 text-pink-500" />
        Tanggal
      </label>
      <input
        type="date"
        name="tanggal"
        value={data.tanggal}
        onChange={onChangeHandler}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-pink-300"
        required
      />
    </div>
  </div>

  {/* Keterangan (Full Width) */}
  <div>
    <label className="block font-semibold text-gray-700 mb-1">
      <FaCommentDots className="inline mr-2 text-gray-500" />
      Keterangan
    </label>
    <textarea
      name="keterangan"
      rows="3"
      value={data.keterangan}
      onChange={onChangeHandler}
      placeholder="Tulis keterangan tambahan..."
      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-gray-300"
    ></textarea>
  </div>

  {/* Tombol Submit */}
  <div className="text-right">
    <button
      type="submit"
      disabled={loading}
      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 flex items-center gap-2"
    >
      <FaPlus />
      {loading ? "Menyimpan..." : "Tambah Produk Keluar"}
    </button>
  </div>
</form>

      </div>
    </div>
  );
};

export default ProdukKeluar;
