import React from 'react';
import './HomePage.css';
import TopBrands from '../components/TopBrands';
import BannerCarousel from '../components/BannerCarousel';
import NewsSection from '../components/NewsSection';
import YoutubeSection from '../components/YoutubeSection';
import SellYourBusinessCards from '../components/SellYourBusinessCards';
import LeasePropertiesDisplay from '../components/LeasePropertiesDisplay';
import { getApiUrl } from '../utils/api'; // ✅ import the utility
import FranchiseListing from '../components/FranchiseListing';

function HomePage() {
  return (
    <div className="home-container">
      <BannerCarousel />
      
      {/* Top Franchising Opportunities - View All Link points to category 1 */}
      <TopBrands
        apiUrl={getApiUrl('get-premium-brands.php')}
        sectionTitle="Top Franchising Opportunities"
        viewAllLink="/franchises/category/1"
      />
      
      {/* Trending Franchising Opportunities - View All Link points to category 2 */}
      <TopBrands
        apiUrl={getApiUrl('get-top-brands.php')}
        sectionTitle="Trending Franchising Opportunities"
        viewAllLink="/franchises/category/3"
      />
      
      {/* Popular Franchising Opportunities - View All Link points to category 3 */}
      <TopBrands
        apiUrl={getApiUrl('get-featured-brands.php')}
        sectionTitle="Popular Franchising Opportunities"
        viewAllLink="/franchises/category/2"
      />

      <SellYourBusinessCards />
      <LeasePropertiesDisplay />
      <NewsSection />
      {/* <YoutubeSection /> */}
    </div>
  );
}

export default HomePage;