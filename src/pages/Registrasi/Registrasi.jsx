import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Lock, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

function Register({ url }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [namaLengkap, setNamaLengkap] = useState("");
  const [jenisKelamin, setJenisKelamin] = useState("");
  const [noTelepon, setNoTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [foto, setFoto] = useState(null);
  const [bagian, setBagian] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("namaLengkap", namaLengkap);
      formData.append("jenisKelamin", jenisKelamin);
      formData.append("noTelepon", noTelepon);
      formData.append("alamat", alamat);
      formData.append("bagian", bagian);
      formData.append("foto", foto); // Upload foto profil

      const res = await axios.post(`${url}/api/user/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        Swal.fire({
          title: "Berhasil!",
          text: "Registrasi berhasil. Silakan login.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          localStorage.setItem("token", res.data.token);
          navigate("/login");
        });
      } else {
        Swal.fire({
          title: "Gagal!",
          text: res.data.message || "Registrasi gagal.",
          icon: "error",
          confirmButtonText: "Coba Lagi",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error!",
        text: "Terjadi kesalahan saat registrasi.",
        icon: "error",
        confirmButtonText: "Tutup",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Buat Akun</h1>
          <p className="text-gray-600">Daftarkan akun Pegawai Anda</p>
        </div>

        <input
          type="text"
          placeholder="Nama Lengkap"
          value={namaLengkap}
          minLength={10}
          maxLength={120}
          onChange={(e) => setNamaLengkap(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
          required
        />

        <input
          type="text"
          placeholder="Username"
          value={username}
          minLength={5}
          maxLength={120}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
          required
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded pr-10"
            required
          />
          <div
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Jenis Kelamin</label>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Laki-laki"
                checked={jenisKelamin === "Laki-laki"}
                onChange={(e) => setJenisKelamin(e.target.value)}
                className="mr-2"
              />
              Laki-laki
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="gender"
                value="Perempuan"
                checked={jenisKelamin === "Perempuan"}
                onChange={(e) => setJenisKelamin(e.target.value)}
                className="mr-2"
              />
              Perempuan
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Bagian</label>
          <select
            value={bagian}
            onChange={(e) => setBagian(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded"
            required
          >
            <option value="">-- Pilih Bagian --</option>
            <option value="Gudang">Gudang</option>
            <option value="Keuangan">Keuangan</option>
            <option value="Produksi">Produksi</option>
            <option value="Lainnya">Lainnya</option>
          </select>
        </div>

        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          minLength={11}
          maxLength={13}
          placeholder="No. Telepon"
          value={noTelepon}
          onChange={(e) => {
            const onlyNums = e.target.value.replace(/\D/g, "");
            setNoTelepon(onlyNums);
          }}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
          required
        />

        <textarea
          placeholder="Alamat"
          value={alamat}
          minLength={11}
          maxLength={150}
          onChange={(e) => setAlamat(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
          required
        />

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Foto Profil</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files[0])}
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Daftar
        </button>

        <p className="text-sm text-center mt-4">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
