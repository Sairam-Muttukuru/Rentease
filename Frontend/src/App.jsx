import { Suspense, lazy, useEffect, useState } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';
import { RentEaseLoader } from './pages/Wel';
const Landing = lazy(() => import('./pages/Landing'));
const LoginPage = lazy(() => import('./components/LoginPage'));
const Signup = lazy(() => import('./components/Signup'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const VerifyOtp = lazy(() => import('./components/VerifyOtp'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const LandlordDashboard = lazy(() => import('./pages/LandlordDashboard'));
const PropertyBrowse = lazy(() => import('./pages/PropertyBrowse'));
const PropertyDetails = lazy(() => import('./pages/PropertyDetails'));
const TenantDashboard = lazy(() => import('./pages/TenantDashboard'));
const Loader = lazy(() => import('./pages/Loader'));
const Adminpage = lazy(() => import('./pages/Adminpage'));
const ServiceProvider = lazy(() => import('./pages/ServiceProvider'));
const HomeServices = lazy(() => import('./pages/HomeServices'));
const Forbidden403 = lazy(() => import('./pages/Forbidden403'));
const NotFound404 = lazy(() => import('./pages/NotFound404'));

// Minimal loading fallback for Suspense
const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [showWelcome, setShowWelcome] = useState(() => {
    // Check if welcome has been shown in this session
    return !sessionStorage.getItem('welcomeShown');
  });

  // The storage listener is now handled centrally in AuthContext heart

  const handleWelcomeComplete = () => {
    sessionStorage.setItem('welcomeShown', 'true');
    setShowWelcome(false);
  };

  if (showWelcome) {
    return <RentEaseLoader onComplete={handleWelcomeComplete} />;
  }

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/loader" element={<Loader />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/browse/properties" element={<PropertyBrowse />} />
              <Route path="/properties/:id" element={<PropertyDetails />} />
              {/* <Route path="/browse/properties" element={<View />} /> */}
              <Route
                path="/:userName/tenant/dashboard/*"
                element={
                  <ProtectedRoute>
                    <TenantDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/landlord/dashboard"
                element={
                  <ProtectedRoute allowedRoles={["landlord"]}>
                    <DashboardRedirect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tenant/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRedirect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/:userName/landlord/dashboard/*"
                element={
                  <ProtectedRoute allowedRoles={["landlord"]}>
                    <LandlordDashboard />
                  </ProtectedRoute>
                }
              />

              <Route path="/403/forbidden" element={<Forbidden403 />} />
              <Route path="*" element={<NotFound404 />} />
              <Route path="/admin/dashboard/*" element={<Adminpage />} />
              <Route path="/service-provider/dashboard/*" element={<ServiceProvider />} />
              <Route path="/home-services" element={<HomeServices />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>

      {/* <TenantDashboard/> */}
      {/* <LandlordDashboard/> */}
      <ToastContainer
        position="top-center"
        autoClose={3000}      // toast disappears after 3 seconds
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </ThemeProvider>
  )
}

export default App
