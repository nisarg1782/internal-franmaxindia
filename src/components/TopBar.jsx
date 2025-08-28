// src/components/TopBar.js
import React, { useState, useCallback } from "react";
import { FaUserPlus, FaSignInAlt } from "react-icons/fa";
import LoginModal from "./LoginModal/LoginModal";
import RegisterModal from "./RegisterModal/RegisterModal";
import InvestorFormModal from "./RegisterModal/InvestorForm";
import BrandFormModal from "./RegisterModal/BrandFormModal";
import PartnerFormModal from "./RegisterModal/PartnerFormModal";
import LeasingFormModal from "./RegisterModal/LeasingFormModal"; // ✅ NEW
import "./design/Header.css";
import logo from "../assets/logo/Franmax_logo.png";

export default function TopBar() {
  const [showLogin, setShowLogin] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [showInvestorModal, setShowInvestorModal] = useState(false);
  const [showBrandModal, setShowBrandModal] = useState(false);
  const [showPartnerModal, setShowPartnerModal] = useState(false);
  const [showLeasingModal, setShowLeasingModal] = useState(false); // ✅ NEW

  // 🔹 Centralized handlers with useCallback for performance
  const handleOpenRegister = useCallback(() => {
    setShowLogin(false);
    setIsRegisterOpen(true);
  }, []);

  const handleOpenLogin = useCallback(() => {
    setIsRegisterOpen(false);
    setShowLogin(true);
  }, []);

  const handleOpenInvestor = useCallback(() => {
    setIsRegisterOpen(false);
    setShowInvestorModal(true);
  }, []);

  const handleOpenBrand = useCallback(() => {
    setIsRegisterOpen(false);
    setShowBrandModal(true);
  }, []);

  const handleOpenPartner = useCallback(() => {
    setIsRegisterOpen(false);
    setShowPartnerModal(true);
  }, []);

  const handleOpenLeasing = useCallback(() => {
    setIsRegisterOpen(false);
    setShowLeasingModal(true);
  }, []);

  return (
    <>
      {/* ✅ Top Navigation Bar */}
      <header className="top-bar">
        {/* Logo Section */}
        <div className="top-left">
          <a href="/" aria-label="Franmax Home">
            <img src={logo} alt="Franmax Logo" className="logo-img" />
          </a>
        </div>

        {/* Right Section (Auth Actions) */}
        <nav className="top-right" aria-label="User actions">
          <button
            className="top-link-button"
            onClick={handleOpenRegister}
            aria-label="Open registration"
          >
            <FaUserPlus aria-hidden="true" /> Register
          </button>

          <button
            className="top-link-button"
            onClick={handleOpenLogin}
            aria-label="Open login"
          >
            <FaSignInAlt aria-hidden="true" /> Login
          </button>
        </nav>
      </header>

      {/* 🔐 Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        openRegister={handleOpenRegister}
      />

      {/* 📝 Register Modal */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        openLogin={handleOpenLogin}
        openInvestor={handleOpenInvestor}
        openBrand={handleOpenBrand}
        openPartner={handleOpenPartner}
        openLeasing={handleOpenLeasing} // ✅ Leasing trigger
      />

      {/* 👤 Investor Registration */}
      <InvestorFormModal
        isOpen={showInvestorModal}
        onClose={() => setShowInvestorModal(false)}
        onBack={() => {
          setShowInvestorModal(false);
          setIsRegisterOpen(true);
        }}
        openLogin={handleOpenLogin}
      />

      {/* 🏢 Brand Registration */}
      <BrandFormModal
        isOpen={showBrandModal}
        onClose={() => setShowBrandModal(false)}
        onBack={() => {
          setShowBrandModal(false);
          setIsRegisterOpen(true);
        }}
        openLogin={handleOpenLogin}
      />

      {/* 🤝 Partner Registration */}
      <PartnerFormModal
        isOpen={showPartnerModal}
        onClose={() => setShowPartnerModal(false)}
        onBack={() => {
          setShowPartnerModal(false);
          setIsRegisterOpen(true);
        }}
        openLogin={handleOpenLogin}
      />

      {/* 🏠 Leasing Property Registration */}
      <LeasingFormModal
        isOpen={showLeasingModal}
        onClose={() => setShowLeasingModal(false)}
        onBack={() => {
          setShowLeasingModal(false);
          setIsRegisterOpen(true);
        }}
      />
    </>
  );
}
