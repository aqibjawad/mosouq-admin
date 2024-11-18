import React, { useState, useRef, useEffect } from "react";
import "./header.desktop.css";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";

const LoggedInHeader = ({ user }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate('/');
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="admin-header">
      <div className="header-container">
        <div className="logo">
          <div className="mosouq-logo-tag">
            Mosouq Admin
          </div>
        </div>
        <nav className={`nav-links ${menuOpen ? "open" : ""}`}>
          <Link style={{textDecoration:'none'}} to="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>

          <div className="profile-dropdown" ref={dropdownRef}>
            <div onClick={toggleDropdown} style={{ cursor: "pointer" }}>
              Profile
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="profile-image">
                  <img src="/person.png" alt="Profile" />
                </div>
                <Link to="/profile-settings" onClick={() => { toggleDropdown(); setMenuOpen(false); }}> Profile Settings </Link>
                <Link to="/privacy-settings" onClick={() => { toggleDropdown(); setMenuOpen(false); }}> Change Password </Link>
                {/* <Link to="/account-settings" onClick={() => { toggleDropdown(); setMenuOpen(false); }}> Account Settings </Link> */}
              </div>
            )}
          </div>
          <div className="logout-button" onClick={handleLogout} style={{ cursor: "pointer" }}>
            Log out
          </div>
        </nav>
        <div className="menu-icon" onClick={toggleMenu}>
          {menuOpen ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
        </div>
      </div>
    </header>
  );
};

export default LoggedInHeader;