import { useEffect } from 'react'
import Landing from './pages/Landing'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import VerifyOtp from './components/VerifyOtp';
import ResetPassword from './components/ResetPassword';
import './App.css'
import LandlordDashboard from './pages/LandlordDashboard';
import PropertyBrowse from './pages/PropertyBrowse';
import TenantDashboard from './pages/TenantDashboard';
import View from './pages/View'
import Forbidden403 from './pages/Forbidden403';
import NotFound404 from './pages/NotFound404';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRedirect from './components/DashboardRedirect';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './context/ThemeContext';
import Adminpage from './pages/Adminpage';
import ServiceProvider from './pages/ServiceProvider';
import HomeServices from './pages/HomeServices';
// import LandlordDashboard from './components/LandlordDashboard';
function App() {
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "accessToken" || e.key === "user") {
        window.location.reload();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          {/* <Route path="/browse/properties" element={<PropertyBrowse/>}/>  */}
          <Route path="/browse/properties" element={<View />} />
          <Route
            path="/:userName/tenant/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["tenant"]}>
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
              <ProtectedRoute allowedRoles={["tenant"]}>
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
          <Route path="/admin/dashboard" element={<Adminpage />} />
          <Route path="/service-provider/dashboard" element={<ServiceProvider />} />
          <Route path="/home-services" element={<HomeServices />} />
        </Routes>
      </BrowserRouter>
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
