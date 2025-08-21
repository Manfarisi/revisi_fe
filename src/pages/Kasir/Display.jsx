import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiPlus, FiMinus } from "react-icons/fi";
import Checkout from "../Checkout/Pembayaran";
import { NumericFormat } from "react-number-format";

const ProductCard = ({ product, onAddToCart }) => {
  const { namaProduk,kodeProduk, keterangan, image, harga, hpp, jumlah } = product;
  const [count, setCount] = useState(0);
   const baseURL = "https://revisibe-production.up.railway.app";
  //  const url = "http://localhost:4000"



  const handleIncrement = () => {
    if (count < jumlah) setCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (count > 0) setCount((prev) => prev - 1);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl transition-transform duration-500 ease-in-out transform hover:-translate-y-4 hover:scale-[1.02] relative cursor-pointer">
      <div className="relative h-48 overflow-hidden bg-gradient-to-tr from-gray-200 to-gray-100">
        <img
          src={`${url}/images/${image}`}
          alt={namaProduk}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <span
          className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold z-10 shadow ${
            jumlah <= 10
              ? "bg-red-100 text-red-700"
              : "bg-white/80 text-gray-800"
          }`}
        >
          Stok: {jumlah}
        </span>
      </div>
      <div className="p-4">
        <div className="text-xs uppercase text-gray-500 font-medium tracking-wider mb-2">
          Produk
        </div>
        <h3 className="text-base font-bold text-gray-800 mb-2">{namaProduk}</h3>
        <h4 className="text-base font-medium text-gray-700 mb-2">{kodeProduk}</h4>
        <p className="text-sm text-gray-600 mb-3">{keterangan}</p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-gray-800">
            Rp {harga?.toLocaleString()}
          </span>
          <span className="text-sm text-gray-500">
            HPP: Rp {hpp?.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handleDecrement}
            className="w-9 h-9 flex items-center justify-center bg-red-200 hover:bg-red-300 rounded-full text-lg text-gray-800"
          >
            <FiMinus />
          </button>
          <span className="font-semibold text-lg">{count}</span>
          <button
            onClick={handleIncrement}
            className="w-9 h-9 flex items-center justify-center bg-green-200 hover:bg-green-300 rounded-full text-lg text-gray-800"
          >
            <FiPlus />
          </button>
        </div>

        <button
          onClick={() => onAddToCart({ ...product, quantity: count })}
          className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-semibold relative overflow-hidden transition hover:shadow-lg hover:-translate-y-1 disabled:opacity-50"
          disabled={count === 0}
        >
          <span className="relative z-10">Tambah ke Keranjang ({count})</span>
        </button>
      </div>
    </div>
  );
};

const ProductList = ({ url }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [checkoutData, setCheckoutData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [produkRes, checkoutRes] = await Promise.all([
          axios.get(`${url}/api/food/list`),
          axios.get(`${url}/api/checkout/daftarCheckout`),
        ]);

        if (produkRes.data.success) {
          setProducts(produkRes.data.data);
        }

        if (checkoutRes.data.success) {
          setCheckoutData(checkoutRes.data.data);
        }
      } catch (error) {
        console.error("Terjadi kesalahan:", error);
      }
    };

    fetchData();
  }, []);

  // Hitung total pembelian tiap produk
  const productSalesCount = {};

  checkoutData.forEach((checkout) => {
    checkout.cartItems.forEach((item) => {
      const id = item._id;
      if (!productSalesCount[id]) {
        productSalesCount[id] = item.quantity;
      } else {
        productSalesCount[id] += item.quantity;
      }
    });
  });

  const handleAddToCart = (item) => {
    const exist = cartItems.find((p) => p._id === item._id);
    if (exist) {
      setCartItems(
        cartItems.map((p) =>
          p._id === item._id
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        )
      );
    } else {
      setCartItems([...cartItems, item]);
    }
  };

  const enrichedProducts = products.map((p) => ({
    ...p,
    dibeli: productSalesCount[p._id] || 0,
  }));

  // FILTERING
  let filteredProducts = enrichedProducts
    .filter((p) => !selectedCategory || p.kategori === selectedCategory)
    .filter((p) => !minPrice || p.harga >= parseInt(minPrice))
    .filter((p) => !maxPrice || p.harga <= parseInt(maxPrice))
    .filter((p) =>
      p.namaProduk.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // SORTING
  if (sortOption === "palinglaku")
    filteredProducts.sort((a, b) => b.dibeli - a.dibeli);
  if (sortOption === "priceLowHigh")
    filteredProducts.sort((a, b) => a.harga - b.harga);
  if (sortOption === "priceHighLow")
    filteredProducts.sort((a, b) => b.harga - a.harga);
  if (sortOption === "stokTinggi")
    filteredProducts.sort((a, b) => b.jumlah - a.jumlah);

  if (showCheckout) {
    return (
      <Checkout
        cartItems={cartItems}
        setCartItems={setCartItems}
        onBack={(clearedCart) => {
          setCartItems(clearedCart);
          setShowCheckout(false);
        }}
      />
    );
  }

  return (
    <div className="bg-gradient-to-tr from-gray-50 to-gray-200 py-8 px-6">
      {/* Filter Area */}
      <div className="mb-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Cari produk..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded-md px-4 py-2 w-full"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border rounded-md px-4 py-2 w-full"
        >
          <option value="">Semua Kategori</option>
          <option value="Hampers">Hampers</option>
          <option value="Frozen">Frozen</option>
          <option value="Paket Mini Frozen">Paket Mini Frozen</option>
          <option value="Paket Matang">Paket Matang</option>
          <option value="Hampers Neela Klappertart">
            Hampers Neela Klappertart
          </option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded-md px-4 py-2 w-full"
        >
          <option value="">Urutkan</option>
          <option value="palinglaku">Paling Laku</option>
          <option value="priceLowHigh">Harga Termurah</option>
          <option value="priceHighLow">Harga Termahal</option>
          <option value="stokTinggi">Stok Tertinggi</option>
        </select>

        <div className="flex gap-2">
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp "
            allowNegative={false}
            placeholder="Harga Terendah"
            value={minPrice}
            onValueChange={(values) => setMinPrice(values.floatValue || "")}
            className="border rounded-md px-4 py-2 w-full"
          />
          <NumericFormat
            thousandSeparator="."
            decimalSeparator=","
            prefix="Rp "
            allowNegative={false}
            placeholder="Harga Tertinggi"
            value={maxPrice}
            onValueChange={(values) => setMaxPrice(values.floatValue || "")}
            className="border rounded-md px-4 py-2 w-full"
          />
        </div>
      </div>

      {/* Produk Grid */}
      {/* Tombol Checkout */}
      {cartItems.length > 0 && (
        <div className="mt-8 flex justify-center mb-5">
          <button
            onClick={() => setShowCheckout(true)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow"
          >
            Masukan ke Keranjang ({cartItems.length} item)
          </button>
        </div>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onAddToCart={handleAddToCart}
            url={url}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
