// import React, { useState, useEffect } from "react";

// // Mock CSS for styling the page
// const mockCss = `
//   body { font-family: sans-serif; }
//   .brand-detail-page { max-width: 1200px; margin: 0 auto; padding: 2rem; background: #f9fafb; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
//   .loading-state, .error-state, .no-data-state { text-align: center; padding: 2rem; font-size: 1.25rem; color: #6b7280; }
//   .detail-page-connect-btn { position: fixed; bottom: 2rem; right: 2rem; z-index: 50; padding: 0.75rem 1.5rem; background-color: #3b82f6; color: white; font-weight: 600; border-radius: 9999px; box-shadow: 0 4px 14px rgba(0,0,0,0.2); transition: all 0.3s ease; }
//   .detail-page-connect-btn:hover { transform: scale(1.05); background-color: #2563eb; }
//   .main-section { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 2rem; }
//   @media (min-width: 768px) { .main-section { flex-direction: row; } }
//   .slider-container { flex: 1; position: relative; }
//   .main-image img { width: 100%; height: auto; border-radius: 12px; }
//   .thumbnail-row { display: flex; gap: 0.5rem; margin-top: 1rem; overflow-x: auto; }
//   .thumbnail { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; cursor: pointer; border: 2px solid transparent; transition: border-color 0.3s ease; }
//   .thumbnail.active { border-color: #3b82f6; }
//   .main-details { flex: 1; }
//   .main-details h1 { font-size: 2.5rem; font-weight: 700; color: #1f2937; }
//   .short-desc { font-size: 1.1rem; color: #4b5563; margin-top: 0.5rem; }
//   .key-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 1.5rem; }
//   .key-stats div { background: #e5e7eb; padding: 1rem; border-radius: 8px; }
//   .key-stats span { font-weight: 600; color: #1f2937; }
//   .category-section { display: flex; justify-content: space-around; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
//   .category-card { background: #ffffff; padding: 1.5rem; border-radius: 12px; text-align: center; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); flex: 1; min-width: 200px; }
//   .category-card h2 { font-size: 1.25rem; font-weight: 600; color: #3b82f6; }
//   .brand-details h2, .expansion-map h2, .features-section h2, .why-choose h2, .similar-brands h2 { font-size: 2rem; font-weight: 700; margin-bottom: 1.5rem; color: #1f2937; text-align: center; }
//   .brand-details p { font-size: 1rem; color: #4b5563; line-height: 1.6; margin-bottom: 1rem; }
//   .expansion-map { margin-bottom: 2rem; }
//   .map-container { border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
//   .map-container img { width: 100%; height: auto; border-radius: 12px; }
//   .map-desc { text-align: center; margin-top: 1rem; font-style: italic; color: #6b7280; }
//   .features-section { margin-bottom: 2rem; }
//   .feature-row { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 2rem; }
//   @media (min-width: 768px) { .feature-row { flex-direction: row; align-items: center; } .feature-row.image-right { flex-direction: row-reverse; } }
//   .feature-image img { width: 100%; border-radius: 12px; }
//   .feature-desc { flex: 1; }
//   .feature-desc h3 { font-size: 1.5rem; font-weight: 600; color: #1f2937; margin-bottom: 0.5rem; }
//   .why-choose { margin-bottom: 2rem; }
//   .why-choose ul { list-style: none; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1rem; }
//   .why-choose li { background: #e5e7eb; padding: 1rem; border-radius: 8px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
//   .similar-brands { margin-bottom: 2rem; overflow: hidden; }
//   .slider-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
//   .brand-slider { display: flex; gap: 1rem; padding-bottom: 1rem; }
//   .brand-card { flex-shrink: 0; width: 250px; background: #ffffff; padding: 1rem; border-radius: 12px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); text-align: center; }
//   .brand-card img { width: 100%; height: auto; border-radius: 8px; }
//   .brand-card h3 { font-size: 1.1rem; font-weight: 600; margin-top: 0.5rem; }
//   .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 100; }
//   .modal-content { background: white; padding: 2rem; border-radius: 12px; position: relative; max-width: 500px; width: 90%; }
//   .modal-close { position: absolute; top: 1rem; right: 1rem; font-size: 1.5rem; border: none; background: none; cursor: pointer; }
// `;

// // Helper function to append CSS to the document head
// function appendMockCss() {
//   const styleElement = document.getElementById('mock-css-styles');
//   if (!styleElement) {
//     const styleSheet = document.createElement("style");
//     styleSheet.id = 'mock-css-styles';
//     styleSheet.innerText = mockCss;
//     document.head.appendChild(styleSheet);
//   }
// }

// // Ensure the CSS is appended when the component is mounted
// appendMockCss();

