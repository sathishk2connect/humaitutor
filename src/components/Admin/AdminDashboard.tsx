import React from 'react';
import { OverviewTab } from './OverviewTab';
import { UsersTab } from './UsersTab';
import { AllSessionsTab } from './AllSessionsTab';
import { ContentReviewTab } from './ContentReviewTab';
import { SettingsTab } from './SettingsTab';

interface AdminDashboardProps {
  activeTab: string;
}

export function AdminDashboard({ activeTab }: AdminDashboardProps) {
  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'users':
        return <UsersTab />;
      case 'sessions':
        return <AllSessionsTab />;
      case 'content':
        return <ContentReviewTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <OverviewTab />;
    }
  };

  return (
    <div className="flex-1 p-6">
      {renderTab()}
    </div>
  );
}