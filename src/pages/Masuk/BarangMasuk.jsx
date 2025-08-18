import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { BsCalendar2CheckFill } from "react-icons/bs";
import {
  FaBalanceScale,
  FaBox,
  FaCommentDots,
  FaHashtag,
  FaPlus,
  FaTags,
  FaSign,
  FaMoneyBillWave,
} from "react-icons/fa";

const BarangMasuk = ({ url }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    nama: "",
    jumlah: "",
    hargaBeli: "", // Diubah dari 'harga' ke 'hargaBeli'
    kategori: "", // Default value
    satuan: "",
    jenis: "", // Default value (uppercase)
    keterangan: "",
    tanggal: "",
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setData((prev) => ({ ...prev, tanggal: today }));
  }, []);

  // Calculate total whenever hargaBeli or jumlah changes
  const total =
    data.hargaBeli && data.jumlah
      ? (Number(data.hargaBeli) * Number(data.jumlah)).toLocaleString("id-ID")
      : "0";

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      // Pastikan semua field required terisi
      if (
        !data.nama ||
        !data.jenis ||
        !data.kategori ||
        !data.jumlah ||
        !data.satuan ||
        !data.hargaBeli
      ) {
        toast.error("Harap isi semua field yang wajib diisi!");
        return;
      }

      const calculatedTotal = Number(data.hargaBeli) * Number(data.jumlah);

      const payload = {
        nama: data.nama,
        jenis: data.jenis, // Pastikan ini terisi
        kategori: data.kategori,
        jumlah: data.jumlah,
        total: calculatedTotal,
        satuan: data.satuan,
        hargaBeli: data.hargaBeli,
        keterangan: data.keterangan || "",
        tanggal: data.tanggal,
      };

      console.log("Sending data:", payload); // Debugging

      const res = await axios.post(
        `${url}/api/bahanBaku/bahanBakuMasuk`,
        payload,
        {
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }
      );

      if (res.data.success) {
        toast.success(
          `Data berhasil ditambahkan! Kode: ${res.data.data.kodeBahan}`
        );
        // Reset form
        setData({
          nama: "",
          jumlah: "",
          hargaBeli: "",
          kategori: "",
          satuan: "",
          jenis: "",
          keterangan: "",
          tanggal: new Date().toISOString().split("T")[0],
        });
      }
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Gagal menambahkan data");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-6 text-blue-700">
        <FaSign /> Tambah Bahan / Barang Masuk
      </h2>

      <form
        onSubmit={onSubmitHandler}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Nama Barang */}
        <div>
          <label className="mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaBox /> Nama Bahan / Barang
          </label>
          <input
            type="text"
            name="nama"
            value={data.nama}
            onChange={onChangeHandler}
            placeholder="Masukkan nama barang"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Jumlah */}
        <div>
          <label className="mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaHashtag /> Jumlah
          </label>
          <input
            type="number"
            name="jumlah"
            value={data.jumlah}
            onChange={onChangeHandler}
            placeholder="Masukkan jumlah"
            min="0"
            step="0.01"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Harga Beli */}
        <div>
          <label className="mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaMoneyBillWave /> Harga Beli
          </label>
          <input
            type="number"
            name="hargaBeli" // Diubah dari 'harga' ke 'hargaBeli'
            value={data.hargaBeli}
            onChange={onChangeHandler}
            placeholder="Masukkan harga beli"
            min="0"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        {/* Total Display */}
        <div className="md:col-span-2">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">Total:</span>
              <span className="text-lg font-bold text-blue-600">
                Rp {total}
              </span>
            </div>
          </div>
        </div>

        {/* Kategori */}
        <div>
          <label className="mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaTags /> Kategori
          </label>
          <select
            name="kategori"
            value={data.kategori}
            onChange={onChangeHandler}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          >
            <option value="">-- Pilih Satuan --</option>
            <option value="BAHAN_MAKANAN">Bahan Makanan</option>
            <option value="BAHAN_KEMASAN">Bahan Kemasan</option>
            <option value="BARANG_ATK">ATK</option>
            <option value="BARANG_INVENTARIS">Inventaris</option>
          </select>
        </div>

        {/* Satuan */}
        <div>
          <label className=" mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaBalanceScale /> Satuan
          </label>
          <select
            name="satuan"
            value={data.satuan}
            onChange={onChangeHandler}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          >
            <option value="">-- Pilih Satuan --</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="gram">Gram (g)</option>
            <option value="ons">Ons (ons)</option>
            <option value="liter">Liter (L)</option>
            <option value="ml">Mililiter (mL)</option>
            <option value="meter">Meter (m)</option>
            <option value="cm">Centimeter (cm)</option>
            <option value="mm">Milimeter (mm)</option>
            <option value="pack">Pack / Pak</option>
            <option value="lusin">Lusin (12 pcs)</option>
            <option value="kodi">Kodi (20 pcs)</option>
            <option value="rim">Rim (500 lembar)</option>
            <option value="box">Box / Kotak</option>
            <option value="unit">Unit</option>
            <option value="pcs">Pcs (Pieces)</option>
            <option value="set">Set</option>
            <option value="roll">Roll / Gulung</option>
            <option value="tablet">Tablet (Obat)</option>
            <option value="botol">Botol</option>
            <option value="tube">Tube (Kosmetik / Salep)</option>
            <option value="kaleng">Kaleng</option>
            <option value="bungkus">Bungkus</option>
            <option value="tray">Tray (telur / makanan)</option>
            <option value="cup">Cup (minuman/makanan)</option>
          </select>
        </div>

        {/* Jenis */}
        <div>
          <label className="mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaTags /> Jenis
          </label>
          <select
            name="jenis"
            value={data.jenis}
            onChange={onChangeHandler}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
            required
          >
            <option value="">-- Pilih Satuan --</option>
            <option value="BAHAN">BAHAN</option>
            <option value="BARANG">BARANG</option>
          </select>
        </div>

        {/* Tanggal */}
        <div>
          <label className="mb-1 font-medium text-gray-700 flex items-center gap-2">
            <BsCalendar2CheckFill /> Tanggal
          </label>
          <input
            type="date"
            name="tanggal"
            value={data.tanggal}
            onChange={onChangeHandler}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            required
          />
        </div>

        {/* Keterangan */}
        <div className="md:col-span-2">
          <label className="mb-1 font-medium text-gray-700 flex items-center gap-2">
            <FaCommentDots /> Keterangan
          </label>
          <textarea
            name="keterangan"
            rows="3"
            value={data.keterangan}
            onChange={onChangeHandler}
            placeholder="Tulis keterangan tambahan..."
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
          ></textarea>
        </div>

        {/* Tombol Submit */}
        <div className="md:col-span-2 text-center mt-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            <FaPlus /> Tambah Barang Masuk
          </button>
        </div>
      </form>
    </div>
  );
};

export default BarangMasuk;
