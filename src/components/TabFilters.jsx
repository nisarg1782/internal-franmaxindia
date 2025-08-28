import React, { useState } from 'react';
import './design/Header.css';
import CategoriesTab from './tabs/CategoriesTab';
import LocationTab from './tabs/LocationTab';
import InvestmentTab from './tabs/InvestmentTab';

function TabFilters() {
  const [activeTab, setActiveTab] = useState('categories');

  const renderTab = () => {
    switch (activeTab) {
      case 'categories': return <CategoriesTab />;
      case 'location': return <LocationTab />;
      case 'investment': return <InvestmentTab />;
      default: return null;
    }
  };

  return (
    <div className="tab-filter-container">
      <div className="tab-header">
        <div className={activeTab === 'categories' ? 'tab active' : 'tab'} onClick={() => setActiveTab('categories')}>Categories</div>
        <div className={activeTab === 'location' ? 'tab active' : 'tab'} onClick={() => setActiveTab('location')}>Location</div>
        <div className={activeTab === 'investment' ? 'tab active' : 'tab'} onClick={() => setActiveTab('investment')}>Investment</div>
      </div>
      <div className="tab-content">{renderTab()}</div>
    </div>
  );
}

export default TabFilters;
