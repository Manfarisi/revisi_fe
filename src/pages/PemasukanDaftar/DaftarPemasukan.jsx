import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaInbox } from "react-icons/fa";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const DaftarPemasukan = ({ url }) => {
  const [pemasukan, setPemasukan] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterBulan, setFilterBulan] = useState("");
  const [filterJenis, setFilterJenis] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  const fetchData = async () => {
    try {
      const res = await axios.get(`${url}/api/checkout/daftarCheckout`);
      if (res.data.success) {
        setPemasukan(res.data.data);
        setFiltered(res.data.data);
      } else {
        toast.error("Gagal mengambil data pemasukan");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat memuat data");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const res = await axios.delete(`${url}/api/checkout/hapusCheckout/${id}`);
      if (res.data.success) {
        toast.success("Data berhasil dihapus");
        fetchData();
      } else {
        toast.error("Gagal menghapus data");
      }
    } catch (err) {
      toast.error("Terjadi kesalahan saat menghapus data");
    }
  };

  const handleLihatStruk = (data) => {
    const doc = new jsPDF();
    const waktuTransaksi = new Date(data.createdAt).toLocaleString("id-ID", {
      dateStyle: "full",
      timeStyle: "short",
    });

    doc.setFontSize(14);
    doc.text("Struk Pembayaran", 80, 10);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${waktuTransaksi}`, 14, 20);
    doc.text(`Kasir: ${data.kasir}`, 14, 26);
    doc.text(`Pembeli: ${data.customerName || "-"}`, 14, 32);
    doc.text(`Gender: ${data.customerGender || "-"}`, 14, 38);
    doc.text(`Metode: ${data.paymentMethod}`, 14, 44);

    autoTable(doc, {
      startY: 50,
      head: [["Produk", "Jumlah", "Harga Satuan", "Subtotal"]],
      body: data.cartItems.map((item) => [
        item.namaProduk,
        item.quantity,
        `Rp ${item.harga?.toLocaleString("id-ID") || "-"}`,
        `Rp ${(item.harga * item.quantity)?.toLocaleString("id-ID") || "-"}`,
      ]),
    });

    const subtotal = data.subtotal || data.cartItems.reduce((acc, i) => acc + i.harga * i.quantity, 0);
    const discountAmount = (data.discountPercent / 100) * subtotal;
    const total = data.total;

    const y = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: Rp ${subtotal.toLocaleString("id-ID")}`, 14, y);
    doc.text(`Diskon: Rp ${discountAmount.toLocaleString("id-ID")}`, 14, y + 6);
    doc.text(`Total: Rp ${total.toLocaleString("id-ID")}`, 14, y + 12);

    doc.save(`struk-${data._id}.pdf`);
  };

  const filterData = () => {
    let data = [...pemasukan];

    if (filterBulan) {
      const [year, month] = filterBulan.split("-");
      data = data.filter((item) => {
        const date = new Date(item.createdAt);
        return (
          date.getFullYear().toString() === year &&
          (date.getMonth() + 1).toString().padStart(2, "0") === month
        );
      });
    }

    if (filterJenis) {
      data = data.filter((item) =>
        item.paymentMethod.toLowerCase().includes(filterJenis.toLowerCase())
      );
    }

    if (search.trim()) {
      data = data.filter((item) =>
        item.cartItems.some((ci) =>
          ci.namaProduk.toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    setFiltered(data);
    setCurrentPage(1); // reset ke halaman pertama setelah filter
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Pemasukan", 14, 10);
    const tableData = filtered.map((item, idx) => [
      idx + 1,
      new Date(item.createdAt).toLocaleDateString("id-ID"),
      item.paymentMethod,
      item.customerGender || "-",
      item.customerNumber || "-",
      item.discountPercent + "%",
      item.cartItems.reduce((acc, i) => acc + i.quantity, 0),
      item.cartItems.map((ci) => `${ci.namaProduk} x ${ci.quantity}`).join(", "),
      `Rp ${item.total.toLocaleString("id-ID")}`,
    ]);

    autoTable(doc, {
      head: [["No","Invoice", "Tanggal", "Metode", "Gender","No Pembeli", "Diskon", "Jumlah Item", "Produk", "Total"]],
      body: tableData,
      startY: 20,
    });

    doc.save("laporan_pemasukan.pdf");
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData();
  }, [filterBulan, filterJenis, search, pemasukan]);

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedData = filtered.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const totalPemasukan = filtered.reduce((acc, item) => acc + item.total, 0);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl p-8 border border-blue-200">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-800">🛒 Daftar Pemasukan</h1>
            <p className="text-gray-600">Manajemen pemasukan dari transaksi checkout</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <input type="month" value={filterBulan} onChange={(e) => setFilterBulan(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md" placeholder="Cari Nama Produk" />
          <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-md">
            <option value="">Semua Metode</option>
            <option value="tunai">Tunai</option>
            <option value="transfer">Transfer</option>
            <option value="qris">QRIS</option>
          </select>
        </div>

        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 rounded-lg mb-6 space-y-2">
          <div>
            <p className="text-sm text-blue-700 font-medium">Total Pemasukan</p>
            <h2 className="text-xl font-bold text-blue-600">Rp {totalPemasukan.toLocaleString("id-ID")}</h2>
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Total Pesanan</p>
            <h2 className="text-xl font-bold text-blue-600">{filtered.length.toLocaleString()} Pesanan</h2>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl shadow">
          <button onClick={exportToPDF} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow mb-5">
            Unduh Laporan
          </button>

          <table className="min-w-full text-sm text-gray-700">
            <thead>
              <tr className="bg-blue-100 text-blue-800">
                {["No","Invoice", "Tanggal", "Metode", "Gender","No Pembeli", "Diskon", "Jumlah Item", "Produk", "Total","Petugas", "Aksi"].map((title) => (
                  <th key={title} className="px-5 py-3 font-semibold text-center">{title}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length > 0 ? (
                paginatedData.map((data, idx) => (
                  <tr key={data._id} className="border-b border-blue-200 hover:bg-blue-50">
                    <td className="px-5 py-3 text-center">{indexOfFirstItem + idx + 1}</td>
                    <td className="px-5 py-3 text-center">{data.kodePesanan}</td>
                    <td className="px-5 py-3 text-center">{new Date(data.createdAt).toLocaleDateString("id-ID")}</td>
                    <td className="px-5 py-3 text-center capitalize">{data.paymentMethod}</td>
                    <td className="px-5 py-3 text-center">{data.customerGender || "-"}</td>
                    <td className="px-5 py-3 text-center">{data.customerNumber || "-"}</td>
                    <td className="px-5 py-3 text-center">{data.discountPercent}%</td>
                    <td className="px-5 py-3 text-center">{data.cartItems.reduce((acc, i) => acc + i.quantity, 0)}</td>
                    <td className="px-5 py-3 text-center">
                      <ul className="list-disc list-inside">
                        {data.cartItems.map((ci, i) => (
                          <li key={i}>{ci.namaProduk} x {ci.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-5 py-3 text-center text-green-600 font-semibold">Rp {data.total.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-3 text-center font-semibold">{data.kodePetugas}</td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleLihatStruk(data)} className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-md" title="Lihat Struk">🧾</button>
                        <button onClick={() => handleDelete(data._id)} className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-md" title="Hapus">
                          <FaTrashAlt />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center py-12">
                    <div className="flex flex-col items-center text-gray-500 text-lg">
                      <FaInbox size={48} className="mb-3" />
                      <h3 className="text-xl font-semibold">Tidak ada data ditemukan</h3>
                      <p className="mb-4">Ubah filter atau tambah transaksi baru.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded border ${
                  currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white hover:bg-blue-100"
                }`}
              >
                Prev
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded border ${
                    currentPage === page
                      ? "bg-blue-500 text-white"
                      : "bg-white hover:bg-blue-100"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded border ${
                  currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-white hover:bg-blue-100"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DaftarPemasukan;
