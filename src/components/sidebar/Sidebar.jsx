import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingBasket,
  Users,
  ChevronDown,
  ShoppingBag,
  VibrateIcon,
  UserRoundPlus,
  UserCircle2Icon,
} from "lucide-react";

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
    {
    title: "Profile",
    href: "/profile",
    icon: UserCircle2Icon,
  },
  {
    title: "Member",
    href: "/daftarPelanggan",
    icon: Users,
  },
  {
    title: "Pegawai tunggu",
    href: "/manajemenUser",
    icon: UserRoundPlus,
    allowedRoles: ["Admin"],
  },
  {
    title: "kasir",
    href: "/kasir",
    icon: ShoppingBag,
  },
  {
    title: "Barang dan Bahan",
    icon: VibrateIcon,
    submenu: [
      {
        title: "Daftar Barang & Bahan",
        href: "/daftarBaku",
        allowedRoles: ["Admin", "Pegawai"],
      },
      {
        title: "Bahan Keluar",
        href: "/keluar",
        allowedRoles: ["Admin", "Pegawai"],
      },
      {
        title: "Riwayat Bahan Keluar",
        href: "/daftarKeluar",
        allowedRoles: ["Admin", "Pegawai"],
      },
    ],
  },
  {
    title: "Produk",
    icon: Package,
    submenu: [
      {
        title: "Daftar Produk",
        href: "/list",
        allowedRoles: ["Admin", "Pegawai"],
      },
    ],
  },
  {
    title: "Laporan",
    icon: ShoppingBasket,
    submenu: [
      {
        title: "Pemasukan",
        href: "/daftarPemasukan",
        allowedRoles: ["Admin", "Pegawai"],
      },
      {
        title: "Pengeluaran",
        href: "/daftarPengeluaran",
        allowedRoles: ["Admin", "Pegawai"],
      },
      {
        title: "Transaksi Barang & Bahan",
        href: "/transaksiBahanBarang",
        allowedRoles: ["Admin", "Pegawai"],
      },
    ],
  },
];

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.kategori || "Pegawai";

  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (href) => {
    setOpenSubmenus((prev) => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  const isActiveLink = (href) => currentPath === href;
  const isSubLinkActive = (submenu = []) =>
    submenu.some((item) => currentPath === item.href);

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white w-64 shadow-lg">
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-700">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <ShoppingBasket className="h-6 w-6 text-orange-400" />
          <span>Labodine</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-2">
          {navItems
            .filter((item) => {
              // Untuk menu utama tanpa submenu
              if (!item.submenu && item.allowedRoles) {
                return item.allowedRoles.includes(userRole);
              }

              // Untuk menu dengan submenu: minimal ada 1 submenu yang boleh diakses
              if (item.submenu) {
                const accessibleSubmenu = item.submenu.filter((sub) =>
                  sub.allowedRoles?.includes(userRole)
                );
                return accessibleSubmenu.length > 0;
              }

              return true;
            })
            .map((item) => {
              const isParentActive =
                isSubLinkActive(item.submenu) || isActiveLink(item.href);

              return (
                <div key={item.href || item.title}>
                  {item.submenu ? (
                    <div>
                      <button
                        onClick={() => toggleSubmenu(item.title)}
                        className={`flex items-center w-full p-2 rounded-md transition-colors duration-200 ${
                          isParentActive
                            ? "bg-gray-700 text-white"
                            : "hover:bg-gray-700 text-gray-300"
                        }`}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        <span>{item.title}</span>
                        <ChevronDown
                          className={`ml-auto h-4 w-4 transition-transform ${
                            openSubmenus[item.title] ||
                            isSubLinkActive(item.submenu)
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </button>
                      {(openSubmenus[item.title] ||
                        isSubLinkActive(item.submenu)) && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.submenu
                            .filter((subItem) =>
                              subItem.allowedRoles?.includes(userRole)
                            )
                            .map((subItem) => (
                              <Link
                                key={subItem.href}
                                to={subItem.href}
                                className={`flex items-center p-2 rounded-md text-sm transition-colors duration-200 ${
                                  isActiveLink(subItem.href)
                                    ? "bg-gray-600 text-white"
                                    : "hover:bg-gray-600 text-gray-400"
                                }`}
                              >
                                {subItem.title}
                              </Link>
                            ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      className={`flex items-center p-2 rounded-md transition-colors duration-200 ${
                        isActiveLink(item.href)
                          ? "bg-gray-700 text-white"
                          : "hover:bg-gray-700 text-gray-300"
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      <span>{item.title}</span>
                    </Link>
                  )}
                </div>
              );
            })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
