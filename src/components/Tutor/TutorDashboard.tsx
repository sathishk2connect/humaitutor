import React from 'react';
import { DashboardTab } from './DashboardTab';
import { TrainAITab } from './TrainAITab';
import { SessionsTab } from './SessionsTab';
import { ContentTab } from './ContentTab';
import { EarningsTab } from './EarningsTab';
import { ActiveSessions } from './ActiveSessions';

interface TutorDashboardProps {
  activeTab: string;
}

export function TutorDashboard({ activeTab }: TutorDashboardProps) {
  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'train-ai':
        return <TrainAITab />;
      case 'sessions':
        return <SessionsTab />;
      case 'active-sessions':
        return <ActiveSessions />;
      case 'content':
        return <ContentTab />;
      case 'earnings':
        return <EarningsTab />;
      default:
        return <DashboardTab />;
    }
  };

  return (
    <div className="flex-1 p-6">
      {renderTab()}
    </div>
  );
}