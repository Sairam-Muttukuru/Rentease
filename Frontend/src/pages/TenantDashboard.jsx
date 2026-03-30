/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import BASE_URL from '../utils/apiConfig';

// Layout
import TenantLayout from '../components/tenant/layout/TenantLayout';

// Pages/Views
import DashboardHome from '../components/tenant/dashboard/DashboardHome';
import MyPropertyView from '../components/tenant/dashboard/MyPropertyView';
import PaymentsPage from '../components/tenant/payments/PaymentsPage';
import ComplaintsPage from '../components/tenant/complaints/ComplaintsPage';
import ComplaintDetail from '../components/tenant/complaints/ComplaintDetail';
import TenantSettings from '../components/tenant/settings/TenantSettings';
import TenantHomeServices from './TenantHomeServices';
import NoticeBoardPage from '../components/tenant/community/NoticeBoardPage';
import TenantMessagesView from '../components/tenant/dashboard/TenantMessagesView';

// Modals
import ChangePasswordModal from '../components/tenant/modals/ChangePasswordModal';
import PaymentModal from '../components/tenant/modals/PaymentModal';
import ComplaintModal from '../components/tenant/modals/ComplaintModal';
import PreLoader from '../components/ui/PreLoader';
import { initSocket, disconnectSocket } from '../utils/socket';