// // Mock ConnectMeModal component for a self-contained example
// const ConnectMeModal = ({ show, onClose, brandId }) => {
//   if (!show) return null;
//   return (
//     <div className="modal-overlay" onClick={onClose}>
//       <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//         <button className="modal-close" onClick={onClose}>&times;</button>
//         <h2 className="text-xl font-bold mb-4">Connect with Brand {brandId}</h2>
//         <p>This is a modal to connect with the brand.</p>
//       </div>
//     </div>
//   );
// };

// const IMAGE_BASE_URL = "https://example.com/assets/"; // Mock base URL for the provided image filenames

// const BrandDetailPage = () => {
//   // Brand data state
//   const [brandData, setBrandData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Gallery slider state
//   const [currentIndex, setCurrentIndex] = useState(0);

//   // Connect Me modal state
//   const [showConnectModal, setShowConnectModal] = useState(false);

//   // --- API Fetch Logic ---
//   useEffect(() => {
//     const fetchBrandData = async () => {
//       try {
//         const response = await fetch("http://localhost/fet_product_details.php");
//         if (!response.ok) {
//           throw new Error(HTTP error! status: ${response.status});
//         }
//         const apiResponse = await response.json();

//         if (apiResponse.success && apiResponse.brands.length > 0) {
//           setBrandData(apiResponse.brands[0]);
//         } else {
//           setBrandData(null);
//         }
//       } catch (e) {
//         console.error("Failed to fetch brand data:", e);
//         setError(e.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchBrandData();
//   }, []);

//   // prevent background scroll when modal open
//   useEffect(() => {
//     if (showConnectModal) {
//       document.body.style.overflow = "hidden";
//     } else {
//       document.body.style.overflow = "";
//     }
//     return () => {
//       document.body.style.overflow = "";
//     };
//   }, [showConnectModal]);

//   // Auto change main gallery every 3s
//   const imageGallery =
//     brandData?.images
//       ?.filter((img) => img.photo_type.startsWith("detailImage"))
//       .map((img) => ${IMAGE_BASE_URL}${img.photo_url}) || [];

//   useEffect(() => {
//     if (imageGallery.length > 1) {
//       const interval = setInterval(() => {
//         setCurrentIndex((prev) => (prev + 1) % imageGallery.length);
//       }, 3000);
//       return () => clearInterval(interval);
//     }
//   }, [imageGallery.length]);

//   // --- Derived Data ---
//   if (loading) {
//     return <div className="loading-state">Loading brand details...</div>;
//   }

//   if (error) {
//     return (
//       <div className="error-state">
//         Error loading data: {error}. Please try again later.
//       </div>
//     );
//   }

//   if (!brandData) {
//     return <div className="no-data-state">No brand data found for this ID.</div>;
//   }

//   // Mock data for similar brands section to prevent errors
//   const brands = [
//     { name: "Brand A", img: "https://placehold.co/150x150/ff6666/ffffff", desc: "Similar brand description." },
//     { name: "Brand B", img: "https://placehold.co/150x150/66cc66/ffffff", desc: "Similar brand description." },
//     { name: "Brand C", img: "https://placehold.co/150x150/6699ff/ffffff", desc: "Similar brand description." },
//   ];

//   // Get brand images
//   const primaryImage = brandData.images.find(
//     (img) => img.photo_type === "primaryImage"
//   );
//   const listingImage = brandData.images.find(
//     (img) => img.photo_type === "listingImage"
//   );
//   const logoImage = brandData.images.find((img) => img.photo_type === "logo");
//   const detailImage1 = brandData.images.find(
//     (img) => img.photo_type === "detailImage1"
//   );
//   const detailImage2 = brandData.images.find(
//     (img) => img.photo_type === "detailImage2"
//   );
  
//   return (
//     <div className="brand-detail-page">
//       {/* Load Leaflet CSS from a CDN link tag for the map to work correctly */}
//       {/* This link is no longer needed since we are not using leaflet. Keeping it commented out for reference. */}
//       {/* <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
//         integrity="sha256-p41B+7Q7A0DqO5E2S6P/lV3wFvC9jF+N2dC3s+H2tJg="
//         crossOrigin="" /> */}

//       {/* ===== Floating Connect Me Button (fixed inside detail page) ===== */}
//       <button
//         className="detail-page-connect-btn"
//         onClick={() => setShowConnectModal(true)}
//         aria-label="Connect Me"
//       >
//         Connect Me
//       </button>

//       {/* ===== Top Main Section with Thumbnails ===== */}
//       <section className="main-section">
//         <div className="slider-container">
//           <div className="main-image">
//             <img
//               src={
//                 imageGallery.length > 0
//                   ? imageGallery[currentIndex]
//                   : `${IMAGE_BASE_URL}${
//                       primaryImage?.photo_url || listingImage?.photo_url
//                     }`
//               }
//               alt="Brand Main"
//               className="big-image"
//             />
//           </div>

