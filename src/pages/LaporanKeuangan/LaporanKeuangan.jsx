import React, { useEffect, useState } from "react";
import {
  FaTrashAlt,
  FaInbox,
  FaEdit,
  FaChevronDown,
  FaChevronUp,
  FaFilter,
  FaFileExport,
  FaMoneyBillWave,
  FaCreditCard,
  FaChartLine,
  FaReceipt,
  FaShoppingCart
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell } from "recharts";

const formatTanggal = (tanggal) => {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// Warna untuk chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

// Data untuk piutang berdasarkan umur
const piutangData = [
  { range: "1-15 Hari", amount: 11029, color: "#4f46e5" },
  { range: "16-30 Hari", amount: 7623, color: "#6366f1" },
  { range: "31-45 Hari", amount: 5483, color: "#818cf8" },
  { range: "46+ Hari", amount: 4537, color: "#a5b4fc" },
];

function LaporanKeuangan({ url }) {
  const [pemasukan, setPemasukan] = useState([]);
  const [pengeluaran, setPengeluaran] = useState([]);
  const [bahanBaku, setBahanBaku] = useState([]);
  const [bulan, setBulan] = useState("");
  const [tahun, setTahun] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
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
  const filteredBahanBaku = filterByMonthYear(bahanBaku);

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
  }, 0);
  
  const totalKeseluruhan = totalPengeluaranToko + totalBahanBarang;
  const hasil = totalPemasukan - totalKeseluruhan;

  // Fungsi untuk mengelompokkan data berdasarkan bulan
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

  // Fungsi untuk mengelompokkan pengeluaran bulanan (termasuk bahan baku)
  const groupPengeluaranBulanan = () => {
    const result = {};

    // Tambahkan pengeluaran biasa
    filteredPengeluaran.forEach(item => {
      const date = new Date(item.createdAt || item.tanggal);
      const monthYear = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`;
      result[monthYear] = (result[monthYear] || 0) + (Number(item.jumlah) || 0);
    });

    // Tambahkan pengeluaran bahan baku
    filteredBahanBaku.forEach(item => {
      const date = new Date(item.createdAt || item.tanggal);
      const monthYear = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}`;
      const nilai = (Number(item.hargaBeli) || 0) * (Number(item.jumlah) || 0);
      result[monthYear] = (result[monthYear] || 0) + nilai;
    });

    return result;
  };

  // Data untuk chart
  const pemasukanBulanan = groupByMonth(filteredPemasukan, 'pemasukan');
  const pengeluaranBulanan = groupPengeluaranBulanan();

  const chartData = Array.from(
    new Set([...Object.keys(pemasukanBulanan), ...Object.keys(pengeluaranBulanan)])
  )
    .sort()
    .map(key => ({
      bulan: key,
      pemasukan: pemasukanBulanan[key] || 0,
      pengeluaran: pengeluaranBulanan[key] || 0,
    }));

  // Data untuk pie chart (kategori pengeluaran)
  const kategoriPengeluaranData = [
    { name: 'Bahan Dan Barang', value: totalBahanBarang },
    { name: 'Air', value: totalPengeluaranToko},
    { name: 'Listrik', value: totalPengeluaranToko},

  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center">
              <FaChartLine className="mr-3 text-blue-600" /> Laporan Keuangan
            </h1>
            <p className="text-gray-500 mt-1">Analisis lengkap keuangan bisnis Anda</p>
          </div>
          <div className="flex items-center space-x-4">
            <button 
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 shadow-sm transition-all"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" /> Filter {showFilters ? <FaChevronUp className="ml-1" /> : <FaChevronDown className="ml-1" />}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <FaFilter className="mr-2" /> Filter Laporan
            </h3>
            <div className="flex gap-4 items-center">
              <div className="flex flex-col">
                <label className="text-sm text-blue-700 mb-1">Bulan</label>
                <select
                  value={bulan}
                  onChange={(e) => setBulan(e.target.value)}
                  className="border border-blue-200 p-2 rounded-lg w-40 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua Bulan</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("id-ID", { month: "long" })}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <label className="text-sm text-blue-700 mb-1">Tahun</label>
                <select
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  className="border border-blue-200 p-2 rounded-lg w-40 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Semua Tahun</option>
                  {[2023, 2024, 2025].map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-6 border border-gray-100">
        <div className="flex border-b">
          <button
            className={`py-3 px-6 font-medium flex items-center ${activeTab === "overview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"}`}
            onClick={() => setActiveTab("overview")}
          >
            <FaChartLine className="mr-2" /> Ringkasan
          </button>
          <button
            className={`py-3 px-6 font-medium flex items-center ${activeTab === "details" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 hover:text-blue-500"}`}
            onClick={() => setActiveTab("details")}
          >
            <FaReceipt className="mr-2" /> Detail Transaksi
          </button>
        </div>
      </div>

      {/* Ringkasan Keuangan */}
      {activeTab === "overview" && (
        <>
          {/* Kartu Total */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-semibold">Total Pemasukan</p>
                  <h2 className="text-2xl font-bold text-green-800 mt-1">
                    Rp {totalPemasukan.toLocaleString("id-ID")}
                  </h2>
                </div>
                <div className="bg-green-500 p-3 rounded-full">
                  <FaMoneyBillWave className="text-white text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-green-200">
                <p className="text-green-600 text-xs flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                  {filteredPemasukan.length} transaksi
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl shadow-lg border-l-4 border-red-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-700 text-sm font-semibold">Total Pengeluaran</p>
                  <h2 className="text-2xl font-bold text-red-800 mt-1">
                    Rp {totalKeseluruhan.toLocaleString("id-ID")}
                  </h2>
                </div>
                <div className="bg-red-500 p-3 rounded-full">
                  <FaShoppingCart className="text-white text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-red-200">
                <p className="text-red-600 text-xs flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-2"></span>
                  {filteredPengeluaran.length} transaksi
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-700 text-sm font-semibold">Hasil</p>
                  <h2 className={`text-2xl font-bold ${hasil >= 0 ? "text-blue-800" : "text-red-800"} mt-1`}>
                    Rp {Math.abs(hasil).toLocaleString("id-ID")}
                  </h2>
                  <p className="text-xs mt-1 font-semibold">{hasil >= 0 ? "💹 Laba" : "🔻 Rugi"}</p>
                </div>
                <div className={`p-3 rounded-full ${hasil >= 0 ? "bg-blue-500" : "bg-red-500"}`}>
                  <FaCreditCard className="text-white text-xl" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-blue-200">
                <p className="text-blue-600 text-xs">
                  {hasil >= 0 ? "✅ Performa positif" : "⚠️ Perlu evaluasi"}
                </p>
              </div>
            </div>
          </div>

          {/* Grafik Area dan Pie Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

                        {/* Grafik Perbandingan */}
            <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-100 lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <FaChartLine className="mr-2 text-blue-600" /> Perbandingan Bulanan
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                  <XAxis 
                    dataKey="bulan" 
                    tickFormatter={(value) => {
                      const [year, month] = value.split('-');
                      return `${new Date(year, month-1).toLocaleString('id-ID', { month: 'short' })}`;
                    }}
                  />
                  <YAxis tickFormatter={(value) => `Rp${(value/1000000).toFixed(0)}Jt`} />
                  <Tooltip 
                    formatter={(value) => [`Rp ${Number(value).toLocaleString("id-ID")}`, ""]}
                    labelFormatter={(label) => {
                      const [year, month] = label.split('-');
                      return `${new Date(year, month-1).toLocaleString('id-ID', { month: 'long' })} ${year}`;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="pemasukan" name="Pemasukan" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#dc2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pie Chart Kategori Pengeluaran */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 lg:col-span-1">
              <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                <FaShoppingCart className="mr-2 text-red-600" /> Kategori Pengeluaran
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={kategoriPengeluaranData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {kategoriPengeluaranData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`Rp ${Number(value).toLocaleString("id-ID")}`, ""]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

        </>
      )}

      {/* Detail Transaksi */}
      {activeTab === "details" && (
        <div className="space-y-6">
          {/* Tabel Pemasukan */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-4 border-b bg-gradient-to-r from-green-50 to-green-100">
              <h3 className="text-lg font-semibold text-green-800 flex items-center">
                <FaMoneyBillWave className="mr-2" /> Pemasukan
              </h3>
              <span className="text-sm text-green-600 bg-green-200 px-2 py-1 rounded-full">
                {filteredPemasukan.length} transaksi
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-green-50">
                  <tr>
                    {["Tanggal", "Metode", "Diskon", "Jumlah Item", "Total"].map((title) => (
                      <th key={title} className="px-6 py-3 text-left text-xs font-medium text-green-700 uppercase tracking-wider">
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-green-100">
                  {displayedPemasukan.length > 0 ? (
                    displayedPemasukan.map((data, idx) => (
                      <tr key={data._id} className="hover:bg-green-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(data.createdAt).toLocaleDateString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                            {data.paymentMethod}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                            {data.discountPercent}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
                            {data.cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-green-600">
                          Rp {data.total.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <FaInbox size={32} className="mb-2 text-gray-400" />
                          Tidak ada data pemasukan ditemukan.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredPemasukan.length > 5 && (
              <div className="p-4 border-t bg-green-50 text-right">
                <button
                  onClick={() => navigate("/daftarPemasukan")}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition-colors shadow-md"
                >
                  Lihat Semua Pemasukan
                </button>
              </div>
            )}
          </div>

          {/* Tabel Pengeluaran */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="p-4 border-b bg-gradient-to-r from-red-50 to-red-100">
              <h3 className="text-lg font-semibold text-red-800 flex items-center">
                <FaShoppingCart className="mr-2" /> Pengeluaran
              </h3>
              <span className="text-sm text-red-600 bg-red-200 px-2 py-1 rounded-full">
                {filteredPengeluaran.length} transaksi
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-red-50">
                  <tr>
                    {["Tanggal", "Nama", "Jumlah", "Jenis", "Keterangan"].map((title) => (
                      <th key={title} className="px-6 py-3 text-left text-xs font-medium text-red-700 uppercase tracking-wider">
                        {title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {displayedPengeluaran.length > 0 ? (
                    displayedPengeluaran.map((item, idx) => (
                      <tr key={item._id} className="hover:bg-red-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {formatTanggal(item.tanggal)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {item.nama}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-semibold text-red-600">
                          Rp {Number(item.jumlah).toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">
                            {item.jenisPengeluaran}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {item.keterangan || "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <FaInbox size={32} className="mb-2 text-gray-400" />
                          Tidak ada data pengeluaran ditemukan.
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredPengeluaran.length > 5 && (
              <div className="p-4 border-t bg-red-50 text-right">
                <button
                  onClick={() => navigate("/daftarPengeluaran")}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm transition-colors shadow-md"
                >
                  Lihat Semua Pengeluaran
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LaporanKeuangan;