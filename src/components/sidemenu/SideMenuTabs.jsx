import React, { useState } from 'react';
import CategoryDrawer from './CategoryDrawer';
import StateCityDrawer from './StateList'; // or StateCityDrawer
import InvestmentDrawer from './InvestmentDrawer'; // 👈 create this new component
import '../../components/design/sidemenu.css';

export default function SideMenu({ isOpen, onClose }) {
  const [showCategory, setShowCategory] = useState(true);
  const [showState, setShowState] = useState(true);
  const [showInvestment, setShowInvestment] = useState(true); // 👈 New

  if (!isOpen) return null;

  return (
    <>
      <div className="side-overlay" onClick={onClose}></div>
      <div className="side-menu open">
        <div className="side-content">
          <button className="close-side-menu" onClick={onClose}>✖</button>

          {/* Browse by Category */}
          <div className="side-section">
            <div className="section-header">
              <h3 className="section-title">Browse by Category</h3>
              <button
                className="toggle-section"
                onClick={() => setShowCategory(prev => !prev)}
              >
                {showCategory ? '−' : '+'}
              </button>
            </div>
            {showCategory && <CategoryDrawer />}
          </div>

          {/* Browse by Location */}
          <div className="side-section">
            <div className="section-header">
              <h3 className="section-title">Browse by Location</h3>
              <button
                className="toggle-section"
                onClick={() => setShowState(prev => !prev)}
              >
                {showState ? '−' : '+'}
              </button>
            </div>
            {showState && <StateCityDrawer />}
          </div>

          {/* Browse by Investment */}
          <div className="side-section">
            <div className="section-header">
              <h3 className="section-title">Browse by Investment</h3>
              <button
                className="toggle-section"
                onClick={() => setShowInvestment(prev => !prev)}
              >
                {showInvestment ? '−' : '+'}
              </button>
            </div>
            {showInvestment && <InvestmentDrawer />}
          </div>
        </div>
      </div>
    </>
  );
}
