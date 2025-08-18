import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaSave,
  FaTimes,
  FaMoneyBillWave,
  FaTags,
  FaFileAlt,
  FaCalendarAlt,
  FaBoxOpen,
  FaLayerGroup,
  FaCalculator,
} from "react-icons/fa";

const EditProdukKeluar = ({ url }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    namaProduk: "",
    jumlah: "",
    harga: "",
    jenisPengeluaran: "",
    tanggal: "",
    keterangan: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${url}/api/bahanKeluar/editProdukKeluar/${id}`
        );
        if (res.data.success) {
          setData(res.data.data);
        } else {
          toast.error("Data tidak ditemukan!");
        }
      } catch {
        toast.error("Gagal mengambil data!");
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "harga") return;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${url}/api/bahanKeluar/editProdukKeluar`,
        { id, ...data }
      );
      if (res.data.success) {
        toast.success("Produk keluar berhasil diperbarui!");
        setTimeout(() => navigate("/daftarProdukKeluar"), 1000);
      } else {
        toast.error(res.data.message || "Gagal menyimpan perubahan!");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan!");
    }
  };

  const total = (parseFloat(data.jumlah) || 0) * (parseFloat(data.harga) || 0);

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(angka);

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-blue-600 flex items-center gap-2">
        <FaFileAlt /> Edit Produk Keluar
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaBoxOpen className="inline mr-2" />
            Nama Produk
          </label>
          <input
            type="text"
            name="namaProduk"
            value={data.namaProduk}
            readOnly
            className="w-full bg-gray-100 border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaLayerGroup className="inline mr-2" />
            Jumlah
          </label>
          <input
            type="number"
            name="jumlah"
            value={data.jumlah}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaMoneyBillWave className="inline mr-2" />
            Harga Satuan
          </label>
          <input
            type="text"
            name="harga"
            value={formatRupiah(data.harga)}
            readOnly
            className="w-full bg-gray-100 border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaCalculator className="inline mr-2" />
            Total
          </label>
          <input
            type="text"
            value={formatRupiah(total)}
            readOnly
            className="w-full bg-gray-100 border rounded-lg px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaTags className="inline mr-2" />
            Jenis Pengeluaran
          </label>
          <select
            name="jenisPengeluaran"
            value={data.jenisPengeluaran}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
          >
            <option value="">-- Pilih Jenis --</option>
            <option value="Penjualan">Penjualan</option>
            <option value="Sample">Sample</option>
            <option value="Rusak">Rusak</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaCalendarAlt className="inline mr-2" />
            Tanggal Keluar
          </label>
          <input
            type="date"
            name="tanggal"
            value={data.tanggal?.split("T")[0]}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaFileAlt className="inline mr-2" />
            Keterangan
          </label>
          <textarea
            name="keterangan"
            value={data.keterangan}
            onChange={handleChange}
            rows="3"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <FaSave /> Simpan
          </button>
          <button
            type="button"
            onClick={() => navigate("/produk-keluar")}
            className="flex items-center gap-2 bg-red-400 text-white px-5 py-2 rounded-lg hover:bg-red-500 transition"
          >
            <FaTimes /> Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProdukKeluar;
