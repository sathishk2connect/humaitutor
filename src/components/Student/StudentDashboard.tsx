import React, { useState } from 'react';
import { LearnTab } from './LearnTab';
import { HistoryTab } from './HistoryTab';
import { ProgressTab } from './ProgressTab';
import { TutorsTab } from './TutorsTab';

interface StudentDashboardProps {
  activeTab: string;
}

export function StudentDashboard({ activeTab }: StudentDashboardProps) {
  const renderTab = () => {
    switch (activeTab) {
      case 'learn':
        return <LearnTab />;
      case 'history':
        return <HistoryTab />;
      case 'progress':
        return <ProgressTab />;
      case 'tutors':
        return <TutorsTab />;
      default:
        return <LearnTab />;
    }
  };

  return (
    <div className="flex-1 p-6">
      {renderTab()}
    </div>
  );
}