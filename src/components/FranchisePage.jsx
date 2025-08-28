import React, { useState } from 'react';
import TabNavigation from './FranchiseTabNavigation';
import TabContent from './FranchiseTabContent';
import './design/Franchise.css';

const FranchisePage = () => {
  const [activeTab, setActiveTab] = useState('expansion');

  return (
    <div className="franchise-container">
      <h1 className="franchise-heading">Franmax India Franchise Services</h1>
      <TabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <TabContent activeTab={activeTab} />
    </div>
  );
};

export default FranchisePage;
