import React, { useEffect, useState } from "react";
import QRCode from "qrcode";

const DummyQris = ({ total = 0, invoice = "INV-0000" }) => {
  const [qrImageUrl, setQrImageUrl] = useState("");

  useEffect(() => {
    if (total <= 0) return;

    // Dummy string format (simulasi transaksi QRIS)
    const dummyQrisString = `DUMMYQRIS|TOKO-ECOM|TOTAL=${total}|INVOICE=${invoice}`;

    // Convert string ke QR Code
    QRCode.toDataURL(dummyQrisString)
      .then((url) => {
        setQrImageUrl(url);
      })
      .catch((err) => {
        console.error("Gagal generate QR Code:", err);
      });
  }, [total, invoice]);

  if (total <= 0) {
    return (
      <div className="text-red-500 font-semibold text-sm mt-2">
        Total pembayaran belum valid.
      </div>
    );
  }

  return (
    <div className="my-4 text-center bg-gray-50 border rounded p-4 shadow-inner">
      <p className="font-semibold mb-2 text-sm text-gray-700">
        Scan QRIS (Dummy) untuk pembayaran sebesar:
      </p>
      <p className="text-lg font-bold text-green-700 mb-4">
        Rp {new Intl.NumberFormat("id-ID").format(total)}
      </p>

      {qrImageUrl ? (
        <img
          src={qrImageUrl}
          alt="Dummy QRIS"
          className="mx-auto w-52 h-52 border p-2 rounded bg-white"
        />
      ) : (
        <p className="text-sm text-gray-500">Menghasilkan QR Code...</p>
      )}

      <p className="text-xs text-gray-500 mt-2">
        Invoice: <strong>{invoice}</strong> (Simulasi QRIS)
      </p>
    </div>
  );
};

export default DummyQris;
