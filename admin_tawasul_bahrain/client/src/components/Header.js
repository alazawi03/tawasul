import React from "react";
import { Link } from "react-router-dom";
// import { FaMapMarkerAlt, FaMosque } from 'react-icons/fa';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-islamic-green to-islamic-green-light shadow-lg islamic-shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          {/* Logo & Title */}
          <Link
            to="/"
            className="text-white flex flex-col items-center md:flex-row gap-2 md:gap-3 group cursor-pointer text-center md:text-right"
          >
            <h1 className="text-xl md:text-3xl font-arabic-title font-bold transition-all duration-300 group-hover:text-islamic-gold group-hover:scale-105 group-hover:animate-pulse leading-snug">
              تواصل أهل البحرين
            </h1>
            <img
              src="/islamic-memorial/tawasul.png"
              alt="Tawasul Logo"
              className="block h-14 md:h-20 w-auto transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:animate-bounce filter group-hover:drop-shadow-lg group-hover:brightness-110"
            />
          </Link>

          {/* Navigation Bar */}
          <nav className="flex gap-4 text-white font-semibold">
            <Link
              to="/cemetery-supervisors"
              className="flex items-center gap-3 hover:bg-yellow-600 text-white px-5 py-2 rounded-full transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              {/* <FaMapMarkerAlt className="text-white" /> */}
              <span>أرقام مشرفي المقابر</span>
            </Link>

            <Link
              to="/halls-supervisors-numbers"
              className="flex items-center gap-3 hover:bg-yellow-600 text-white px-5 py-2 rounded-full transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              {/* <FaMosque className="text-white" /> */}
              <span>أرقام مشرفي الصالات</span>
            </Link>

            <Link
              to="/prayer-times"
              className="flex items-center gap-3 hover:bg-yellow-600 text-white px-5 py-2 rounded-full transition duration-300 hover:scale-105 hover:shadow-lg"
            >
              <span>مواقيت الصلاة</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
