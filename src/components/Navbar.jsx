import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import TabFilters from "./TabFilters";
import SideMenu from "./sidemenu/SideMenuTabs";
import "./design/Header.css";

const servicesSubmenu = [
  { name: "Consulting", path: "/consulting" },
  { name: "Franchise Expansion", path: "/franchise" },
  { name: "Business Exchange", path: "/sell-business" },
  { name: "Real Estate", path: "/lease-property" },
  { name: "Marketing", path: "/marketing" },
];

function Navbar() {
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const dropdownRef = useRef(null);

  // Closes dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggles the main "Services" dropdown
  const toggleServicesDropdown = useCallback(() => {
    setActiveDropdown((prev) => (prev === "services" ? null : "services"));
  }, []);

  const handleCloseSideMenu = useCallback(() => {
    setShowMenu(false);
  }, []);

  const handleOpenModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="nav-left">
          {/* Hamburger (Mobile) */}
          <div
            className="hamburger-icon"
            onClick={() => setShowMenu(true)}
            role="button"
            aria-label="Open menu"
          >
            ☰
          </div>

          {/* Main Links */}
          <Link to="/" className="nav-icon">
            🏠
          </Link>
          <Link to="/sell-business">Sell Business</Link>
          <Link to="/lease-property">Lease Property</Link>
          <Link to="/partner">Become Partner</Link>
          <Link to="/faqs">FAQ</Link>

          {/* External Link - use <a> for external site */}
          <a
            href="https://www.franxpo.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Events
          </a>

          {/* Services Dropdown */}
          <div className="services-dropdown-wrapper" ref={dropdownRef}>
            <span
              className="dropdown-trigger"
              onClick={toggleServicesDropdown}
              role="button"
            >
              Services ▾
            </span>
            {activeDropdown !== null && (
              <div className="dropdown-menu">
                {servicesSubmenu.map((item, index) => (
                  <div key={index} className="dropdown-item-has-submenu">
                    <Link
                      to={item.path}
                      className="dropdown-item"
                      onClick={(e) => {
                        if (item.submenu) {
                          e.preventDefault();
                          setActiveDropdown(
                            activeDropdown === item.name
                              ? "services"
                              : item.name
                          );
                        } else {
                          setActiveDropdown(null);
                        }
                      }}
                    >
                      {item.name} {item.submenu ? "▸" : ""}
                    </Link>
                    {activeDropdown === item.name && item.submenu && (
                      <div className="submenu">
                        {item.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            to={subItem.path}
                            className="submenu-item"
                            onClick={() => setActiveDropdown(null)}
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="nav-right">
          <div
            className="nav-search-icon"
            onClick={handleOpenModal}
            role="button"
            aria-label="Open search"
          >
            🔍
          </div>
        </div>
      </nav>

      {/* Search Modal Popup */}
      {showModal && (
        <div className="search-modal-overlay">
          <div className="search-modal">
            <button className="close-modal" onClick={handleCloseModal}>
              ✖
            </button>
            <TabFilters />
          </div>
        </div>
      )}

      {/* Side Menu */}
      <SideMenu isOpen={showMenu} onClose={handleCloseSideMenu} />
    </>
  );
}

export default Navbar;
