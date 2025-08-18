import React, { useEffect, useState } from "react";
import axios from "axios";

const DaftarProdukSederhana = ({ onClose, url, onAddToCart }) => {
  const [produk, setProduk] = useState([]);

  useEffect(() => {
    axios.get(`${url}/api/food/list`)
      .then(res => setProduk(res.data.data || []))
      .catch(err => console.error("Gagal fetch produk:", err));
  }, [url]);

  const handleAdd = async (item) => {
    if (item.jumlah < 1) {
      alert("Stok habis!");
      return;
    }

    try {
      // Kurangi stok di backend
      const res = await axios.post(`${url}/api/food/kurangi-stok`, {
        id: item._id,
        jumlah: 1,
      });

      if (res.data.success) {
        // Kirim ke keranjang
        onAddToCart({ ...item, quantity: 1 });

        // Kurangi stok lokal
        setProduk(prev =>
          prev.map(p =>
            p._id === item._id ? { ...p, jumlah: p.jumlah - 1 } : p
          )
        );
      } else {
        alert("Gagal mengurangi stok!");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengurangi stok.");
    }
  };

  return (
    <div className="p-6 bg-white max-w-xl mx-auto mt-10 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">Daftar Produk</h2>
      <ul className="divide-y">
        {produk.map((item) => (
          <li key={item._id} className="py-2 flex justify-between items-center">
            <div>
              <span className="font-medium">{item.namaProduk}</span>
              <p className={`text-sm ${item.jumlah < 10 ? "text-red-600" : "text-green-600"}`}>
                Stok: {item.jumlah}
              </p>
            </div>
            <button
              onClick={() => handleAdd(item)}
              className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              disabled={item.jumlah < 1}
            >
              Tambah
            </button>
          </li>
        ))}
      </ul>
      <button
        onClick={onClose}
        className="mt-4 px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded"
      >
        Kembali
      </button>
    </div>
  );
};

export default DaftarProdukSederhana;
