import React, { useEffect, useState } from "react";
import {
  FaTrashAlt,
  FaInbox,
  FaEdit,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Tambahan
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const formatTanggal = (tanggal) => {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

function LaporanKeuangan({ url }) {
  const [pemasukan, setPemasukan] = useState([]);
  const [pengeluaran, setPengeluaran] = useState([]);
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
    const [bahanBaku, setBahanBaku] = useState([]); // Tambahan

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPemasukan = async () => {
      try {
        const res = await fetch(`${url}/api/checkout/daftarCheckout`);
        const data = await res.json();
        if (data.success) setPemasukan(data.data);
      } catch (err) {
        console.error("Gagal fetch pemasukan:", err);
      }
    };
    fetchPemasukan();
  }, [url]);

  useEffect(() => {
    const fetchPengeluaran = async () => {
      try {
        const res = await fetch(`${url}/api/pengeluaran/daftarPengeluaran`);
        const data = await res.json();
        if (data.success) setPengeluaran(data.data);
      } catch (err) {
        console.error("Gagal fetch pengeluaran:", err);
      }
    };
    fetchPengeluaran();
  }, [url]);

    useEffect(() => {
    const fetchBahanBaku = async () => {
      try {
        const res = await axios.get(`${url}/api/bahanBaku/daftarBahanBaku`);
        if (res.data.success) {
          setBahanBaku(res.data.data);
        }
      } catch (err) {
        console.error("Gagal fetch bahan baku:", err);
      }
    };
    fetchBahanBaku();
  }, [url]);

  const filterByMonthYear = (data) => {
    return data.filter((item) => {
      const date = new Date(item.createdAt || item.tanggal);
      const matchesMonth = bulan
        ? date.getMonth() + 1 === parseInt(bulan)
        : true;
      const matchesYear = tahun ? date.getFullYear() === parseInt(tahun) : true;
      return matchesMonth && matchesYear;
    });
  };

  const filteredPemasukan = filterByMonthYear(pemasukan);
  const filteredPengeluaran = filterByMonthYear(pengeluaran);
    const filteredBahanBaku = filterByMonthYear(bahanBaku); // Tambahan


  const displayedPemasukan = filteredPemasukan.slice(0, 5);
  const displayedPengeluaran = filteredPengeluaran.slice(0, 5);

  const totalPemasukan = filteredPemasukan.reduce(
    (acc, item) => acc + item.total,
    0
  );

  const totalPengeluaranToko = filteredPengeluaran.reduce(
    (acc, item) => acc + Number(item.jumlah || 0),
    0
  );

  const totalBahanBarang = filteredBahanBaku.reduce((sum, item) => {
    const harga = Number(item.hargaBeli) || 0;
    const jumlah = Number(item.jumlah) || 0;
    return sum + harga * jumlah;
  }, 0)
  
  
  const totalKeseluruhan = totalPengeluaranToko + totalBahanBarang; // Perhitungan baru

  const hasil = totalPemasukan - totalKeseluruhan;

  const pemasukanTertinggi = filteredPemasukan.reduce(
    (max, item) => (item.total > (max?.total || 0) ? item : max),
    null
  );
  const pengeluaranTertinggi = filteredPengeluaran.reduce(
    (max, item) => (item.jumlah > (max?.jumlah || 0) ? item : max),
    null
  );

  const groupByMonth = (data, type) => {
  const result = {};
  data.forEach(item => {
    const date = new Date(item.createdAt || item.tanggal);
    const monthYear = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`;
    const amount = type === 'pemasukan' ? Number(item.total) || 0 : Number(item.jumlah) || 0;
    result[monthYear] = (result[monthYear] || 0) + amount;
  });
  return result;
};

const pemasukanBulanan = groupByMonth(filteredPemasukan, 'pemasukan');
const pengeluaranBulanan = groupByMonth(filteredPengeluaran, 'pengeluaran');

// Gabungkan menjadi array untuk chart
const chartData = Array.from(new Set([...Object.keys(pemasukanBulanan), ...Object.keys(pengeluaranBulanan)]))
  .sort()
  .map(key => ({
    bulan: key,
    pemasukan: pemasukanBulanan[key] || 0,
    pengeluaran: pengeluaranBulanan[key] || 0,
  }));


  return (
    <div className="p-6 space-y-10">
      <div className="flex gap-4 items-center">
        <select
          value={bulan}
          onChange={(e) => setBulan(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Semua Bulan</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
            </option>
          ))}
        </select>
        <select
          value={tahun}
          onChange={(e) => setTahun(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Semua Tahun</option>
          {[2023, 2024, 2025].map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-500">Total Pemasukan</p>
          <h2 className="text-xl font-bold text-green-600">
            Rp {totalPemasukan.toLocaleString("id-ID")}
          </h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <p className="text-gray-500">Total Pengeluaran</p>
          <h2 className="text-xl font-bold text-red-600">
            Rp {totalKeseluruhan.toLocaleString("id-ID")}
          </h2>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-500">Hasil</p>
          <h2
            className={`text-xl font-bold ${
              hasil >= 0 ? "text-blue-600" : "text-red-600"
            }`}
          >
            Rp {hasil.toLocaleString("id-ID")}
          </h2>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg shadow border-l-4 border-yellow-500">
          <p className="text-gray-500">Pemasukan Tertinggi</p>
          <h2 className="text-md font-bold text-yellow-600">
            {pemasukanTertinggi
              ? `Rp ${pemasukanTertinggi.total.toLocaleString("id-ID")}`
              : "-"}
          </h2>
        </div>
        <div className="bg-pink-50 p-4 rounded-lg shadow border-l-4 border-pink-500">
          <p className="text-gray-500">Pengeluaran Tertinggi</p>
          <h2 className="text-md font-bold text-pink-600">
            {pengeluaranTertinggi
              ? `Rp ${pengeluaranTertinggi.jumlah.toLocaleString("id-ID")}`
              : "-"}
          </h2>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
  <h3 className="text-lg font-semibold mb-4">Kurva Pemasukan vs Pengeluaran</h3>
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="bulan" />
      <YAxis />
      <Tooltip formatter={(value) => `Rp ${Number(value).toLocaleString("id-ID")}`} />
      <Legend />
      <Line type="monotone" dataKey="pemasukan" stroke="#16a34a" strokeWidth={2} />
      <Line type="monotone" dataKey="pengeluaran" stroke="#dc2626" strokeWidth={2} />
    </LineChart>
  </ResponsiveContainer>
</div>


      {/* Tabel Pemasukan dan Pengeluaran dapat dilanjutkan di bawah seperti pada kode Anda sebelumnya */}

      {/* Tabel Pemasukan */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-green-300 text-green-800">
              {[
                "No",
                "Tanggal",
                "Metode",
                "Gender",
                "Diskon",
                "Jumlah Item",
                "Produk",
                "Total",
                "Aksi",
              ].map((title) => (
                <th key={title} className="px-5 py-3 text-center font-semibold">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedPemasukan.length > 0 ? (
              displayedPemasukan.map((data, idx) => (
                <tr key={data._id} className="border-b hover:bg-blue-50">
                  <td className="px-5 py-3 text-center">{idx + 1}</td>
                  <td className="px-5 py-3 text-center">
                    {new Date(data.createdAt).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {data.paymentMethod}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {data.customerGender || "-"}
                  </td>
                  <td className="px-5 py-3 text-center">
                    {data.discountPercent}%
                  </td>
                  <td className="px-5 py-3 text-center">
                    {data.cartItems.reduce(
                      (acc, item) => acc + item.quantity,
                      0
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <ul className="list-disc list-inside text-left">
                      {data.cartItems.map((item, i) => (
                        <li key={i}>
                          {item.namaProduk} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-5 py-3 text-green-600 font-semibold text-center">
                    Rp {data.total.toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <button
                      onClick={() => handleDeletePemasukan(data._id)}
                      className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-10">
                  <div className="text-gray-500 flex flex-col items-center">
                    <FaInbox size={40} className="mb-3" />
                    Tidak ada data pemasukan ditemukan.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {filteredPemasukan.length > 5 && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/daftarPemasukan")}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Lihat Detail Pemasukan
            </button>
          </div>
        )}
      </div>

      {/* Tabel Pengeluaran */}
      <div className="overflow-x-auto rounded-xl shadow">
        <table className="min-w-full text-sm text-gray-700">
          <thead>
            <tr className="bg-red-100 text-red-800">
              {[
                "No",
                "Nama",
                "Jumlah",
                "Jenis",
                "Tanggal",
                "Keterangan",
                "Aksi",
              ].map((title) => (
                <th
                  key={title}
                  className="px-5 py-3 text-center font-semibold text-base"
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedPengeluaran.length > 0 ? (
              displayedPengeluaran.map((item, idx) => (
                <tr key={item._id} className="border-b hover:bg-red-50">
                  <td className="px-5 py-3 text-center">{idx + 1}</td>
                  <td className="px-5 py-3 text-center">
                    {item.namaPengeluaran}
                  </td>
                  <td className="px-5 py-3 text-center">
                    Rp {Number(item.jumlah).toLocaleString("id-ID")}
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="bg-red-200 text-red-800 text-xs font-semibold px-3 py-1 rounded-full">
                      {item.jenisPengeluaran}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {formatTanggal(item.tanggal)}
                  </td>
                  <td className="px-5 py-3 text-center">{item.keterangan}</td>
                  <td className="px-5 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => editPengeluaran(item._id)}
                        className="p-2 bg-yellow-400 text-white rounded-full hover:bg-yellow-500"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeletePengeluaran(item._id)}
                        className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-10">
                  <div className="text-gray-500 flex flex-col items-center">
                    <FaInbox size={40} className="mb-3" />
                    Tidak ada data pengeluaran ditemukan.
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {filteredPengeluaran.length > 5 && (
          <div className="text-center mt-4">
            <button
              onClick={() => navigate("/daftarPengeluaran")}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Lihat Detail Pengeluaran
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LaporanKeuangan;
