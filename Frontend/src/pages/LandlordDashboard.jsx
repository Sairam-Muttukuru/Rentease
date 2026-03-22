import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import {
  Building,
  Users,
  CreditCard,
  AlertCircle
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

// Layout & Common Components
import LandlordLayout from '../components/landlord/layout/LandlordLayout';

// View Components
import DashboardHome from '../components/landlord/dashboard/DashboardHome';
import LandlordPropertiesView from '../components/landlord/dashboard/LandlordPropertiesView';
import AddPropertyView from '../components/landlord/dashboard/AddPropertyView';
import LandlordTenantsView from '../components/landlord/dashboard/LandlordTenantsView';
import TenantDetailView from '../components/landlord/dashboard/TenantDetailView';
import LandlordRequestsView from '../components/landlord/dashboard/LandlordRequestsView';
import MaintenanceDetailsView from '../components/landlord/dashboard/MaintenanceDetailsView';
import LandlordBookingsView from '../components/landlord/dashboard/LandlordBookingsView';
import LandlordFinanceView from '../components/landlord/dashboard/LandlordFinanceView';
import SettingsView from '../components/landlord/dashboard/SettingsView';
import LandlordAnnouncementsView from '../components/landlord/dashboard/LandlordAnnouncementsView.jsx';
import LandlordMessagesView from '../components/landlord/dashboard/LandlordMessagesView';

// Modals
import EditPropertyModal from '../components/landlord/modals/EditPropertyModal';
import EditTenantModal from '../components/landlord/modals/EditTenantModal';
import AddTenantModal from '../components/landlord/modals/AddTenantModal';
import ImageGalleryModal from '../components/ui/ImageGalleryModal';
import ChatWindow from '../components/chat/ChatWindow';
import LandlordLoader from '../components/landlord/LandlordLoader';
import { initSocket, disconnectSocket } from '../utils/socket';

const INITIAL_USER = {
  name: "Landlord",
  email: "landlord@rentease.com",
};

export default function LandlordDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName } = useParams();
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const { logout: authLogout } = useAuth();

  // --- State Management ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [landlordProperties, setLandlordProperties] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [tenants, setTenants] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationToast, setNotificationToast] = useState(null);
  const [showInitialLoader, setShowInitialLoader] = useState(true);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      await axios.patch(`https://rentease-1-pwm5.onrender.com/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      await axios.patch(`https://rentease-1-pwm5.onrender.com/api/notifications/read-all`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const showNotificationToast = (message) => {
    setNotificationToast({ message });
    setTimeout(() => setNotificationToast(null), 3000);
  };

  // Modal & Selection State
  const [selectedTenantId, setSelectedTenantId] = useState(() => {
    const saved = localStorage.getItem('selectedTenantId');
    return saved ? parseInt(saved) : null;
  });
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // const [tenantToDelete, setTenantToDelete] = useState(null); // Removed for SweetAlert
  // const [isDeleteTenantModalOpen, setIsDeleteTenantModalOpen] = useState(false); // Removed for SweetAlert
  const [isEditTenantModalOpen, setIsEditTenantModalOpen] = useState(false);
  const [tenantToEdit, setTenantToEdit] = useState(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [selectedPropertyImages, setSelectedPropertyImages] = useState([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [isAddTenantModalOpen, setIsAddTenantModalOpen] = useState(false);
  const [prefillTenantData, setPrefillTenantData] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRecipient, setChatRecipient] = useState(null);

  // Tab management
  const pathParts = location.pathname.split('/').filter(Boolean);
  const lastSegment = pathParts[pathParts.length - 1];
  const knownTabs = ['properties', 'add-property', 'tenants', 'messages', 'requests', 'request-details', 'finance', 'settings', 'tenant-details', 'bookings', 'announcements'];
  const activeTab = knownTabs.includes(lastSegment) ? lastSegment : 'dashboard';

  const setActiveTab = (tab) => {
    let slug = userName;
    if (!slug) {
      const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
      slug = savedUser.name ? savedUser.name.toLowerCase().replace(/\s+/g, '-') : 'user';
    }
    const basePath = `/${slug}/landlord/dashboard`;
    navigate(tab === 'dashboard' ? basePath : `${basePath}/${tab}`);
  };

  // --- Effects ---
  useEffect(() => {
    if (user?.id) {
      initSocket(user.id);
    }
    return () => disconnectSocket();
  }, [user?.id]);

  useEffect(() => {
    if (selectedTenantId) {
      localStorage.setItem('selectedTenantId', selectedTenantId);
    } else {
      localStorage.removeItem('selectedTenantId');
    }
  }, [selectedTenantId]);

  useEffect(() => {
    fetchLandlordProperties();
    fetchTenants();
    fetchComplaints();
    fetchNotifications();
    fetchBookings();
    fetchPayments();
    // Poll for notifications, bookings, and payments
    const interval = setInterval(() => {
      fetchNotifications();
      fetchBookings();
      fetchPayments(); // Added polling for immediate reflection
    }, 15000); // Increased frequency to 15s for "immediate" feel
    return () => clearInterval(interval);
  }, []);

  // --- API Calls ---
  const fetchLandlordProperties = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await axios.get('https://rentease-1-pwm5.onrender.com/api/properties/myproperties', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const formatted = res.data.map(p => ({
        ...p,
        name: p.title,
        address: `${p.locality}, ${p.city}`,
        type: p.property_type,
        rent: p.price,
        units: `${p.tenant_count || 0} Units`,
        image: p.images?.find(img => img.is_cover)?.image_url || p.images?.[0]?.image_url || "https://via.placeholder.com/400"
      }));
      setLandlordProperties(formatted);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        handleLogout();
      }
    } finally {
      setLoadingProperties(false);
    }
  };

  const fetchTenants = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await axios.get('https://rentease-1-pwm5.onrender.com/api/tenants/all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTenants(res.data);
    } catch (error) {
      console.error("Error fetching tenants:", error);
    }
  };

  const fetchComplaints = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await axios.get('https://rentease-1-pwm5.onrender.com/api/complaints/landlord', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComplaints(res.data);
    } catch (error) {
      console.error("Error fetching complaints:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await axios.get('https://rentease-1-pwm5.onrender.com/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await axios.get('https://rentease-1-pwm5.onrender.com/api/bookings/landlord', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  };

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) return;
      const res = await axios.get('https://rentease-1-pwm5.onrender.com/api/payment/landlord-payments', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (error) {
      console.error("Failed to fetch payments", error);
    }
  };

  // --- Handlers ---
  const handleLogout = () => {
    authLogout(); // Clears context state (user = null) so Navbar re-renders immediately
    navigate("/");
  };

  const handleUpdateProperty = async (updatedData) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`https://rentease-1-pwm5.onrender.com/api/properties/${updatedData.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Property updated");
      setIsEditOpen(false);
      fetchLandlordProperties();
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    const result = await Swal.fire({
      title: 'Delete Property?',
      text: "Are you sure you want to delete this property? This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: isDarkMode ? '#1e293b' : '#ffffff',
      color: isDarkMode ? '#f8fafc' : '#0f172a',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`https://rentease-1-pwm5.onrender.com/api/properties/${propertyId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire({
          title: "Deleted!",
          text: "Property has been deleted.",
          icon: "success",
          background: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#f8fafc' : '#0f172a',
          confirmButtonColor: '#7c3aed'
        });

        setLandlordProperties(prev => prev.filter(p => p.id !== propertyId));
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: error.response?.data?.error || "Failed to delete property.",
          icon: "error",
          background: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#f8fafc' : '#0f172a',
          confirmButtonColor: '#7c3aed'
        });
      }
    }
  };

  const handleUpdateTenant = async (updatedData) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(`https://rentease-1-pwm5.onrender.com/api/tenants/${updatedData.id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Tenant updated");
      setIsEditTenantModalOpen(false);
      fetchTenants();
    } catch (error) {
      toast.error(error.response?.data?.error || "Update failed");
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    const result = await Swal.fire({
      title: 'Delete Tenant',
      text: "Are you sure you want to delete this tenant? This action will remove the tenant and all family members permanently.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7c3aed',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!',
      background: isDarkMode ? '#1e293b' : '#ffffff',
      color: isDarkMode ? '#f8fafc' : '#0f172a',
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("accessToken");
        await axios.delete(`https://rentease-1-pwm5.onrender.com/api/tenants/${tenantId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        Swal.fire({
          title: "Deleted!",
          text: "Tenant has been deleted.",
          icon: "success",
          background: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#f8fafc' : '#0f172a',
          confirmButtonColor: '#7c3aed'
        });

        setTenants(prev => prev.filter(t => t.id !== tenantId));
        fetchLandlordProperties(); // Sync units count
      } catch {
        Swal.fire({
          title: "Error!",
          text: "Failed to delete tenant.",
          icon: "error",
          background: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#f8fafc' : '#0f172a',
          confirmButtonColor: '#7c3aed'
        });
      }
    }
  };

  const handleUpdateComplaintStatus = (id, newStatus) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
  };

  const handleUpdatePaymentStatus = async (tenantId, currentStatus) => {
    const newStatus = currentStatus === 'PAID' ? 'UNPAID' : 'PAID';
    try {
      const token = localStorage.getItem("accessToken");
      const tenant = tenants.find(t => t.id === tenantId);
      if (!tenant) return;
      await axios.put(`https://rentease-1-pwm5.onrender.com/api/tenants/${tenantId}`, {
        ...tenant,
        payment_status: newStatus
      }, { headers: { Authorization: `Bearer ${token}` } });
      setTenants(prev => prev.map(t => t.id === tenantId ? { ...t, status: newStatus } : t));
      toast.success(`Payment marked as ${newStatus}`);
    } catch {
      toast.error("Failed to update payment status");
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status, visitSlot = null) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.patch(`https://rentease-1-pwm5.onrender.com/api/bookings/${bookingId}/status`,
        { status, visitSlot },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status, visit_slot: visitSlot } : b));
      toast.success(`Booking ${status}`);
    } catch (err) {
      toast.error("Failed to update booking status");
      console.error(err);
    }
  };

  // --- Stats Calculation ---
  const now = new Date();
  const currentMonthName = now.toLocaleString('default', { month: 'long' });
  const currentYear = now.getFullYear();
  const currentMonthZeroIndexed = now.getMonth();

  const currentMonthCollected = payments.filter(p => {
    // Determine year/month from local_date or parsed date
    let pYear, pMonth;
    if (p.local_date) {
        const parts = p.local_date.split('-');
        pYear = parseInt(parts[0]);
        pMonth = parseInt(parts[1]) - 1;
    } else {
        const d = new Date(p.date || p.payment_date);
        pYear = d.getFullYear();
        pMonth = d.getMonth();
    }
    
    const isCurrentMonth = pYear === currentYear && pMonth === currentMonthZeroIndexed;
    const isNotSecurityDeposit = !p.receipt_number?.startsWith('SEC-DEP');
    return isCurrentMonth && isNotSecurityDeposit;
  }).reduce((sum, p) => sum + parseFloat(p.amount), 0);

  // Total outstanding balance across all tenants (cumulative - what's owed, not just one month)
  const totalPendingBalance = tenants.reduce((sum, t) => sum + (parseFloat(t.balance_due) || 0), 0);

  const stats = [
    { label: 'Total Properties', value: landlordProperties.length, sub: `${landlordProperties.filter(p => !tenants.some(t => t.property_id === p.id)).length} Vacant Units`, icon: Building, color: 'bg-indigo-600' },
    { label: 'Leased Properties', value: tenants.length, sub: `${tenants.reduce((sum, t) => sum + (parseInt(t.members) || 0), 0)} Total Occupants`, icon: Users, color: 'bg-blue-600' },
    { 
      label: `${currentMonthName} Collection`, 
      value: `₹${currentMonthCollected.toLocaleString()}`, 
      sub: totalPendingBalance > 0 
        ? `₹${Math.round(totalPendingBalance).toLocaleString()} Still Pending` 
        : '✓ All Tenants Paid', 
      icon: CreditCard, 
      color: 'bg-emerald-600' 
    },
    { label: 'Pending Complaints', value: complaints.filter(c => c.status !== 'Resolved').length, sub: 'Needs Attention', icon: AlertCircle, color: 'bg-indigo-600' }
  ];

  if (showInitialLoader) {
    return <LandlordLoader onComplete={() => setShowInitialLoader(false)} isDarkMode={isDarkMode} />;
  }

  return (
    <LandlordLayout
      isDarkMode={isDarkMode}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      handleLogout={handleLogout}
      user={user}
      unreadCount={unreadCount}
      notifications={notifications}
      markAsRead={markAsRead}
      markAllAsRead={markAllAsRead}
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      isNotificationOpen={isNotificationOpen}
      setIsNotificationOpen={setIsNotificationOpen}
      notificationToast={notificationToast}
    >
      <div key={activeTab} className="animate-in fade-in slide-in-from-bottom-8 duration-700">
        {activeTab === 'dashboard' && (
          <DashboardHome
            stats={stats}
            notifications={notifications}
            landlordProperties={landlordProperties}
            loadingProperties={loadingProperties}
            isDarkMode={isDarkMode}
            setActiveTab={setActiveTab}
            tenants={tenants}
            complaints={complaints}
            payments={payments}
          />
        )}

        {activeTab === 'properties' && (
          <LandlordPropertiesView
            isDarkMode={isDarkMode}
            landlordProperties={landlordProperties}
            loadingProperties={loadingProperties}
            setActiveTab={setActiveTab}
            onEditClick={(prop) => { setSelectedProperty(prop); setIsEditOpen(true); }}
            onDeleteClick={(id) => handleDeleteProperty(id)}
            onGalleryClick={(prop) => {
              const images = (prop.images && prop.images.length > 0)
                ? prop.images.map(img => img.image_url)
                : [prop.image];
              setSelectedPropertyImages(images);
              setIsGalleryOpen(true);
            }}
          />
        )}

        {activeTab === 'add-property' && (
          <AddPropertyView
            isDarkMode={isDarkMode}
            onSuccess={() => { fetchLandlordProperties(); setActiveTab('properties'); }}
            showNotificationToast={showNotificationToast}
          />
        )}

        {activeTab === 'tenants' && (
          <LandlordTenantsView
            isDarkMode={isDarkMode}
            tenants={tenants}
            landlordProperties={landlordProperties}
            onEditClick={(t) => { setTenantToEdit(t); setIsEditTenantModalOpen(true); }}
            onDeleteClick={handleDeleteTenant}
            setSelectedTenantId={setSelectedTenantId}
            onSuccess={() => { fetchTenants(); fetchLandlordProperties(); }}
            setIsAddModalOpen={setIsAddTenantModalOpen}
            onViewDetails={(tenant) => {
              setSelectedTenantId(tenant.id);
              setActiveTab('tenant-details');
            }}
            onChatClick={(tenant) => {
              setChatRecipient(tenant);
              setIsChatOpen(true);
            }}
          />
        )}

        {activeTab === 'messages' && (
          <LandlordMessagesView
            isDarkMode={isDarkMode}
            tenants={tenants}
            currentUser={user}
          />
        )}

        {activeTab === 'tenant-details' && (
          <TenantDetailView
            isDarkMode={isDarkMode}
            tenants={tenants}
            selectedTenantId={selectedTenantId}
            setActiveTab={setActiveTab}
            setSelectedTenantId={setSelectedTenantId}
            showNotificationToast={showNotificationToast}
            onUpdateStatus={handleUpdatePaymentStatus}
            onChatClick={(tenant) => {
              setChatRecipient(tenant);
              setIsChatOpen(true);
            }}
          />
        )}

        {activeTab === 'requests' && (
          <LandlordRequestsView
            isDarkMode={isDarkMode}
            complaints={complaints}
            onViewDetails={(id) => { setSelectedComplaintId(id); setActiveTab('request-details'); }}
            onUpdateStatus={handleUpdateComplaintStatus}
          />
        )}

        {activeTab === 'request-details' && (
          <MaintenanceDetailsView
            isDarkMode={isDarkMode}
            complaint={complaints.find(c => c.id === selectedComplaintId)}
            onBack={() => setActiveTab('requests')}
            onUpdateStatus={handleUpdateComplaintStatus}
          />
        )}

        {activeTab === 'bookings' && (
          <LandlordBookingsView
            isDarkMode={isDarkMode}
            bookings={bookings}
            onUpdateStatus={handleUpdateBookingStatus}
            onRentToApplicant={(booking) => {
              setPrefillTenantData(booking);
              setIsAddTenantModalOpen(true);
            }}
          />
        )}

        {activeTab === 'announcements' && (
          <LandlordAnnouncementsView isDarkMode={isDarkMode} properties={landlordProperties} />
        )}

        {activeTab === 'finance' && (
          <LandlordFinanceView
            isDarkMode={isDarkMode}
            tenants={tenants}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsView
            user={user}
            isDarkMode={isDarkMode}
            handleLogout={handleLogout}
            onUpdateUser={setUser}
          />
        )}
      </div>

      {/* Modals */}
      <EditPropertyModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        property={selectedProperty}
        onUpdate={handleUpdateProperty}
        isDarkMode={isDarkMode}
      />



      <EditTenantModal
        isOpen={isEditTenantModalOpen}
        onClose={() => setIsEditTenantModalOpen(false)}
        tenant={tenantToEdit}
        onUpdate={handleUpdateTenant}
        isDarkMode={isDarkMode}
      />



      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        images={selectedPropertyImages}
        isDarkMode={isDarkMode}
      />

      <AddTenantModal
        isOpen={isAddTenantModalOpen}
        onClose={() => { setIsAddTenantModalOpen(false); setPrefillTenantData(null); }}
        properties={landlordProperties}
        onSuccess={() => { fetchTenants(); fetchLandlordProperties(); }}
        isDarkMode={isDarkMode}
        prefill={prefillTenantData}
      />

      {isChatOpen && chatRecipient && (
        <ChatWindow
          isOpen={isChatOpen}
          recipient={chatRecipient}
          onClose={() => { setIsChatOpen(false); setChatRecipient(null); }}
          isDarkMode={isDarkMode}
        />
      )}
    </LandlordLayout>
  );
}
