import React from 'react';

const WorkCard = ({ icon, label,desc}) => {
  return (
    <div className="work-card">
      <div className="work-icon">{icon}</div>
      <div className="work-label">{label}</div>
      <div className="work-desc">{desc}</div>

    </div>
  );
};

export default WorkCard;
