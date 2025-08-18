import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaBox,
  FaCamera,
  FaCommentDots,
  FaMoneyBillWave,
  FaStopCircle,
  FaSave,
  FaTimes,
  FaTags
} from "react-icons/fa";

const Edit = ({ url }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    name: "",
    keterangan: "",
    jumlah: "",
    kategori: "",
    harga: "",
    hpp: "",
  });

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const response = await axios.get(`${url}/api/food/edit/${id}`);
        if (response.data.success) {
          setData({
            name: response.data.data.namaProduk,
            keterangan: response.data.data.keterangan,
            jumlah: response.data.data.jumlah,
            harga: response.data.data.harga,
            kategori: response.data.data.kategori,
            hpp: response.data.data.hpp,
            image: response.data.data.image,
          });
        } else {
          toast.error("Food not found");
        }
      } catch (error) {
        toast.error("Error fetching food details");
      }
    };
    fetchFood();
  }, [id]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", id);
    formData.append("namaProduk", data.name);
    formData.append("kategori", data.kategori);
    formData.append("keterangan", data.keterangan);
    formData.append("harga", Number(data.harga));
    formData.append("jumlah", Number(data.jumlah));
    formData.append("hpp", Number(data.hpp));
    if (image) formData.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/edit`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        toast.success("Product updated successfully!");
        setTimeout(() => navigate("/list"), 1000);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error updating product");
    }
  };

  const formatRupiah = (angka) => {
    if (!angka) return "";
    const numberString = angka.toString().replace(/[^,\d]/g, "");
    const split = numberString.split(",");
    const sisa = split[0].length % 3;
    let rupiah = split[0].substr(0, sisa);
    const ribuan = split[0].substr(sisa).match(/\d{3}/g);
    if (ribuan) {
      const separator = sisa ? "." : "";
      rupiah += separator + ribuan.join(".");
    }
    rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
    return "Rp " + rupiah;
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <i className="fas fa-edit"></i> Edit Data Produk
      </h2>
      <form
        onSubmit={onSubmitHandler}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {/* Upload Gambar (Full Width) */}
        <div className="md:col-span-2">
          <label className="font-medium mb-1 flex items-center gap-2 text-purple-600">
            <FaCamera className="text-purple-600" /> Upload Gambar
          </label>
          <label htmlFor="image" className="cursor-pointer block w-40 h-40">
            <img
              src={
                image
                  ? URL.createObjectURL(image)
                  : `${url}/images/${data.image}`
              }
              alt="preview"
              className="object-cover w-full h-full border rounded"
            />
          </label>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
          />
        </div>

        {/* Nama Produk */}
        <div>
          <label className="font-medium mb-1 flex items-center gap-2 text-blue-600">
            <FaBox className="text-blue-600" /> Nama Produk
          </label>
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={onChangeHandler}
            placeholder="Ketik nama produk"
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Jumlah */}
        <div>
          <label className="font-medium mb-1 flex items-center gap-2 text-pink-600">
            <FaStopCircle className="text-pink-600" /> Jumlah
          </label>
          <input
            type="number"
            name="jumlah"
            value={data.jumlah}
            onChange={onChangeHandler}
            placeholder="Masukkan jumlah"
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* HPP */}
        <div>
          <label className="font-medium mb-1 flex items-center gap-2 text-teal-600">
            <FaMoneyBillWave className="text-teal-600" /> HPP
          </label>
          <input
            type="text"
            name="hpp"
            placeholder="Contoh: Rp 20.000"
            value={formatRupiah(data.hpp)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "");
              setData((prevData) => ({ ...prevData, hpp: rawValue }));
            }}
            required
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Harga */}
        <div>
          <label className="font-medium mb-1 flex items-center gap-2 text-orange-600">
            <FaMoneyBillWave className="text-orange-600" /> Harga
          </label>
          <input
            type="text"
            name="harga"
            placeholder="Contoh: Rp 20.000"
            value={formatRupiah(data.harga)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Keterangan (Full Width) */}
        <div className="md:col-span-2">
          <label className="font-medium mb-1 flex items-center gap-2 text-indigo-600">
            <FaCommentDots className="text-indigo-600" /> Deskripsi
          </label>
          <textarea
            name="keterangan"
            rows="4"
            placeholder="Tuliskan deskripsi produk"
            value={data.keterangan}
            onChange={onChangeHandler}
            className="w-full px-3 py-2 border rounded"
          ></textarea>
        </div>

        {/* Kategori */}
        <div>
          <label className="block font-semibold text-gray-700 mb-1">
            <FaTags className="inline mr-2 text-purple-500" />
            Kategori Produk
          </label>
          <select
            name="kategori"
            value={data.kategori}
            onChange={onChangeHandler}
            className="w-full px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring focus:ring-purple-300"
            required
          >
            <option value="">-- Pilih Jenis --</option>
            <option value="Hampers">Hampers</option>
            <option value="Frozen">Frozen</option>
            <option value="Paket Mini Frozen">Paket Mini Frozen</option>
            <option value="Paket Matang">Paket Matang</option>
            <option value="Hampers Neela Klappertart">
              Hampers Neela Klappertart
            </option>
          </select>
        </div>

        {/* Tombol Aksi (Full Width) */}
        <div className="md:col-span-2 flex gap-4 mt-6">
          <button
            type="submit"
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          >
            <FaSave /> Simpan Perubahan
          </button>
          <button
            type="button"
            onClick={() => navigate("/list")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            <FaTimes /> Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit;