//           <div className="thumbnail-row">
//             {imageGallery.map((img, index) => (
//               <img
//                 key={index}
//                 src={${IMAGE_BASE_URL}${img.photo_url}}
//                 alt={thumb-${index}}
//                 className={`thumbnail ${
//                   currentIndex === index ? "active" : ""
//                 }`}
//                 onClick={() => setCurrentIndex(index)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* Brand Details */}
//         <div className="main-details">
//           <h1>{brandData.name}</h1>
//           <p className="short-desc">
//             {brandData.sector}, {brandData.category_name.replace(/\r\n/g, "")},{" "}
//             {brandData.subcategory_name.replace(/\r\n/g, "")}.
//           </p>
//           <div className="key-stats">
//             <div>
//               <span>Area:</span> {brandData.min_area}–{brandData.max_area} sq.ft
//             </div>
//             <div>
//               <span>Investment:</span> ₹{brandData.min_investment}–₹
//               {brandData.max_investment}
//             </div>
//             <div>
//               <span>No of Outlets:</span> {brandData.total_outlets}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ===== Category Section ===== */}
//       <section className="category-section">
//         <div className="category-card">
//           <h2>Sector</h2>
//           <p>{brandData.sector}</p>
//         </div>
//         <div className="category-card">
//           <h2>Category</h2>
//           <p>{brandData.category_name.replace(/\r\n/g, "")}</p>
//         </div>
//         <div className="category-card">
//           <h2>Sub-category</h2>
//           <p>{brandData.subcategory_name.replace(/\r\n/g, "")}</p>
//         </div>
//       </section>

//       {/* ===== Brand Details ===== */}
//       <section className="brand-details">
//         <h2>About {brandData.name}</h2>
//         <p>
//           {/* Note: The API data does not contain a founder name. Using a generic sentence. */}
//           This brand was established in {brandData.master_unit_details?.start_year || "a recent year"} and has rapidly grown to{" "}
//           {brandData.total_outlets} outlets.
//         </p>
//         <p>
//           Franchise partners receive comprehensive support, including site
//           selection, training, marketing, and ongoing operational assistance to
//           ensure success.
//         </p>
//       </section>

//       {/* ===== Expansion Map ===== */}
//       <section className="expansion-map">
//         <h2>Expansion Map</h2>
//         <div className="map-container">
//           {/* Replaced the interactive map with a static placeholder image */}
//           <img src="https://placehold.co/800x500/e5e7eb/4b5563?text=Expansion+Map+Coming+Soon" alt="Expansion Map" />
//         </div>
//         <p className="map-desc">
//           Current operational outlets and expansion plans across major Indian
//           cities.
//         </p>
//       </section>

//       {/* ===== Features Section (using API images) ===== */}
//       <section className="features-section">
//         {/* First feature - Image Right */}
//         <div className="feature-row image-right">
//           <div className="feature-image">
//             <img
//               src={${IMAGE_BASE_URL}${detailImage1?.photo_url}}
//               alt="Brand Feature"
//             />
//           </div>
//           <div className="feature-desc">
//             <h3>Key Feature 1</h3>
//             <p>
//               This section can dynamically load a description of a key feature
//               or aspect of the brand, using the images fetched from the API.
//             </p>
//           </div>
//         </div>

//         {/* Second feature - Image Left */}
//         <div className="feature-row image-left">
//           <div className="feature-image">
//             <img
//               src={${IMAGE_BASE_URL}${detailImage2?.photo_url}}
//               alt="Brand Feature"
//             />
//           </div>
//           <div className="feature-desc">
//             <h3>Key Feature 2</h3>
//             <p>
//               Here you can highlight another important aspect of the brand's
//               business model, product, or support system.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* ===== Why Choose Section (using generic data) ===== */}
//       <section className="why-choose">
//         <h2>Why Choose {brandData.name}</h2>
//         <ul>
//           <li>Proven business model with a payback period of{" "}
//           {brandData.single_unit_details?.payback} years.</li>
//           <li>A strong brand with an investment range of ₹
//           {brandData.single_unit_details?.investment}.</li>
//           <li>Support in marketing, training, and operations.</li>
//           <li>Continuous innovation and business growth.</li>
//         </ul>
//       </section>

//       {/* ===== Similar Brands (using your existing data) ===== */}
//       <section className="similar-brands">
//         <h2>Similar Brands</h2>
//         <div className="slider-wrapper">
//           <div className="brand-slider slow-scroll">
//             {[...brands, ...brands].map((brand, index) => (
//               <div className="brand-card" key={index}>
//                 <img src={brand.img} alt={brand.name} />
//                 <h3>{brand.name}</h3>
//                 <p>{brand.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* ===== Modal Mount ===== */}
//       {showConnectModal && (
//         <ConnectMeModal
//           show={showConnectModal}
//           onClose={() => setShowConnectModal(false)}
//           brandId={brandData.register_id}
//         />
//       )}
//     </div>
//   );
// };

// export default BrandDetailPage;