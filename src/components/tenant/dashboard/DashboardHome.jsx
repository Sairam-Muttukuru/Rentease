import React, { useState } from 'react';
import { Menu, Calendar, Clock } from 'lucide-react';
import { useTheme } from "../../../context/ThemeContext";
import RentOverviewCard from './RentOverviewCard';
import StatsCards from './StatsCards';
import MyPropertyCard from './MyPropertyCard';
import HomeServicesTeaser from './HomeServicesTeaser';
import UsageChart from './UsageChart';
import ImportantContacts from './ImportantContacts';
import RecentActivity from './RecentActivity';
import VacateCard from './VacateCard';
import PropertyRules from './PropertyRules';
import RecentPaymentsPreview from './RecentPaymentsPreview';
import RecentComplaintsPreview from './RecentComplaintsPreview';
import RequestedServices from './RequestedServices';
import ChatWindow from '../../chat/ChatWindow';

const DashboardHome = ({
    user,
    isSidebarOpen,
    setIsSidebarOpen,
    isPaid,
    isOverdue,
    currentRentDue,
    nextDueDateDisplay,
    setPaymentType,
    setShowPaymentModal,
    activeComplaintsCount,
    dashboardNotifications,
    propertyImages,
    currentImageIndex,
    navigate,
    payments,
    complaints,
    serviceRequests,
    fetchTenantData
}) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';
    const [isChatOpen, setIsChatOpen] = useState(false);

    // Construct landlord recipient object
    const landlordRecipient = {
        name: user?.landlord || "Property Manager",
        avatar_url: null, // Placeholder or fetch if available
        role: "landlord"
    };

    return (
        <div className="space-y-8">
            {/* ... existing header code ... */}

            {/* Header with Gradient Text & Notification Bell */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                    {/* Sidebar Toggle Button */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className={`p-2 rounded-lg transition-colors md:hidden ${isDarkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}
                    >
                        <Menu size={24} />
                    </button>

                    <div className="relative">
                        <h1 className={`text-3xl font-bold tracking-tight mb-2 transition-colors duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            Welcome back, <span className={`${isDarkMode ? 'text-violet-400' : 'text-violet-600'}`}>{(user.name || "User").split(' ')[0]}</span>!
                        </h1>
                        <p className={`text-base transition-colors duration-500 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            Here's your rental overview
                        </p>
                    </div>

                </div>

                {/* Notifications Section */}
                <div className="flex items-center gap-4">
                    {/* Next Due Date Widget */}
                    <div className={`hidden md:flex flex-col items-end px-4 py-2 rounded-xl transition-all duration-500 border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-100/50 border-slate-200'}`}>
                        <p className={`text-xs font-medium uppercase tracking-wider ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>Next Due Date</p>
                        <div className="flex items-center gap-2">
                            <Calendar size={14} className={isDarkMode ? 'text-violet-400' : 'text-violet-600'} />
                            <p className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{nextDueDateDisplay}</p>
                        </div>
                    </div>

                    {/* Highlighted Notification */}
                    {!isPaid && (
                        <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium animate-pulse ${isOverdue ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'}`}>
                            <Clock size={14} />
                            {isOverdue ? 'Rent Overdue' : 'Rent Due Soon'}
                        </div>
                    )}
                </div>
            </div>

            {/* Upcoming Payment / Reminders Card */}
            {!isPaid && (
                <RentOverviewCard
                    isPaid={isPaid}
                    isOverdue={isOverdue}
                    currentRentDue={currentRentDue}
                    nextDueDateDisplay={nextDueDateDisplay}
                    setPaymentType={setPaymentType}
                    setShowPaymentModal={setShowPaymentModal}
                />
            )}

            {/* Stats Row */}
            <StatsCards
                user={user}
                isPaid={isPaid}
                activeComplaintsCount={activeComplaintsCount}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left Column Stack */}
                <div className="flex flex-col gap-8">
                    <MyPropertyCard
                        user={user}
                        propertyImages={propertyImages}
                        currentImageIndex={currentImageIndex}
                        navigate={navigate}
                        isDarkMode={isDarkMode}
                    />

                    <HomeServicesTeaser navigate={navigate} />

                    <UsageChart user={user} isPaid={isPaid} />
                </div>

                {/* Right Column: Information Stack */}
                <div className="flex flex-col gap-8">
                    <ImportantContacts user={user} onChatClick={() => setIsChatOpen(true)} />

                    <RequestedServices
                        serviceRequests={serviceRequests}
                        fetchTenantData={fetchTenantData}
                    />

                    <RecentActivity dashboardNotifications={dashboardNotifications} />

                    <VacateCard />

                    <PropertyRules />

                    <RecentPaymentsPreview payments={payments} navigate={navigate} />

                    <RecentComplaintsPreview complaints={complaints} navigate={navigate} />

                </div>
            </div>

            {/* Chat Window */}
            <ChatWindow
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                recipient={landlordRecipient}
                isDarkMode={isDarkMode}
                currentUserRole="tenant"
            />
        </div >
    );
};

export default DashboardHome;
