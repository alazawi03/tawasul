import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// General Components
import MemorialForm from "./components/MemorialForm";
import Header from "./components/Header";
import Footer from "./components/Footer";
import IslamicQuotes from "./components/IslamicQuotes";
import CemeterySupervisors from "./CemeterySupervisors";
import HallsSupervisors from "./HallsSupervisors";
import Login from "./login";
import Register from "./register";
import PrayerRequestForm from "./components/forms/PrayerRequestForm";
import PrayerTimeForm from "./components/forms/PrayerTimeForm";

function App() {
  const [selectedCategory, setSelectedCategory] =
    useState("death_announcement");

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-islamic-pattern">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <IslamicQuotes selectedCategory={selectedCategory} />
                  <MemorialForm onCategoryChange={setSelectedCategory} />
                </>
              }
            />
            <Route
              path="/cemetery-supervisors"
              element={<CemeterySupervisors />}
            />
            <Route
              path="/halls-supervisors-numbers"
              element={<HallsSupervisors />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/prayer-request" element={<PrayerRequestForm />} />
            <Route path="/prayer-times" element={<PrayerTimeForm />} />
          </Routes>
        </main>

        <Footer />

        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={true}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          toastClassName="toast-success"
        />
      </div>
    </Router>
  );
}

export default App;
