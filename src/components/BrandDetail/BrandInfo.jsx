// // src/components/BrandDetail/BrandInfo.jsx
// import React from 'react';
// import '../design/brandDetail.css';

// const BrandInfo = ({ brand }) => {
//   return (
//     <div className="brand-info">
//       <h2>{brand.name}</h2>
//       <p className="price">Investment: ₹{brand.investment.toLocaleString()}</p>
//       <p>{brand.description}</p>
//       <ul>
//         <li><strong>Founded:</strong> {brand.founded}</li>
//         <li><strong>Category:</strong> {brand.category}</li>
//         <li><strong>Location:</strong> {brand.location}</li>
//       </ul>
//     </div>
//   );
// };
// export default BrandInfo;







// src/components/BrandDetail/BrandInfo.jsx
// src/components/BrandDetail/BrandInfo.jsx
import React from "react";
import "../design/brandDetail.css";

const BrandInfo = ({ brand }) => (
  <div className="brand-info">
    <h2>{brand.name ?? "N/A"}</h2>
    <p className="price">
      Investment: ₹
      {brand.investment && !isNaN(brand.investment)
        ? Number(brand.investment).toLocaleString()
        : "N/A"}
    </p>
    <p>{brand.description ?? "No description available."}</p>
    <ul>
      <li><strong>Founded:</strong> {brand.founded ?? "N/A"}</li>
      <li><strong>Category:</strong> {brand.category_name ?? "N/A"}</li>
      <li><strong>Location:</strong> {brand.location ?? "N/A"}</li>
    </ul>
  </div>
);

export default BrandInfo;
