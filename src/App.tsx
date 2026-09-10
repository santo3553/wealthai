import React, { useState } from 'react';
import { BackgroundOrbs } from './components/layout/BackgroundOrbs';
import { BottomNav, NavTab } from './components/layout/BottomNav';
import { DashboardScreen } from './components/dashboard/DashboardScreen';
import { TransactionsScreen } from './components/transactions/TransactionsScreen';
import { AnalyticsScreen } from './components/analytics/AnalyticsScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { AddEntryModal } from './components/entry/AddEntryModal';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { FinanceProvider } from './context/FinanceContext';

export const MainAppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen bg-[#120d0b] text-white selection:bg-amber-500/30 selection:text-amber-200">
      {/* 3 Fixed 120px Blurred Background Orbs (Indigo, Fuchsia, Amber) */}
      <BackgroundOrbs />

      {/* Luxury Mobile Viewport Wrapper */}
      <div className="relative z-10 mx-auto max-w-md min-h-screen flex flex-col justify-between">
        {/* Active Screen View */}
        <div className="flex-1">
          {activeTab === 'dashboard' && (
            <DashboardScreen onNavigate={(tab) => setActiveTab(tab)} />
          )}
          {activeTab === 'transactions' && <TransactionsScreen />}
          {activeTab === 'analytics' && <AnalyticsScreen />}
          {activeTab === 'profile' && <ProfileScreen />}
        </div>

        {/* Luxury Bottom Navigation */}
        <BottomNav
          activeTab={activeTab}
          onChangeTab={(tab) => setActiveTab(tab)}
          onOpenAddModal={() => setIsAddModalOpen(true)}
        />

        {/* Add Entry Framer-Motion Slide Up Overlay */}
        <AddEntryModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppSettingsProvider>
      <FinanceProvider>
        <MainAppContent />
      </FinanceProvider>
    </AppSettingsProvider>
  );
}
