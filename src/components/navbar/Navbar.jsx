import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Ambil user dari localStorage
  const bagian = user?.bagian;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white shadow-md border-b border-gray-700">
      <div className="flex flex-col gap-1">
        {token && (
          <>
            <h1 className="text-lg font-semibold">
              Hallo, {user?.username || "Pengelola"} 👋
            </h1>
            <p className="text-sm ">Divisi {bagian} </p>
            <button
              onClick={handleLogout}
              className="mt-1 text-sm bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
      <img
        src={assets.labodine}
        alt="Profile"
        className="h-20 w-25 rounded-full object-cover border-2 border-orange-400"
      />
    </div>
  );
};

export default Navbar;
