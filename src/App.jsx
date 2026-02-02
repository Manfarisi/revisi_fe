import React from "react";
import { ToastContainer } from "react-toastify";
import { Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/navbar/Navbar";
import Sidebar from "./components/sidebar/Sidebar";
import EditBahanBaku from "./pages/BahanBakuEdit/EditBahanBaku";
import DaftarBaku from "./pages/BahanDaftar/DaftarBaku";
import EditBahanKeluar from "./pages/BahanKeluarEdit/EditBahanKeluar";
import Dashboard from "./pages/Dashboard/Dashboard";
import KeluarBarang from "./pages/Keluar/KeluarBarang";
import DaftarKeluar from "./pages/KeluarDaftar/DaftarKeluar";
import BarangMasuk from "./pages/Masuk/BarangMasuk";
import DaftarPemasukan from "./pages/PemasukanDaftar/DaftarPemasukan";
import EditPemasukan from "./pages/PemasukanEdit/EditPemasukan";
import Pengeluaran from "./pages/Pengeluaran/Pengeluaran";
import DaftarPengeluaran from "./pages/PengeluaranDaftar/DaftarPengeluaran";
import EditPengeluaran from "./pages/PengeluaranEdit/EditPengeluaran";
import List from "./pages/ProdukDaftar/List";
import Edit from "./pages/ProdukEdit/EditFood";
import Add from "./pages/TambahProduk/Add";
import LaporanKeuangan from "./pages/LaporanKeuangan/LaporanKeuangan";
import ProdukKeluar from "./pages/TambahProdukKeluar/TambahProdukKeluar";
import EditProdukKeluar from "./pages/ProdukKeluarEdit/EditProdukKeluar";
import Display from "./pages/Kasir/Display";
import Login from "./pages/Login/Login";
import Register from "./pages/Registrasi/Registrasi";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import DaftarPelanggan from "./pages/Pelanggan/Pelanggan";
import ManajemenUser from "./pages/ManajemenUser/ManajemenUser";
import TransaksiBahanBarang from "./pages/TransaksiBahanBarang/TransaksiBahanBarang";
import CompanyProfile from "./pages/CompanyProfile/CompanyProfile";

const App = () => {
  //  const url = import.meta.env.VITE_API_URL.replace(/\/$/, "");
   const url = "http://localhost:4000"
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 bg-gray-100">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login url={url} />} />
            <Route path="/register" element={<Register url={url} />} />

            {/* Protected Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard url={url} />
                </ProtectedRoute>
              }
            />
             <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <CompanyProfile url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kasir"
              element={
                <ProtectedRoute>
                  <Display url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftarPelanggan"
              element={
                <ProtectedRoute>
                  <DaftarPelanggan url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/manajemenUser"
              element={
                <ProtectedRoute>
                  <ManajemenUser url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/laporanKeuangan"
              element={
                <ProtectedRoute>
                  <LaporanKeuangan url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <Add url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list"
              element={
                <ProtectedRoute>
                  <List url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/list/edit/:id"
              element={
                <ProtectedRoute>
                  <Edit url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/produk-keluar/tambah"
              element={
                <ProtectedRoute>
                  <ProdukKeluar url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/bahanKeluar/edit/:id"
              element={
                <ProtectedRoute>
                  <EditProdukKeluar url={url} />
                </ProtectedRoute>
              }
            />

            <Route
              path="/daftarPemasukan"
              element={
                <ProtectedRoute>
                  <DaftarPemasukan url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftarPemasukan/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPemasukan url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/pengeluaran"
              element={
                <ProtectedRoute>
                  <Pengeluaran url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftarPengeluaran"
              element={
                <ProtectedRoute>
                  <DaftarPengeluaran url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftarPengeluaran/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPengeluaran url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/keluar"
              element={
                <ProtectedRoute>
                  <KeluarBarang url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftarKeluar"
              element={
                <ProtectedRoute>
                  <DaftarKeluar url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftarBaku"
              element={
                <ProtectedRoute>
                  <DaftarBaku url={url} />
                </ProtectedRoute>
              }
            />
             <Route
              path="/transaksiBahanBarang"
              element={
                <ProtectedRoute>
                  <TransaksiBahanBarang url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftarKeluar/edit/:id"
              element={
                <ProtectedRoute>
                  <EditBahanKeluar url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/masuk"
              element={
                <ProtectedRoute>
                  <BarangMasuk url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftarBaku"
              element={
                <ProtectedRoute>
                  <DaftarBaku url={url} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/daftarBaku/edit/:id"
              element={
                <ProtectedRoute>
                  <EditBahanBaku url={url} />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
