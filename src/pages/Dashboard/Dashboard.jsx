import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Package2,
  Bell,
  Settings,
  TrendingUp,
  AlertTriangle,
  ShoppingCart,
  BarChart3,
  Users,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import LaporanKeuangan from "../LaporanKeuangan/LaporanKeuangan";

const Dashboard = ({ url }) => {
  const [activeTab, setActiveTab] = useState("Ringkasan");
  const [search, setSearch] = useState("");
  const [filterMetode, setFilterMetode] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pemasukan, setPemasukan] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [items, setItems] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [genderData, setGenderData] = useState([]);
  const navigate = useNavigate();
  const [jumlahMember, setJumlahMember] = useState(0);

  const totalProduk = items.filter((item) => item.namaProduk).length;
  const totalBahan = items.filter((item) => item.namaBarang).length;

  const fetchJumlahMember = async () => {
  try {
    const res = await fetch(`${url}/api/pelanggan/daftar`);
    const data = await res.json();
    if (data.success) {
      setJumlahMember(data.data.length);
    }
  } catch (error) {
    console.error("Gagal mengambil jumlah member", error);
  }
};

  const fetchCheckoutData = async () => {
    try {
      const res = await axios.get(`${url}/api/checkout/daftarCheckout`);
      if (res.data.success) {
        const allData = res.data.data;

        const filteredData = allData.filter((item) => {
          const tanggal = new Date(item.waktuTransaksi);
          // console.log("Transaksi:", item.waktuTransaksi, "| Tanggal:", tanggal);

          const matchMonth =
            selectedMonth === "" ||
            tanggal.getMonth() + 1 === Number(selectedMonth);
          const matchYear =
            selectedYear === "" ||
            tanggal.getFullYear() === Number(selectedYear);
          return matchMonth && matchYear;
        });
        setPemasukan(filteredData);
        setFiltered(filteredData);
      }
    } catch (err) {
      console.error("Gagal ambil data checkout", err);
      toast.error("Gagal ambil data checkout!");
    }
  };

  const fetchList = async () => {
    try {
      const [foodRes, bahanRes] = await Promise.all([
        axios.get(`${url}/api/food/list`),
        axios.get(`${url}/api/bahanBaku/daftarBahanBaku`),
      ]);

      if (foodRes.data.success && bahanRes.data.success) {
        const combined = [...foodRes.data.data, ...bahanRes.data.data];
        const sorted = combined.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setRecentlyAdded(sorted.slice(0, 5));
        setItems(combined);

        const lowStock = combined
          .filter((i) => i.jumlah < 10)
          .map((i) => {
            const isProduk = !!i.namaProduk;
            const isBarang = !!i.namaBarang;
            return {
              id: i._id,
              type: isProduk ? "produk" : isBarang ? "bahan_baku" : "lainnya",
              message: isProduk
                ? `Stok produk \"${i.namaProduk}\" tersisa ${i.jumlah}`
                : isBarang
                ? `Stok bahan baku \"${i.namaBarang}\" tersisa ${i.jumlah}`
                : `Stok item tidak dikenal tersisa ${i.jumlah}`,
              time: new Date().toLocaleString("id-ID"),
            };
          });

        setNotifications(lowStock);
      }
    } catch (err) {
      toast.error("Gagal mengambil data makanan/bahan baku");
    }
  };

