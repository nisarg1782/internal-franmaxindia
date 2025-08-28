import React from 'react';
import './design/Header.css';
import TopBar from './TopBar';
import Navbar from './Navbar';



function Header() {
  return (
    <header className="main-header">
      <TopBar />
      <Navbar />

    </header>
  );
}

export default Header;
