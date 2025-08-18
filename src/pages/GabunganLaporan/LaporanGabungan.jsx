import React, { useState, useEffect } from "react";
import TransaksiBahanBarang from "./TransaksiBahanBarang";
import DaftarPengeluaran from "./DaftarPengeluaran";

const LaporanGabungan = ({ url }) => {
  const [totalBahanBarang, setTotalBahanBarang] = useState(0);
  const [totalPengeluaran, setTotalPengeluaran] = useState(0);

  const totalKeseluruhan = totalBahanBarang + totalPengeluaran;

  return (
    <div>
      <TransaksiBahanBarang url={url} onTotalChange={setTotalBahanBarang} />
      <DaftarPengeluaran
        url={url}
        onTotalPengeluaranChange={setTotalPengeluaran} // tambahkan callback
        totalKeseluruhan={totalKeseluruhan}
        totalBahanBarang={totalBahanBarang}
      />

      <div className="bg-blue-100 border border-blue-300 text-blue-800 px-6 py-3 rounded-lg shadow font-semibold">
        Total Keseluruhan: Rp {totalKeseluruhan.toLocaleString("id-ID")}
      </div>
    </div>
  );
};

export default LaporanGabungan;