const filterData = useCallback(() => {
  let data = [...pemasukan];

  if (search.trim()) {
    data = data.filter((item) =>
      item.cartItems.some((ci) =>
        ci.namaProduk.toLowerCase().includes(search.toLowerCase())
      )
    );
  }

  if (startDate) {
    data = data.filter(
      (item) => new Date(item.createdAt) >= new Date(startDate)
    );
  }

  if (endDate) {
    data = data.filter(
      (item) => new Date(item.createdAt) <= new Date(endDate)
    );
  }

  if (filterMetode) {
    data = data.filter((item) => item.paymentMethod === filterMetode);
  }

  // 🔥 Tambahkan filter berdasarkan bulan dan tahun
  if (selectedMonth || selectedYear) {
    data = data.filter((item) => {
      const tanggal = new Date(item.waktuTransaksi);
      const matchMonth =
        selectedMonth === "" ||
        tanggal.getMonth() + 1 === Number(selectedMonth);
      const matchYear =
        selectedYear === "" ||
        tanggal.getFullYear() === Number(selectedYear);
      return matchMonth && matchYear;
    });
  }

  setFiltered(data);
}, [search, startDate, endDate, filterMetode, selectedMonth, selectedYear, pemasukan]);


  useEffect(() => {
    fetchList();
      fetchJumlahMember(); 
  }, []);

  useEffect(() => {
    fetchCheckoutData();
  }, [selectedMonth, selectedYear]);

  useEffect(() => {
    filterData();
  }, [filterData]);

  useEffect(() => {
    // Hitung ulang data saat `filtered` berubah
    const genderMap = { Pria: 0, Wanita: 0 };
    const produkMap = {};

    filtered.forEach((item) => {
      if (item.customerGender) {
        genderMap[item.customerGender] =
          (genderMap[item.customerGender] || 0) + 1;
      }

      item.cartItems.forEach((produk) => {
        produkMap[produk.namaProduk] =
          (produkMap[produk.namaProduk] || 0) + produk.quantity;
      });
    });

    const genderDataFinal = Object.entries(genderMap).map(([name, value]) => ({
      name,
      value,
    }));
    const topProductsFinal = Object.entries(produkMap).map(
      ([name, quantity]) => ({
        name,
        quantity,
      })
    );

    setGenderData(genderDataFinal);
    setTopProducts(topProductsFinal);
    // console.log("Filtered data", filtered);
  }, [filtered]);

  const handleNotificationClick = (notification) => {
    if (notification.type === "produk") {
      navigate(`/list/edit/${notification.id}`);
    } else if (notification.type === "bahan_baku") {
      navigate(`/daftarBaku/edit/${notification.id}`);
    } else {
      toast.info("Tidak ada halaman tujuan untuk notifikasi ini.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
                <Package2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Inventory Management
                </h1>
                <p className="text-gray-500 text-sm">
                  Dashboard manajemen inventori terpadu
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Bell
                  className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors"
                  onClick={() => setActiveTab("Notifikasi")}
                />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="px-6 py-4">
        <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-2xl border border-white/20">
          {[
            { id: "Ringkasan", label: "Ringkasan", icon: BarChart3 },
            {
              id: "LaporanKeuangan",
              label: "Laporan Keuangan",
              icon: TrendingUp,
            },
            { id: "Notifikasi", label: "Notifikasi", icon: Bell },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105"
                  : "text-gray-600 hover:text-blue-600 hover:bg-white/50"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 pb-6">
        {activeTab === "Ringkasan" && (
          <div className="space-y-10">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Total Produk",
                  value: totalProduk.toLocaleString(),
                  icon: Package2,
                  color: "from-blue-500 to-blue-600",
                },
                {
                  title: "Total Bahan",
                  value: totalBahan.toLocaleString(),
                  icon: ShoppingCart,
                  color: "from-pink-500 to-pink-600",
                },
                {
  title: "Total Member",
  value: jumlahMember.toLocaleString(),
  icon: Users, // ← butuh icon
  color: "from-green-500 to-green-600",
}

              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm font-medium">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-extrabold text-gray-900 mt-1">
                        {stat.value}
                      </p>
                    </div>
                    <div
                      className={`bg-gradient-to-r ${stat.color} p-4 rounded-2xl shadow-lg`}
                    >
                      <stat.icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Section */}
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
              {/* <div>
                <label className="block text-sm font-semibold mb-1">
                  Pilih Bulan:
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="border rounded px-4 py-2"
                >
                  <option value="">Semua Bulan</option>
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i + 1}>
                      {new Date(0, i).toLocaleString("id-ID", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">
                  Pilih Tahun:
                </label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="border rounded px-4 py-2"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>
              </div> */}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Diagram Gender */}
              <div className="bg-white p-6 shadow-xl rounded-3xl">
                <h2 className="text-xl font-bold mb-4 text-blue-700">
                  Diagram Pembelian Berdasarkan Gender
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  {genderData.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 italic">
                      Data tidak tersedia
                    </div>
                  ) : (
                    <PieChart>
                      <Pie
                        data={genderData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                        labelLine={false}
                      >
                        {genderData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={["#3490dc", "#f66d9b", "#a0aec0"][index]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Chart Produk Terlaris */}
              <div className="bg-white p-6 shadow-xl rounded-3xl">
                <h2 className="text-xl font-bold mb-4 text-blue-700">
                  Produk Paling Banyak Dibeli
                </h2>
                <ResponsiveContainer width="100%" height={320}>
                  {topProducts.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500 italic">
                      Data tidak tersedia
                    </div>
                  ) : (
                    <BarChart
                      data={topProducts.slice(0, 5)} // 👈 hanya ambil 5 data teratas
                      margin={{ top: 20, right: 30, left: 10, bottom: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 12 }}
                        angle={-15}
                        textAnchor="end"
                        interval={0}
                        height={60}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 12 }}
                        label={{
                          value: "Jumlah Dibeli",
                          angle: -90,
                          position: "insideLeft",
                          offset: 10,
                          style: { textAnchor: "middle" },
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#f0f9ff",
                          borderColor: "#38bdf8",
                        }}
                        formatter={(value) => [`${value}x`, "Jumlah Beli"]}
                      />
                      <Legend verticalAlign="top" height={36} />
                      <Bar
                        dataKey="quantity"
                        name="Jumlah Beli"
                        fill="#38bdf8"
                        radius={[6, 6, 0, 0]}
                        barSize={40}
                      />
                    </BarChart>
                  )}
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === "LaporanKeuangan" && <LaporanKeuangan url={url} />}

        {activeTab === "Notifikasi" && (
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notifikasi & Peringatan
              </h3>
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 rounded-2xl border-l-4 cursor-pointer hover:shadow-md transition ${
                      notification.type === "critical"
                        ? "bg-red-50 border-red-500"
                        : notification.type === "warning"
                        ? "bg-yellow-50 border-yellow-500"
                        : "bg-red-50 border-red-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-lg ${
                            notification.type === "critical"
                              ? "bg-red-100 text-red-600"
                              : notification.type === "warning"
                              ? "bg-yellow-100 text-yellow-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          <AlertTriangle className="w-5 h-5" />
                        </div>

                        <div>
                          <p className="font-medium text-gray-900">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
