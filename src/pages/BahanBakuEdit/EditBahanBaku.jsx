import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBalanceScale,
  FaBox,
  FaCommentDots,
  FaHashtag,
  FaTags,
  FaSave,
  FaTimes,
  FaFileAlt,
} from "react-icons/fa";
import { BsCalendar2CheckFill } from "react-icons/bs";

const EditBahanBaku = ({ url }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    nama: "",
    jumlah: "",
    satuan: "",
    jenisPengeluaran: "",
    keterangan: "",
    tanggal: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${url}/api/bahanBaku/editBahanBaku/${id}`
        );
        if (response.data.success) {
          setData(response.data.data);
        } else {
          toast.error("Data bahan baku tidak ditemukan");
        }
      } catch (error) {
        toast.error("Gagal mengambil data bahan baku");
      }
    };
    fetchData();
  }, [id]);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${url}/api/bahanBaku/editBahanBaku`, {
        id,
        ...data,
      });
      if (response.data.success) {
        toast.success("Data berhasil diperbarui!");
        setTimeout(() => navigate("/daftarBaku"), 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Terjadi kesalahan saat memperbarui data");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-xl font-bold text-gray-800 flex items-center mb-6">
        <FaFileAlt className="mr-2 text-blue-500" />
        Edit Data Barang Masuk
      </h2>

      <form onSubmit={onSubmitHandler} className="space-y-4">
        {/* Nama Barang */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaBox className="inline-block mr-2 text-gray-600" />
            Nama Barang
          </label>
          <input
            type="text"
            name="nama"
            value={data.nama}
            onChange={onChangeHandler}
            readOnly
            className="w-full border rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
          />
        </div>

        {/* Jumlah */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaHashtag className="inline-block mr-2 text-gray-600" />
            Jumlah
          </label>
          <input
            type="number"
            name="jumlah"
            value={data.jumlah}
            onChange={onChangeHandler}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Satuan */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaBalanceScale className="inline-block mr-2 text-gray-600" />
            Satuan
          </label>
          <select
            name="satuan"
            value={data.satuan}
            onChange={onChangeHandler}
            disabled
            className="w-full border rounded-md px-3 py-2 bg-gray-100 cursor-not-allowed"
          >
            <option value="">-- Pilih Satuan --</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="gram">Gram (g)</option>
            <option value="liter">Liter (L)</option>
            <option value="ml">Mililiter (mL)</option>
            <option value="meter">Meter (m)</option>
            <option value="cm">Centimeter (cm)</option>
            <option value="unit">Unit</option>
            <option value="pcs">Pcs (Pieces)</option>
          </select>
        </div>

        {/* Jenis Pengeluaran */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaTags className="inline-block mr-2 text-gray-600" />
            Jenis Pengeluaran
          </label>
          <select
            name="jenisPengeluaran"
            value={data.jenisPengeluaran}
            onChange={onChangeHandler}
            required
            className="w-full border rounded-md px-3 py-2"
          >
            <option value="">-- Pilih Jenis Pengeluaran --</option>
            <option value="Bahan Baku">Bahan Baku</option>
            <option value="Produk Hasil">Produk Hasil</option>
          </select>
        </div>

        {/* Tanggal */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <BsCalendar2CheckFill className="inline-block mr-2 text-gray-600" />
            Tanggal
          </label>
          <input
            type="date"
            name="tanggal"
            value={data.tanggal?.slice(0, 10)}
            onChange={onChangeHandler}
            required
            className="w-full border rounded-md px-3 py-2"
          />
        </div>

        {/* Keterangan */}
        <div>
          <label className="block font-medium text-gray-700 mb-1">
            <FaCommentDots className="inline-block mr-2 text-gray-600" />
            Keterangan
          </label>
          <textarea
            name="keterangan"
            rows="3"
            value={data.keterangan}
            onChange={onChangeHandler}
            placeholder="Tulis keterangan tambahan..."
            className="w-full border rounded-md px-3 py-2"
          ></textarea>
        </div>

        {/* Tombol */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            <FaSave /> Simpan
          </button>
          <button
            type="button"
            onClick={() => navigate("/daftarBaku")}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
          >
            <FaTimes /> Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBahanBaku;
