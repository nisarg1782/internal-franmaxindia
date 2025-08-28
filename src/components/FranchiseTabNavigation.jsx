import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  return (
    <div className="tab-nav">
      {['expansion', 'model', 'auditing'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={activeTab === tab ? 'active' : ''}
        >
          {tab === 'expansion' && 'Expansion'}
          {tab === 'model' && 'Model Making'}
          {tab === 'auditing' && 'Auditing'}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;
