import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DaftarProdukSederhana from "../DaftarProdukSederhana/DaftarProdukSederhana";
import DummyQris from "../DummyQris/DummyQris";

const Checkout = ({ cartItems, setCartItems, onBack }) => {
  const [paymentMethod, setPaymentMethod] = useState("");
  const [customerGender, setCustomerGender] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);
  const [customerNumber, setCustomerNumber] = useState("");
  const [uangDibayar, setUangDibayar] = useState("");
  const [showDaftarProduk, setShowDaftarProduk] = useState(false);
   const url = import.meta.env.VITE_API_URL.replace(/\/$/, "");
  //  const url = "http://localhost:4000";

  const navigate = useNavigate();
  const kasir = JSON.parse(localStorage.getItem("user"))?.username || "Kasir";

  const formatRupiah = (angka) =>
    new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(angka);

  const parseRupiah = (str) =>
    Number(str.replace(/\./g, "").replace(/[^0-9]/g, "")) || 0;

  const handleUangDibayarChange = (e) => {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return setUangDibayar("");
    setUangDibayar(new Intl.NumberFormat("id-ID").format(Number(raw)));
  };

  const handleQuantityChange = (index, delta) => {
    const updated = [...cartItems];
    const newQty = updated[index].quantity + delta;

    if (newQty > 0) {
      updated[index].quantity = newQty;
      setCartItems(updated);
    } else {
      // Hapus item jika quantity jadi 0
      const filtered = updated.filter((_, i) => i !== index);
      setCartItems(filtered);
    }
  };

  const dummyMetodePembayaran = [
    { value: "tunai", label: "Tunai" },
    { value: "qris", label: "QRIS (Scan Barcode)" },
    {
      value: "transfer_bca",
      label: "Transfer Bank - BCA (1234567890 a.n PT ECOM)",
    },
    {
      value: "transfer_bri",
      label: "Transfer Bank - BRI (0987654321 a.n PT ECOM)",
    },
    {
      value: "transfer_bni",
      label: "Transfer Bank - BNI (1122334455 a.n PT ECOM)",
    },
    {
      value: "transfer_mandiri",
      label: "Transfer Bank - Mandiri (2233445566 a.n PT ECOM)",
    },
    { value: "ovo", label: "OVO (085712345678)" },
    { value: "gopay", label: "GoPay (085798765432)" },
    { value: "dana", label: "DANA (085765432109)" },
    { value: "shopeepay", label: "ShopeePay (Hubungkan via QR / Akun)" },
  ];

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.harga * item.quantity,
    0
  );
  const discountAmount = (discountPercent / 100) * subtotal;
  const total = Math.max(subtotal - discountAmount, 0);
  const uangDibayarValue = parseRupiah(uangDibayar);
  const kembalian = paymentMethod === "tunai" ? uangDibayarValue - total : 0;
  const waktuTransaksi = new Date().toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });

  const cetakStruk = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Struk Pembayaran", 80, 10);
    doc.setFontSize(10);
    doc.text(`Tanggal: ${waktuTransaksi}`, 14, 20);
    doc.text(`Kasir: ${kasir}`, 14, 26);
    doc.text(`Pembeli: ${customerNumber || "-"}`, 14, 32);
    doc.text(`Gender: ${customerGender}`, 14, 38);
    doc.text(`Metode: ${paymentMethod}`, 14, 44);

    autoTable(doc, {
      startY: 50,
      head: [["Produk", "Jumlah", "Harga", "Subtotal"]],
      body: cartItems.map((item) => [
        item.namaProduk,
        item.quantity,
        formatRupiah(item.harga),
        formatRupiah(item.harga * item.quantity),
      ]),
    });

    const y = doc.lastAutoTable.finalY + 10;
    doc.text(`Subtotal: ${formatRupiah(subtotal)}`, 14, y);
    doc.text(`Diskon: ${formatRupiah(discountAmount)}`, 14, y + 6);
    doc.text(`Total: ${formatRupiah(total)}`, 14, y + 12);
    if (paymentMethod === "tunai") {
      doc.text(`Dibayar: ${formatRupiah(uangDibayarValue)}`, 14, y + 18);
      doc.text(`Kembalian: ${formatRupiah(kembalian)}`, 14, y + 24);
    }
    doc.save(`struk-${Date.now()}.pdf`);
  };

  const handleConfirm = async () => {
    if (!paymentMethod)
      return Swal.fire("Pilih Metode Pembayaran!", "", "warning");
    if (paymentMethod === "tunai" && uangDibayarValue < total)
      return Swal.fire("Uang tidak mencukupi", "", "error");

    // Ambil data user dari localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    const data = {
      cartItems,
      paymentMethod,
      customerGender,
      customerNumber,
      discountPercent,
      subtotal,
      total,
      kasir,
      waktuTransaksi,
      userId: user._id, // Kirim userId ke backend
      kodePetugas: user.kodePetugas,
    };

    try {
      const response = await fetch(`${url}/api/checkout/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        await Promise.all(
          cartItems.map((item) =>
            fetch(`${url}/api/food/kurangi-stok`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id: item._id, jumlah: item.quantity }),
            })
          )
        );

        await fetch(`${url}/api/pelanggan/tambah`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerNumber,
            customerGender,
            totalTransaksi: total,
          }),
        });

        cetakStruk();
        Swal.fire({
          title: "Pembayaran Berhasil!",
          html: `
    <div style="text-align: left;">
      <p><strong>Tanggal:</strong> ${waktuTransaksi}</p>
      <p><strong>Kasir:</strong> ${kasir}</p>
      <p><strong>Pembeli:</strong> ${customerNumber || "-"}</p>
      <p><strong>Gender:</strong> ${customerGender || "-"}</p>
      <p><strong>Metode:</strong> ${paymentMethod}</p>
      <p><strong>Subtotal:</strong> Rp ${formatRupiah(subtotal)}</p>
      <p><strong>Diskon:</strong> Rp ${formatRupiah(discountAmount)}</p>
      <p><strong>Total:</strong> Rp ${formatRupiah(total)}</p>
      ${
        paymentMethod === "tunai"
          ? `<p><strong>Dibayar:</strong> Rp ${formatRupiah(
              uangDibayarValue
            )}</p>
             <p><strong>Kembalian:</strong> Rp ${formatRupiah(kembalian)}</p>`
          : ""
      }
    </div>
  `,
          icon: "success",
          confirmButtonText: "Lanjut",
        }).then(() => navigate("/daftarPemasukan"));
      } else {
        Swal.fire(
          "Gagal Checkout",
          "Terjadi kesalahan saat menyimpan.",
          "error"
        );
      }
    } catch (err) {
      console.error(err);
      Swal.fire(
        "Kesalahan Sistem",
        "Tidak dapat terhubung ke server.",
        "error"
      );
    }
  };

  if (showDaftarProduk) {
    return (
      <DaftarProdukSederhana
        url={url}
        onClose={() => setShowDaftarProduk(false)}
        onAddToCart={(product) => {
          const exist = cartItems.find((p) => p._id === product._id);
          if (exist) {
            setCartItems(
              cartItems.map((p) =>
                p._id === product._id
                  ? { ...p, quantity: p.quantity + product.quantity }
                  : p
              )
            );
          } else {
            setCartItems([...cartItems, product]);
          }
        }}
      />
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
        Keranjang Belanja
      </h2>

      <div className="mb-4">
        <label className="text-sm font-medium">Nomor Pembeli:</label>
        <input
          type="text"
          value={customerNumber}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, ""); // hanya angka
            if (value.length <= 13) {
              setCustomerNumber(value);
            }
          }}
          maxLength={13}
          className="w-full border p-2 rounded mt-1"
          placeholder="Opsional"
        />
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-2">Produk:</h3>
        <div className="space-y-2 text-sm">
          {cartItems.map((item, i) => (
            <div
              key={i}
              className="border-b pb-2 flex justify-between items-center"
            >
              <div>
                <p className="text-xl font-bold mb-2">{item.namaProduk}</p>
                <p className="text-lg font-normal mt-1">{item.kodeProduk}</p>
                <p className="mt-2">Harga: {formatRupiah(item.harga)}</p>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(i, -1)}
                  className="px-2 py-1 bg-red-200 rounded hover:bg-red-300"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => handleQuantityChange(i, 1)}
                  className="px-2 py-1 bg-green-200 rounded hover:bg-green-300"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => setShowDaftarProduk(true)}
          className="mt-4 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-sm rounded"
        >
          + Tambah Produk
        </button>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium">Diskon (%):</label>
        <input
          type="number"
          value={discountPercent}
          onChange={(e) =>
            setDiscountPercent(
              Math.min(100, Math.max(0, Number(e.target.value)))
            )
          }
          className="ml-2 border px-2 py-1 rounded w-24 text-sm"
        />
        <p className="text-xs text-gray-500 mt-1">
          Diskon: {formatRupiah(discountAmount)}
        </p>
      </div>

      <div className="text-xl font-bold text-green-600 mb-6">
        Total: {formatRupiah(total)}
      </div>

      <div className="mb-4">
        <label className="block font-medium mb-2">Jenis Kelamin:</label>
        <div className="space-x-4 text-sm">
          <label>
            <input
              type="radio"
              name="gender"
              value="Pria"
              onChange={(e) => setCustomerGender(e.target.value)}
            />{" "}
            Pria
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="Wanita"
              onChange={(e) => setCustomerGender(e.target.value)}
            />{" "}
            Wanita
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="font-medium mb-1 block">Metode Pembayaran:</label>
        <select
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full border p-2 rounded"
        >
          <option value="">-- Pilih --</option>
          {dummyMetodePembayaran.map((metode) => (
            <option key={metode.value} value={metode.value}>
              {metode.label}
            </option>
          ))}
        </select>

        {paymentMethod === "qris" && (
          <DummyQris total={total} invoice={`INV-${Date.now()}`} />
        )}

        {paymentMethod === "tunai" && (
          <div className="mt-4">
            <label className="block text-sm font-medium">
              Uang Dibayar (Tunai):
            </label>
            <input
              type="text"
              value={uangDibayar}
              onChange={handleUangDibayarChange}
              className="w-full border p-2 rounded mt-1"
              placeholder="Contoh: 200.000"
            />
            {uangDibayar && kembalian >= 0 && (
              <p className="text-sm mt-1 text-green-700">
                Kembalian: {formatRupiah(kembalian)}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <button
          onClick={() => onBack([])}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
        >
          Kembali
        </button>
        <button
          onClick={handleConfirm}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold"
        >
          Konfirmasi Pembayaran
        </button>
      </div>
    </div>
  );
};

export default Checkout;