// Initialize Stripe lazily
let stripePromise = null;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export default function TenantDashboard() {
  const { t, i18n } = useTranslation();
  const { userName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  // Use AuthContext to get the actual logged-in user (could be landlord)
  const { user: authUser } = useAuth();
  const isLandlordViewing = authUser?.role?.toLowerCase() === 'landlord';

  // --- App State ---
  // tenantData holds the data for the tenant dashboard being viewed
  const [tenantData, setTenantData] = useState(() => {
    const saved = localStorage.getItem("user");
    const initialValue = saved ? JSON.parse(saved) : {
      name: "",
      email: "",
      phone: "",
      propertyName: "",
      address: "",
      landlord: "",
      monthlyRent: 0,
      leaseStart: "",
      leaseEnd: "",
      familyMembers: 0,
      members: [],
      propertiesCount: 0,
      rentDueDay: 5,
      latePenaltyAmount: 500,
      avatar_url: "",
      allProperties: []
    };
    return initialValue;
  });

  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [rentDue, setRentDue] = useState(0);

  // UI State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentType, setPaymentType] = useState('RENT');
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [dashboardNotifications, setDashboardNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Property Slider & Settings State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [propertyImages, setPropertyImages] = useState([]);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [complaintImages, setComplaintImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // --- Derived State (Improved for Accuracy) ---
  const today = new Date();
  const unpaidCount = tenantData.unpaid_months_count || 0;
  const isPaid = unpaidCount <= 0;
  const isOverdue = !isPaid;

  // Compute next due date display reliably on the client using anchor date
  const computeNextDueDateDisplay = () => {
    const backend = tenantData.next_due_date_display;
    const anchorRaw = tenantData.rent_due_date || tenantData.start_date;
    if (!anchorRaw) return backend || '';

    const anchor = new Date(anchorRaw);
    const fmt = (d) => d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

    // Walk forward through billing cycles until we find the right one
    for (let i = 0; i < 36; i++) {
      const cs = new Date(anchor);
      cs.setMonth(anchor.getMonth() + i);
      const ce = new Date(cs);
      ce.setMonth(cs.getMonth() + 1);

      if (isPaid) {
        // Show next FUTURE cycle (after today)
        if (cs > today) return `${fmt(cs)} - ${fmt(ce)}`;
      } else {
        // Show the current active cycle (cs <= today < ce)
        if (cs <= today && ce > today) return `${fmt(cs)} - ${fmt(ce)}`;
      }
    }
    return backend || '';
  };

  const nextDueDateDisplay = computeNextDueDateDisplay();
  const activeComplaintsCount = complaints.filter(c => c.status !== 'Resolved').length;

  // --- Effects ---
  useEffect(() => {
    if (tenantData?.id) {
      initSocket(tenantData.id);
    }
    return () => disconnectSocket();
  }, [tenantData?.id]);

  useEffect(() => {
    fetchTenantData();
  }, [userName]); // Re-fetch if userName param changes

  const handlePropertyChange = (propertyId) => {
    const selectedProperty = tenantData.allProperties?.find(p => p.id === parseInt(propertyId));
    if (selectedProperty) {
      setTenantData(prev => ({
        ...prev,
        ...selectedProperty,
        allProperties: prev.allProperties // Ensure list persists
      }));
      // Reset dependent states
      const due = selectedProperty.accumulated_due || 0;
      setRentDue(Math.max(0, Math.round(due * 100) / 100));
      setPropertyImages(selectedProperty.propertyImages || []);
      toast.success(`Switched to ${selectedProperty.property_name}`);
    }
  };

  const fetchTenantData = async () => {
    setIsLoading(true);
    const startTime = Date.now();
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      // Optimized: Fetch data directly without artificial delay
      const [userRes, paymentsRes, complaintsRes] = await Promise.all([
        axios.get(`${BASE_URL}/api/tenants/dashboard${userName ? `?userName=${userName}` : ''}`, { headers }),
        axios.get(`${BASE_URL}/api/tenants/payments${userName ? `?userName=${userName}` : ''}`, { headers }),
        axios.get(`${BASE_URL}/api/tenants/complaints${userName ? `?userName=${userName}` : ''}`, { headers })
      ]);

      setTenantData({
        ...userRes.data,
        rentDueDate: userRes.data.rentDueDate || 0,
        allProperties: userRes.data.allProperties || []
      });

      // Only overwrite the "user" session if the logged-in person IS the tenant
      if (!isLandlordViewing) {
        localStorage.setItem("user", JSON.stringify(userRes.data));
      }

      setPayments(paymentsRes.data);
      setComplaints(complaintsRes.data);

      const now = new Date();
      const rentDay = userRes.data.rentDueDay || 5;
      let nextDue = new Date();
      nextDue.setDate(rentDay);
      if (now.getDate() > rentDay) {
        nextDue.setMonth(nextDue.getMonth() + 1);
      }

      const diffTime = nextDue - now;
      const daysUntilDue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const lastPayment = paymentsRes.data.length > 0 ? paymentsRes.data[0] : null;
      const totalDue = userRes.data.accumulated_due || 0;
      // Clamp to 0 for the payment button amount, but keep the raw value for isPaid logic
      setRentDue(Math.max(0, Math.round(totalDue * 100) / 100));
      setPropertyImages(userRes.data.propertyImages || []);

    } catch (err) {
      console.error("Error fetching data:", err);
      if (err.response && err.response.status === 401) {
        navigate("/");
      }
    } finally {
      const elapsedTime = Date.now() - startTime;
      const hasLoadedBefore = localStorage.getItem(`tenant_loaded_${userName}`);
      const minWaitTime = hasLoadedBefore ? 0 : 5000;
      
      if (elapsedTime < minWaitTime) {
        setTimeout(() => {
          setIsLoading(false);
          localStorage.setItem(`tenant_loaded_${userName}`, 'true');
        }, minWaitTime - elapsedTime);
      } else {
        setIsLoading(false);
        localStorage.setItem(`tenant_loaded_${userName}`, 'true');
      }
    }
  };

  // --- Handlers ---
  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout`, {}, { withCredentials: true });
      localStorage.clear();
      toast.success("Logged out successfully");
      setTimeout(() => window.location.href = "/", 1000);
    } catch (err) {
      localStorage.clear();
      window.location.href = "/";
    }
  };

  const handleUpdateProfile = async () => {
    setIsUpdatingProfile(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`${BASE_URL}/api/tenants/profile`, {
        full_name: tenantData.name,
        email: tenantData.email,
        phone: tenantData.phone,
        avatar_url: tenantData.avatar_url
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Profile updated successfully!");
      // Update local state and storage if not landlord
      if (!isLandlordViewing) {
        const stored = JSON.parse(localStorage.getItem("user"));
        localStorage.setItem("user", JSON.stringify({ ...stored, ...tenantData }));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setIsUpdatingPassword(true);
    try {
      const token = localStorage.getItem("accessToken");
      await axios.post(`${BASE_URL}/api/auth/change-password`, {
        currentPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      }, { headers: { Authorization: `Bearer ${token}` } });

      toast.success("Password updated successfully");
      setShowChangePasswordModal(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.error || err.response?.data?.message || "Failed to update password");
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setComplaintImages(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index) => {
    setComplaintImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData(e.target);
      const complaintData = {
        title: formData.get('title'),
        category: formData.get('category'),
        priority_level: formData.get('priority_level'),
        description: formData.get('description'),
        images: complaintImages
      };

      const res = await axios.post(`${BASE_URL}/api/complaints`, complaintData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Optimistically prepend the new complaint to local state — no full reload needed
      const newComplaint = {
        ...res.data,
        images: complaintImages,
        date: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'OPEN'
      };
      setComplaints(prev => [newComplaint, ...prev]);

      toast.success("Complaint submitted successfully!");
      
      // Close modal and reset state
      setShowComplaintModal(false);
      setComplaintImages([]);
      e.target.reset();
    } catch (err) {
      console.error(err);
      toast.error("Failed to submit complaint");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`${BASE_URL}/api/complaints/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Complaint marked as ${status}`);
      fetchTenantData();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (isLoading) {
    return <PreLoader userName={tenantData.name} isDarkMode={isDarkMode} />;
  }

  return (
    <TenantLayout
      isSidebarOpen={isSidebarOpen}
      setIsSidebarOpen={setIsSidebarOpen}
      isDarkMode={isDarkMode}
      user={authUser || tenantData}
      handleLogout={handleLogout}
      userName={userName}
      unreadCount={unreadCount}
      isNotificationsOpen={isNotificationsOpen}
      setIsNotificationsOpen={setIsNotificationsOpen}
      dashboardNotifications={dashboardNotifications}
      location={location}
      allProperties={tenantData.allProperties}
      handlePropertyChange={handlePropertyChange}
    >
      <Routes>
        <Route path="/" element={
          <DashboardHome
            user={tenantData}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            isPaid={isPaid}
            isOverdue={isOverdue}
            currentRentDue={rentDue}
            unpaidMonthsCount={tenantData.unpaid_months_count || 0}
            nextDueDateDisplay={nextDueDateDisplay}
            setPaymentType={setPaymentType}
            setShowPaymentModal={setShowPaymentModal}
            activeComplaintsCount={activeComplaintsCount}
            dashboardNotifications={dashboardNotifications}
            propertyImages={propertyImages}
            currentImageIndex={currentImageIndex}
            navigate={navigate}
            payments={payments}
            complaints={complaints}
            serviceRequests={tenantData.serviceRequests || []}
            fetchTenantData={fetchTenantData}
            allProperties={tenantData.allProperties}
            handlePropertyChange={handlePropertyChange}
          />
        } />
        <Route path="/my-property" element={
          <MyPropertyView
            isDarkMode={isDarkMode}
            user={tenantData}
            propertyImages={propertyImages}
            currentImageIndex={currentImageIndex}
            setCurrentImageIndex={setCurrentImageIndex}
            prevImage={() => setCurrentImageIndex(curr => curr === 0 ? propertyImages.length - 1 : curr - 1)}
            nextImage={() => setCurrentImageIndex(curr => curr === propertyImages.length - 1 ? 0 : curr + 1)}
            setPaymentType={setPaymentType}
            setShowPaymentModal={setShowPaymentModal}
          />
        } />
        <Route path="/notices" element={<NoticeBoardPage />} />
        <Route path="/payments" element={<PaymentsPage payments={payments} />} />
        <Route path="/complaints" element={
          <ComplaintsPage
            complaints={complaints}
            isDarkMode={isDarkMode}
            navigate={navigate}
            userName={userName}
            setShowComplaintModal={setShowComplaintModal}
            handleUpdateStatus={handleUpdateStatus}
          />
        } />
        <Route path="/complaints/:id" element={
          <ComplaintDetail
            complaints={complaints}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
            navigate={navigate}
            userName={userName}
            handleUpdateStatus={handleUpdateStatus}
          />
        } />
        <Route path="/settings" element={
          <TenantSettings
            user={tenantData}
            setUser={setTenantData}
            isDarkMode={isDarkMode}
            setShowChangePasswordModal={setShowChangePasswordModal}
            handleUpdateProfile={handleUpdateProfile}
            isUpdatingProfile={isUpdatingProfile}
            t={t}
            i18n={i18n}
          />
        } />
        <Route path="/services" element={<TenantHomeServices tenantData={tenantData} />} />
        <Route path="/messages" element={
          <TenantMessagesView 
            isDarkMode={isDarkMode} 
            currentUser={authUser || tenantData}
            allProperties={tenantData.allProperties}
          />
        } />
      </Routes>

      {showChangePasswordModal && (
        <ChangePasswordModal
          isDarkMode={isDarkMode}
          setShowChangePasswordModal={setShowChangePasswordModal}
          handlePasswordUpdate={handlePasswordUpdate}
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          isUpdatingPassword={isUpdatingPassword}
          t={t}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          isDarkMode={isDarkMode}
          setShowPaymentModal={setShowPaymentModal}
          rentDue={rentDue}
          user={tenantData}
          stripePromise={getStripe()}
          paymentType={paymentType}
        />
      )}

      {showComplaintModal && (
        <ComplaintModal
          isDarkMode={isDarkMode}
          setShowComplaintModal={setShowComplaintModal}
          handleSubmitComplaint={handleSubmitComplaint}
          handleImageChange={handleImageChange}
          complaintImages={complaintImages}
          handleRemoveImage={handleRemoveImage}
          isUploading={isUploading}
          t={t}
        />
      )}
    </TenantLayout>
  );
}
