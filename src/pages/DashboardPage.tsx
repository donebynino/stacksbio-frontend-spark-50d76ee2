/**
 * Dashboard page component
 * Main page for authenticated users to manage their StacksBio profile
 */

import React from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stacksBlue/5 via-white to-stacksYellow/5">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Dashboard />
      </main>
    </div>
  );
};

export default DashboardPage;
