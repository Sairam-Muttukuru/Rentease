import React, { useState } from 'react';
import { Menu, Calendar, Clock, Building } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import TenantAnnouncementsWidget from './TenantAnnouncementsWidget';
import QuickActions from './QuickActions';
import RentOverviewCard from './RentOverviewCard';
import StatsCards from './StatsCards';
import MyPropertyCard from './MyPropertyCard';
import HomeServicesTeaser from './HomeServicesTeaser';
import UsageChart from './UsageChart';
import RecentActivity from './RecentActivity';
import PropertyRules from './PropertyRules';
import RecentComplaintsPreview from './RecentComplaintsPreview';
import ImportantContacts from './ImportantContacts';
import RequestedServices from './RequestedServices';
import VacateCard from './VacateCard';
import RecentPaymentsPreview from './RecentPaymentsPreview';

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
    fetchTenantData,
    unpaidMonthsCount
}) => {
    const { theme } = useTheme();
    const isDarkMode = theme === 'dark';


    return (
        <div className="space-y-8">
            {/* ... existing header code ... */}

            {/* Header with Gradient Text & Notification Bell */}
            {/* Header Notifications Only */}
            <div className="flex justify-end items-center mb-6">
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
            <RentOverviewCard
                isPaid={isPaid}
                isOverdue={isOverdue}
                currentRentDue={currentRentDue}
                unpaidMonthsCount={unpaidMonthsCount}
                pendingMonths={user?.pending_months || []}
                pendingMonthsRanges={user?.pending_months_ranges || []}
                nextDueDateDisplay={nextDueDateDisplay}
                setPaymentType={setPaymentType}
                setShowPaymentModal={setShowPaymentModal}
            />

            {/* Stats Row */}
            <StatsCards
                user={user}
                isPaid={isPaid}
                activeComplaintsCount={activeComplaintsCount}
                serviceRequests={serviceRequests}
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

                    <UsageChart user={user} isPaid={isPaid} payments={payments} />

                    <RecentActivity dashboardNotifications={dashboardNotifications} />

                    <PropertyRules rules={user?.guidelines} />

                    <RecentComplaintsPreview complaints={complaints} navigate={navigate} />
                </div>

                {/* Right Column: Information Stack */}
                <div className="flex flex-col gap-8">
                    <TenantAnnouncementsWidget isDarkMode={isDarkMode} />

                    <QuickActions navigate={navigate} isPaid={isPaid} />

                    <ImportantContacts user={user} />

                    <RequestedServices
                        serviceRequests={serviceRequests}
                        fetchTenantData={fetchTenantData}
                    />

                    <VacateCard />

                    <RecentPaymentsPreview payments={payments} navigate={navigate} />

                </div>
            </div>
        </div >
    );
};

export default DashboardHome;
