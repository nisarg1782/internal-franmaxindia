import React, { useState } from 'react';
import TabNavigation from './TabNavigation';
import TabContent from './TabContent';
import './design/Consulting.css';

const ConsultingPage = () => {
  const [activeTab, setActiveTab] = useState('build');

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <div className="consulting-container">
      <h1 className="consulting-heading">Franmax India Consulting Services</h1>
      <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <TabContent activeTab={activeTab} />
    </div>
  );
};

export default ConsultingPage;
