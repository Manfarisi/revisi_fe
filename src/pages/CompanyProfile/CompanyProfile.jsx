import React from "react";
import { assets } from "../../assets/assets";

const companyProfile = {
  nama : "PT. Kreasi Neela Utama",  
  name: "LaBodine – Cintarasa Nusantara",
  tagline: "Dari singkong lokal untuk Indonesia dan dunia.",
  description:
    "Didirikan pada tahun 2015 oleh Ibu Surya Nila A Hamid, LaBodine hadir dengan misi menghadirkan camilan sehat, praktis, dan berbahan baku lokal. Berawal dari inovasi combro dan kroket singkong beku, LaBodine kini dikenal sebagai penyedia pangan olahan berkualitas yang dipercaya oleh kafe, hotel, dan reseller.",
  vision:
    "Menjadi perusahaan pangan lokal yang berkualitas, aman, dan terdepan di industri makanan Indonesia.",
  mission: [
    "Menghasilkan produk unggulan berbahan lokal",
    "Menerapkan standar Cara Produksi Pangan Olahan yang Baik (CPPB)",
    "Memastikan legalitas dan sertifikasi lengkap",
    "Membangun brand makanan Indonesia yang dikenal luas",
  ],
  advantages: [
    "Aman & Berkualitas – Bersertifikat PIRT, Halal, dan proses pengajuan MD BPOM",
    "Berbahan Baku Lokal Terpilih – Singkong segar dari mitra tetap",
    "Dipercaya Pasar – Digunakan oleh kafe, hotel, dan reseller terpercaya",
    "Tanpa MSG & Bahan Tambahan Berbahaya",
  ],
  certifications: [
    "PIRT: 2153276010281-21",
    "PB UMKU: 028901020277600010002",
    "NIB: 0289010302776",
    "Sertifikat Halal: ID32110000474710722",
  ],
  partners: [
    "Culdesac",
    "Hidden Haus",
    "Kedai Lekker",
    "You N Me Cibinong",
    "Kong Tji Bogor",
    "Juanda Cuci Mobil",
    "Mpek Moy",
    "Ira Mart",
    "Andina Food",
    "Adira Food",
    "Depok UMKM Centre",
    "Hotel-hotel melalui pihak ketiga (Bidakara, Aston, KC)",
  ],
  logo: "/src/assets/labodine.jpeg",
  // Menambahkan gambar-gambar tambahan
  images: [
    '/src/assets/gambar1.jpeg',
    '/src/assets/gambar2.jpeg',
    '/src/assets/gambar3.jpeg',
    '/src/assets/gambar4.jpeg',],
  // Struktur organisasi
  organizationalStructure: {
    owner: {
      name: "Ibu Surya Nila A Hamid",
      position: "Pemilik & Pendiri",
      description: "Pendiri LaBodine dengan visi menghadirkan camilan sehat berbahan singkong lokal."
    },
    employees: [
      {
        name: "Budi Santoso",
        position: "Manajer Produksi",
        image: "/assets/team/manager.jpg",
        description: "Bertanggung jawab atas proses produksi dan menjaga kualitas produk."
      },
      {
        name: "Dewi Lestari",
        position: "Supervisor Quality Control",
        description: "Memastikan semua produk memenuhi standar kualitas dan keamanan pangan."
      },
      {
        name: "Ahmad Rizki",
        position: "Koordinator Pemasaran",
        description: "Menangani pemasaran produk dan hubungan dengan mitra bisnis."
      },
      {
        name: "Rina Wijaya",
        position: "Administrasi & Keuangan",
        description: "Mengelola administrasi perusahaan dan keuangan."
      },
      {
        name: "Joko Prasetyo",
        position: "Logistik & Distribusi",
        description: "Mengatur distribusi produk ke seluruh mitra dan pelanggan."
      }
    ]
  }
};

const CompanyProfile = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-white to-amber-50 rounded-xl shadow-lg border border-amber-100">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-center mb-8 p-6 bg-white rounded-lg shadow-md">
        <div className="w-32 h-32 md:mr-6 mb-4 md:mb-0 flex-shrink-0">
          <img
            src={assets.logo}
            alt="Logo LaBodine"
            className="w-full h-full object-contain rounded-full border-4 border-amber-200 p-2"
          />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-amber-800">{companyProfile.nama}</h1>
          <p className="text-amber-600 text-lg mt-2 italic">{companyProfile.tagline}</p>
        </div>

      </div>

      {/* Description Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Tentang Kami</h2>
        <p className="text-gray-700 leading-relaxed">{companyProfile.description}</p>
      </div>

      {/* Vision & Mission Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Visi</h2>
          <p className="text-gray-700">{companyProfile.vision}</p>
        </div>
        
        <div className="p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Misi</h2>
          <ul className="list-disc ml-5 text-gray-700 space-y-2">
            {companyProfile.mission.map((misi, idx) => (
              <li key={idx}>{misi}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="mb-8 p-6 bg-amber-50 rounded-lg shadow-md border border-amber-100">
        <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Keunggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {companyProfile.advantages.map((adv, idx) => (
            <div key={idx} className="flex items-start p-4 bg-white rounded-lg shadow-sm">
              <div className="bg-amber-100 p-2 rounded-full mr-3">
                <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <span className="text-gray-700">{adv}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Organizational Structure Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-amber-800 mb-6 pb-2 border-b-2 border-amber-200">Struktur Organisasi</h2>
        
        {/* Owner */}
        <div className="text-center mb-10">
          <h3 className="text-lg font-bold text-amber-800">{companyProfile.organizationalStructure.owner.name}</h3>
          <p className="text-amber-600 font-medium">{companyProfile.organizationalStructure.owner.position}</p>
          <p className="text-gray-600 mt-2 max-w-md mx-auto">{companyProfile.organizationalStructure.owner.description}</p>
        </div>
        
        {/* Employees */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyProfile.organizationalStructure.employees.map((employee, idx) => (
            <div key={idx} className="bg-amber-50 rounded-lg p-4 text-center shadow-sm border border-amber-100">

              <h3 className="font-semibold text-amber-800">{employee.name}</h3>
              <p className="text-sm text-amber-600 mb-2">{employee.position}</p>
              <p className="text-xs text-gray-600">{employee.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Legalitas & Sertifikasi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {companyProfile.certifications.map((cert, idx) => (
            <div key={idx} className="p-3 bg-amber-50 rounded-md border border-amber-100 text-sm">
              {cert}
            </div>
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Partner Bisnis</h2>
        <div className="flex flex-wrap gap-3">
          {companyProfile.partners.map((partner, idx) => (
            <span key={idx} className="px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm">
              {partner}
            </span>
          ))}
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="mb-8 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-amber-800 mb-4 pb-2 border-b-2 border-amber-200">Galeri</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={assets.gambar1} 
                alt='Gambar 1'
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
             <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={assets.gambar2} 
                alt='Gambar 2'
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
             <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={assets.gambar3} 
                alt='Gambar 3'
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
             <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={assets.gambar4} 
                alt='Gambar 4'
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
              />
            </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center p-6 bg-amber-800 text-amber-100 rounded-lg">
        <p className="text-lg italic">{companyProfile.tagline}</p>
        <p className="mt-2 text-sm">© {new Date().getFullYear()} LaBodine – Cintarasa Nusantara. All rights reserved.</p>
      </div>
    </div>
  );
};

export default CompanyProfile;