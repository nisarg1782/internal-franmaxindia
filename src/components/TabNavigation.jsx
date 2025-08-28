import React from 'react';

const TabNavigation = ({ activeTab, onTabChange }) => {
  return (
    <div className="tab-nav">
      <button
        className={activeTab === 'build' ? 'active' : ''}
        onClick={() => onTabChange('build')}
      >
        Build Your Own Brand
      </button>
      <button
        className={activeTab === 'franchise' ? 'active' : ''}
        onClick={() => onTabChange('franchise')}
      >
        Select Right Franchise For You
      </button>
    </div>
  );
};

export default TabNavigation;
