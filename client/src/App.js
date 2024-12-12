import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import TopBar from './components/TopBar';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/customer/ProfileComponent';
import HomePage from './components/HomePage';
import CartPage from './components/Products/CartPage';
import CheckoutPage from './components/Products/Checkout';
import OrderTrackingPage from './components/customer/OrderTracking';
import TrackOrder from './components/customer/TrackOrder';
import AdminComponent from './components/Admin/AdminComponent';
import { UserProvider } from './components/context/UserContext';
import AdminOrders from './components/Admin/AdminOrders';
import AdminUsers from './components/Admin/AdminUsers';
import AdminMenuApproval from './components/Admin/AdminMenuApproval';
import AdminDelivery from './components/Admin/AdminDelivery';
import AdminAnalytics from './components/Admin/AdminAnalytics';
import OrdersComponent from './components/Business/OrdersComponent';
import MenuManagementComponent from './components/Business/MenuManagementComponent';
import ProfileComponent from './components/Business/ProfileComponent';
import PromotionsComponent from './components/Business/PromotionsComponent';
import ResetPassword from './components/ResetPassword';
import LandingPage from './components/LandingPage/LandingPage';
import LandingPageHeader from './components/LandingPage/Header';
import DriverDashboard from './components/Driver/Dashboard';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const App = () => {
  const location = useLocation();

  // Determine if the current route is the Landing Page
  const isLandingPage = location.pathname === '/';

  // Determine if the current route is part of the Driver's Dashboard
  const isDriverDashboard = location.pathname.startsWith('/driver/');

  return (
    <UserProvider>
      {/* Conditional Rendering for Headers and Sidebars */}
      {isLandingPage ? (
        <LandingPageHeader /> // Header for the Landing Page
      ) : isDriverDashboard ? null : ( // No header for Driver's Dashboard (handled in the component itself)
        <>
          <TopBar /> {/* TopBar for all other routes */}
          {/* <Navbar /> */}
        </>
      )}

      <Routes>
        {/* Define valid static login routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/customer" element={<Login userType="customer" />} />
        <Route path="/login/admin" element={<Login userType="admin" />} />
        <Route path="/login/business" element={<Login userType="business" />} />
        <Route path="/login/driver" element={<Login userType="driver" />} />

        {/* Redirect any invalid login path back to a default valid path */}
        <Route path="/login/*" element={<Navigate to="/login/customer" replace />} />

        {/* Other routes */}
        <Route path="/register/customer" element={<Register userType="customer" />} />
        <Route path="/register/admin" element={<Register userType="admin" />} />
        <Route path="/register/business" element={<Register userType="business" />} />
        <Route path="/register/driver" element={<Register userType="driver" />} />

        <Route path="/customer/profile" element={<Profile />} />
        <Route path="/customer/home" element={<HomePage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Checkout and Order Tracking Routes */}
        <Route path="/checkout/" element={<CheckoutPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />
        <Route path="/track-order/:orderId" element={<TrackOrder />} />

        <Route path="/admin/dashboard" element={<AdminComponent />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/menuapprovals" element={<AdminMenuApproval />} />
        <Route path="/admin/delivery" element={<AdminDelivery />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />

        <Route path="/business/dashboard" element={<AdminComponent />} />
        <Route path="/business/orders" element={<OrdersComponent />} />
        <Route path="/business/menumanagement" element={<MenuManagementComponent />} />
        <Route path="/business/promotions" element={<PromotionsComponent />} />
        <Route path="/business/profile" element={<ProfileComponent />} />

        <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />

        {/* Driver's Dashboard Routes */}
        <Route path="/driver/dashboard" element={<DriverDashboard />} />

        {/* Fallback route: Redirect any other invalid path to the homepage */}
        <Route path="*" element={<Navigate to="/login/customer" replace />} />
      </Routes>
      <ToastContainer />
    </UserProvider>
  );
};

export default App;
