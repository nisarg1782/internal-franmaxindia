import React from 'react';

const WorkList = ({ items }) => {
  return (
    <ul className="work-list">
      {items.map((item, index) => (
        <li key={index}>✔️ {item}</li>
      ))}
    </ul>
  );
};

export default WorkList;
