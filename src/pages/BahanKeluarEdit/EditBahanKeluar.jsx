import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  BsCalendar2CheckFill,
} from "react-icons/bs";
import {
  FaBalanceScale,
  FaBox,
  FaCommentDots,
  FaHashtag,
  FaTags,
  FaSave,
  FaTimes,
} from "react-icons/fa";

const EditBahanKeluar = ({ url }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState({
    namaBarang: "",
    jumlah: "",
    satuan: "",
    jenisPemasukan: "",
    keterangan: "",
    tanggal: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/bahanBaku/editBahanKeluar/${id}`);
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
      const response = await axios.post(`${url}/api/bahanBaku/editBahanKeluar`, {
        id,
        ...data,
      });
      if (response.data.success) {
        toast.success("Data berhasil diperbarui!");
        setTimeout(() => navigate("/daftarKeluar"), 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error("Terjadi kesalahan saat memperbarui data");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-8 text-blue-700 flex items-center gap-3">
        <FaBox className="text-blue-600" />
        Edit Data Barang Keluar
      </h2>

      <form onSubmit={onSubmitHandler} className="space-y-6">
        <div>
          <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
            <FaBox className="text-indigo-500" />
            Nama Barang
          </label>
          <input
            type="text"
            name="namaBarang"
            value={data.namaBarang}
            onChange={onChangeHandler}
            readOnly
            required
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 cursor-not-allowed"
          />
        </div>

        <div>
          <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
            <FaHashtag className="text-green-500" />
            Jumlah
          </label>
          <input
            type="number"
            name="jumlah"
            value={data.jumlah}
            onChange={onChangeHandler}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <div>
          <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
            <FaBalanceScale className="text-yellow-500" />
            Satuan
          </label>
          <select
            name="satuan"
            value={data.satuan}
            onChange={onChangeHandler}
            disabled
            className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 cursor-not-allowed"
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

        <div>
          <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
            <FaTags className="text-purple-500" />
            Jenis Pengeluaran
          </label>
          <select
            name="jenisPemasukan"
            value={data.jenisPemasukan}
            onChange={onChangeHandler}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
          >
            <option value="">-- Pilih Jenis --</option>
            <option value="Bahan Baku">Bahan Baku (Produksi)</option>
            <option value="Sample">Sample</option>
            <option value="Rusak">Rusak</option>
          </select>
        </div>

        <div>
          <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
            <BsCalendar2CheckFill className="text-red-500" />
            Tanggal
          </label>
          <input
            type="date"
            name="tanggal"
            value={data.tanggal?.slice(0, 10)}
            onChange={onChangeHandler}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        <div>
          <label className=" text-gray-700 font-medium mb-2 flex items-center gap-2">
            <FaCommentDots className="text-pink-500" />
            Keterangan
          </label>
          <textarea
            name="keterangan"
            rows="3"
            value={data.keterangan}
            onChange={onChangeHandler}
            placeholder="Tulis keterangan tambahan..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-400 resize-none"
          ></textarea>
        </div>

        <div className="flex justify-between mt-8">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            <FaSave /> Simpan Perubahan
          </button>
          <button
            type="button"
            onClick={() => navigate("/daftarBaku")}
            className="flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition duration-300"
          >
            <FaTimes /> Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditBahanKeluar;
