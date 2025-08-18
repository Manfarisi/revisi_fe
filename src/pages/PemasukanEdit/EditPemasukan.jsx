import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaCommentDots,
  FaFileAlt,
  FaLayerGroup,
  FaMoneyBillWave,
  FaSave,
  FaTags,
  FaTimes,
} from "react-icons/fa";

const EditPemasukan = ({ url }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    namaPemasukan: "",
    jumlah: "",
    jenisPemasukan: "",
    tanggal: "",
    keterangan: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${url}/api/pemasukan/editPemasukan/${id}`);
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
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${url}/api/pemasukan/editPemasukan`, {
        id,
        ...data,
      });
      if (res.data.success) {
        toast.success("Pemasukan berhasil diperbarui!");
        setTimeout(() => navigate("/daftarPemasukan"), 1000);
      } else {
        toast.error(res.data.message || "Gagal menyimpan perubahan!");
      }
    } catch {
      toast.error("Terjadi kesalahan saat menyimpan!");
    }
  };

  const formatRupiah = (angka) => {
    if (!angka) return "";
    const numString = angka.toString().replace(/[^,\d]/g, "");
    const split = numString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/g);
    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }
    return "Rp " + rupiah;
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-xl p-6 mt-10">
      <div className="mb-6 flex items-center gap-2 text-blue-600 text-2xl font-semibold">
        <FaFileAlt className="text-blue-600" />
        Edit Data Pemasukan
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Pemasukan */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
            <FaLayerGroup className="text-indigo-500" /> Nama Pemasukan
          </label>
          <input
            type="text"
            name="namaPemasukan"
            value={data.namaPemasukan}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Jumlah */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
            <FaMoneyBillWave className="text-green-500" /> Jumlah
          </label>
          <input
            type="text"
            name="jumlah"
            value={formatRupiah(data.jumlah)}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                jumlah: e.target.value.replace(/\D/g, ""),
              }))
            }
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Jenis Pemasukan */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
            <FaTags className="text-yellow-500" /> Jenis Pemasukan
          </label>
          <select
            name="jenisPemasukan"
            value={data.jenisPemasukan}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">-- Pilih Jenis Pemasukan --</option>
            <option value="Penjualan">Penjualan</option>
            <option value="Investasi">Investasi</option>
            <option value="Pinjaman">Pinjaman</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        {/* Tanggal */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
            <FaCalendarAlt className="text-purple-500" /> Tanggal
          </label>
          <input
            type="date"
            name="tanggal"
            value={data.tanggal?.split("T")[0]}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Keterangan */}
        <div>
          <label className="flex items-center gap-2 font-medium text-gray-700 mb-1">
            <FaCommentDots className="text-pink-500" /> Keterangan
          </label>
          <textarea
            name="keterangan"
            rows="3"
            value={data.keterangan}
            onChange={handleChange}
            placeholder="Tulis keterangan tambahan..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500"
          ></textarea>
        </div>

        {/* Tombol */}
        <div className="flex justify-between mt-6">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg"
          >
            <FaSave /> Simpan Perubahan
          </button>
          <button
            type="button"
            onClick={() => navigate("/daftarPemasukan")}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-medium px-4 py-2 rounded-lg"
          >
            <FaTimes /> Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPemasukan;
