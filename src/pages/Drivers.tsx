import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DriverEvaluationGrid from '@/components/drivers/DriverEvaluationGrid';

export default function Drivers() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-white">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <DriverEvaluationGrid />
      </main>
    </div>
  );
}