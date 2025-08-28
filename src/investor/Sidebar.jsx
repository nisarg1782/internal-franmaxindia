import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, DollarSign, BarChart2, Users, Settings, LogOut, Home, CircleUser } from 'lucide-react';
import './Sidebar.css';
 const sessionData = localStorage.getItem('investor_session');
  const userData = JSON.parse(sessionData);
  if(!userData) {
    window.location.href = '/';
  }

const navItems = [
    { name: 'Dashboard', icon: <Home />, href: '/investor-dashboard' },
    { name: 'Franchisees', icon: <Users />, href: '#franchisees' },
    { name: 'Pricing', icon: <DollarSign />, href: '/investor-pricing' },
    { name: 'Brands', icon: <BarChart2 />, href: '/investor-brands' },
    { name: 'Profile', icon: <CircleUser />, href: '/investor-profile' },
];

const Sidebar = ({ onLogout }) => {
    const handleLogout = (e) => {
        e.preventDefault();
        // Remove the specific investor session key from local storage
        localStorage.removeItem('investor_session');
        // Call the parent's logout function
        onLogout();
    };

    return (
        <motion.aside 
            className="sidebar"
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <div className="sidebar-header">
                <Briefcase size={32} className="logo-icon" />
                <h1 className="logo-title">Welcome,{userData.name}</h1>
            </div>
            <nav className="sidebar-nav">
                <ul>
                    {navItems.map((item, index) => (
                        <li key={index}>
                            <a href={item.href} className="nav-link">
                                {item.icon}
                                <span className="nav-link-text">{item.name}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="sidebar-footer">
                <a href="#settings" className="nav-link">
                    <Settings />
                    <span className="nav-link-text">Settings</span>
                </a>
                <a href="#" className="nav-link logout-link" onClick={handleLogout}>
                    <LogOut />
                    <span className="nav-link-text">Logout</span>
                </a>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
