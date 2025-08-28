import React, { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import Header from './components/Header';
import Footer from './components/Footer';
import Spinner from './components/Spinner';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './admin/ProtectedRoute';
import ProtectedBrandRoute from './brand/ProtectedRoute';
import CategoryPage from "./components/CategoryPage";
import BrandListing from "./pages/BrandListing";
import ProductDetail from "./pages/ProductDetail";


// === LAZY-LOAD ALL PAGE COMPONENTS ===
const LazyHomePage = lazy(() => import('./pages/HomePage'));
const LazyBrandDetail = lazy(() => import('./pages/BrandDetailPage'));
const LazyBrandListing = lazy(() => import('./pages/BrandListing'));
const LazyAboutPage = lazy(() => import('./components/AboutPage'));
const LazyCookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const LazyPrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const LazyTermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const LazyPaymentTerms = lazy(() => import('./pages/PaymentTerms'));
const LazyTeamPage = lazy(() => import('./components/Team/TeamPage'));
const LazyBrandDashboard = lazy(() => import('./brand/BrandDashboard'));
const LazyBrandInquiries = lazy(() => import('./brand/BrandInquiries'));
const LazyBrandProfile = lazy(() => import('./brand/BrandProfile'));
const LazySellBusinessPage = lazy(() => import('./components/Business/SellBusinessPage'));
const LazyContact = lazy(() => import('./pages/ContactUs'));
const LazyPlanPage = lazy(() => import('./brand/PricingPlans'));
const LazyUploadDocs = lazy(() => import('./brand/UploadDocs'));
const LazyAdminLogin = lazy(() => import('./admin/AdminLogin'));
const LazyBusinessList = lazy(() => import('./components/BusinessList'));
const LazyBusinessDetail = lazy(() => import('./components/BusinessDetail'));
const LazyLeasePropertyForm = lazy(() => import('./components/Property/LeasePropertyPage'));
const LazyPropertyList = lazy(() => import('./components/LeaseList'));
const LazyPropertyDetail = lazy(() => import('./components/LeaseDetails'));
const LazyMarketing = lazy(() => import('./components/Marketing'));
const LazyPartner = lazy(() => import('./components/Partner'));
const LazyAdminDashboard = lazy(() => import('./admin/Dashboard'));
const LazyMarketingInquiries = lazy(() => import('./admin/MarketingInquiries'));
const LazyBuyPropertyInquiries = lazy(() => import('./admin/BuyPropertyInquiries'));
const LazyRealEstateServices = lazy(() => import('./components/RealEstateServices'));
const LazyFranchiseDevelopment = lazy(() => import('./components/FranchiseDevelopment'));
const ConsultingPage = lazy(() => import('./components/ConsultingPage'));
const FranchisePage = lazy(() => import('./components/FranchisePage'));
const LazyFranchiseListing = lazy(() => import('./components/FranchiseListing'));
const LazyInvestorForm = lazy(() => import('./admin/AddInvestorForm'));
const LazyInvestorTable = lazy(() => import('./admin/InvestorPage'));
const LazyLeadsPage = lazy(() => import('./admin/LeadsPage'));
const LazyBrandSpecificInquiries = lazy(() => import('./admin/BrandInquiries'));
const LazyBrandList = lazy(() => import('./admin/BrandList'));
const UserList = lazy(() => import('./admin/UserList'));
const LazyDeniedPage = lazy(() => import('./admin/DeniedPage'));
const LazySellBusinessInquiries = lazy(() => import('./admin/SellBusinessInquiries'));
const LazyLeaseProperties = lazy(() => import('./admin/LeaseProperties'));
const LazyPartnerInquiries = lazy(() => import('./admin/PartnerInquiries'));
const LazyAdminNewsletter = lazy(() => import('./admin/Newsletter'));
const LazyAdminFaq = lazy(() => import('./admin/Faqpage'));
const LazyFaqs = lazy(() => import('./components/Faqs'));
const LazyInvestorDashboardPage = lazy(() => import('./investor/DashboardPage'));
const LazyInvestorSidebar = lazy(() => import('./investor/Sidebar'));
const LazyEventPage = lazy(() => import('./components/EventPage'));
const AdminEventPage = lazy(() => import("./admin/EventRegisterPage"));
const LazyInvestorProfile=lazy(()=>import("./investor/Profile"));
const LazyInvestorPricing=lazy(()=>import("./investor/PricingPlan"));
const LazyInvestorBrandListing = lazy(() => import('./investor/BrandsPage'));
// Component to handle redirection from the root path based on authentication status
const HomeRedirect = () => {
  const adminId = localStorage.getItem('adminId');
  if (adminId) {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return <Suspense fallback={<Spinner />}><LazyHomePage /></Suspense>;
};

function AppContent() {
  const location = useLocation();


  const hideLayoutRoutes = [
    '/brand/dashboard', '/brand/inquiries', '/brand/profile', '/pricing', '/brand/upload-docs',
    '/admin/login', '/admin/marketing-inquiries', '/admin/dashboard', '/admin/buy-business-inquiries',
    '/admin/add-investor', '/admin/investors', '/admin/leads', '/admin/brand-inquiries',
    '/admin/brand-list', '/user-list', '/denied', '/admin/sell-business-inquiries', '/admin/lease-properties', '/admin/partner-inquiries', '/admin/newsletter', '/admin/faq',
    '/investor-dashboard',"/admin/event","/investor-profile","/investor-pricing","/investor-brands"
  ];
  const shouldHideLayout = hideLayoutRoutes.includes(location.pathname);

  const FallbackSpinner = <Spinner />;

  return (
    <>
      {!shouldHideLayout && <Header />}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        <ScrollToTop />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/admin/login" element={<Suspense fallback={FallbackSpinner}><LazyAdminLogin /></Suspense>} />

        <Route path="/brands" element={<Suspense fallback={FallbackSpinner}><LazyBrandListing /></Suspense>} />
        <Route path="/brand/:id" element={<Suspense fallback={FallbackSpinner}><LazyBrandDetail /></Suspense>} />
        <Route path="/about" element={<Suspense fallback={FallbackSpinner}><LazyAboutPage /></Suspense>} />
        <Route path="/cookies-policy" element={<Suspense fallback={FallbackSpinner}><LazyCookiePolicy /></Suspense>} />
        <Route path="/privacy-policy" element={<Suspense fallback={FallbackSpinner}><LazyPrivacyPolicy /></Suspense>} />
        <Route path="/terms-of-use" element={<Suspense fallback={FallbackSpinner}><LazyTermsOfUse /></Suspense>} />
        <Route path="/payment-terms" element={<Suspense fallback={FallbackSpinner}><LazyPaymentTerms /></Suspense>} />
        <Route path="/our-team" element={<Suspense fallback={FallbackSpinner}><LazyTeamPage /></Suspense>} />
        <Route path="/sell-business" element={<Suspense fallback={FallbackSpinner}><LazySellBusinessPage /></Suspense>} />
        <Route path="/contact-us" element={<Suspense fallback={FallbackSpinner}><LazyContact /></Suspense>} />
        <Route path="/pricing" element={<Suspense fallback={FallbackSpinner}><LazyPlanPage /></Suspense>} />
        <Route path="/BusinessList" element={<Suspense fallback={FallbackSpinner}><LazyBusinessList /></Suspense>} />
        <Route path="/business/:id" element={<Suspense fallback={FallbackSpinner}><LazyBusinessDetail /></Suspense>} />
        <Route path="/lease-property" element={<Suspense fallback={FallbackSpinner}><LazyLeasePropertyForm /></Suspense>} />
        <Route path="/all-lease-properties" element={<Suspense fallback={FallbackSpinner}><LazyPropertyList /></Suspense>} />
        <Route path="/property/:id" element={<Suspense fallback={FallbackSpinner}><LazyPropertyDetail /></Suspense>} />
        <Route path="/marketing" element={<Suspense fallback={FallbackSpinner}><LazyMarketing /></Suspense>} />
        <Route path="/partner" element={<Suspense fallback={FallbackSpinner}><LazyPartner /></Suspense>} />
        <Route path="/real-estate-services" element={<Suspense fallback={FallbackSpinner}><LazyRealEstateServices /></Suspense>} />
        <Route path="/franchise-development" element={<Suspense fallback={FallbackSpinner}><LazyFranchiseDevelopment /></Suspense>} />
        <Route path="/consulting" element={<Suspense fallback={FallbackSpinner}><ConsultingPage /></Suspense>} />
        <Route path="/franchise" element={<Suspense fallback={FallbackSpinner}><FranchisePage /></Suspense>} />
        <Route path="/franchises/category/:categoryId" element={<Suspense fallback={FallbackSpinner}><LazyFranchiseListing /></Suspense>} />
        <Route path="/faqs" element={<Suspense fallback={FallbackSpinner}><LazyFaqs /></Suspense>} />
        <Route path="/event" element={<Suspense fallback={FallbackSpinner}><LazyEventPage /></Suspense>} />

        {/* <Route 
  path="/brand/:id" 
  element={
    <Suspense fallback={FallbackSpinner}>
      <LazyBrandDetail />
    </Suspense>
  }
/> */}



        {/* Protected Admin Routes - require specific permissions */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredPermissions={['view_dashboard']}>
              <Suspense fallback={FallbackSpinner}><LazyAdminDashboard /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/newsletter" element={
          <ProtectedRoute requiredPermissions={['view_newsletter']}>
            <Suspense fallback={FallbackSpinner}><LazyAdminNewsletter /></Suspense>
          </ProtectedRoute>
        } />
        <Route
          path="/user-list"
          element={
            <ProtectedRoute requiredPermissions={['view_users']}>
              <Suspense fallback={FallbackSpinner}><UserList /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/brand-list"
          element={
            <ProtectedRoute requiredPermissions={['view_brands']}>
              <Suspense fallback={FallbackSpinner}><LazyBrandList /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/investors"
          element={
            <ProtectedRoute requiredPermissions={['view_investors']}>
              <Suspense fallback={FallbackSpinner}><LazyInvestorTable /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/leads"
          element={
            <ProtectedRoute requiredPermissions={['view_leads']}>
              <Suspense fallback={FallbackSpinner}><LazyLeadsPage /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/brand-inquiries"
          element={
            <ProtectedRoute requiredPermissions={['view_brand_inquiries']}>
              <Suspense fallback={FallbackSpinner}><LazyBrandSpecificInquiries /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/marketing-inquiries"
          element={
            <ProtectedRoute requiredPermissions={['view_marketing_inquiries']}>
              <Suspense fallback={FallbackSpinner}><LazyMarketingInquiries /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/buy-business-inquiries"
          element={
            <ProtectedRoute requiredPermissions={['view_buy_business_inquiries']}>
              <Suspense fallback={FallbackSpinner}><LazyBuyPropertyInquiries /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/add-investor"
          element={
            <ProtectedRoute requiredPermissions={['add_investors']}>
              <Suspense fallback={FallbackSpinner}><LazyInvestorForm /></Suspense>
            </ProtectedRoute>
          }
        />
        <Route path="/admin/lease-properties" element={
          <ProtectedRoute requiredPermissions={['view_lease_properties']}>
            <Suspense fallback={FallbackSpinner}><LazyLeaseProperties /></Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/partner-inquiries" element={
          <ProtectedRoute requiredPermissions={['view_partner_inquiries']}>
            <Suspense fallback={FallbackSpinner}><LazyPartnerInquiries /></Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/faq" element={
          <ProtectedRoute requiredPermissions={['view_faq']}>
            <Suspense fallback={FallbackSpinner}><LazyAdminFaq /></Suspense>
          </ProtectedRoute>
        } />
        <Route path="/admin/event" element={
          <ProtectedRoute requiredPermissions={['view_events']}>         
          <Suspense fallback={FallbackSpinner}><AdminEventPage /></Suspense></ProtectedRoute>
        } />
        <Route
          path="/admin/sell-business-inquiries"
          element={
            <ProtectedRoute requiredPermissions={['view_sell_business_inquiries']}>
              <Suspense fallback={FallbackSpinner}><LazySellBusinessInquiries /></Suspense>
            </ProtectedRoute>
          }
        />



        {/* Protected Brand Dashboard Routes (if they also require admin login & specific permissions) */}
        <Route path="/denied" element={<Suspense fallback={FallbackSpinner}><LazyDeniedPage /></Suspense>} />

        <Route path="/brand/dashboard" element={<Suspense faallback={FallbackSpinner}><LazyBrandDashboard /></Suspense>} />
        <Route path="/brand/inquiries" element={<Suspense fallback={FallbackSpinner}><LazyBrandInquiries /></Suspense>} />
        <Route path="/brand/profile" element={<Suspense fallback={FallbackSpinner}><LazyBrandProfile /></Suspense>} />
        <Route path="/brand/upload-docs" element={<Suspense fallback={FallbackSpinner}><LazyUploadDocs /></Suspense>} />
        <Route path="/investor-dashboard" element={<Suspense fallback={FallbackSpinner}><LazyInvestorDashboardPage /></Suspense>} />
        <Route path="/investor-profile" element={<Suspense fallback={FallbackSpinner}><LazyInvestorProfile /></Suspense>} />
         <Route path="/investor-pricing" element={<Suspense fallback={FallbackSpinner}><LazyInvestorPricing /></Suspense>} />
      <Route path="/investor-brands" element={<Suspense fallback={FallbackSpinner}><LazyInvestorBrandListing /></Suspense>} />
      
        <Route path="/category" element={<CategoryPage />} />
      </Routes>

      {!shouldHideLayout && <Footer />}
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
