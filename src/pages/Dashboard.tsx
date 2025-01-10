import { useState } from 'react';
import { Info } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DriverCard from '@/components/drivers/DriverCard';
import PerformanceChart from '@/components/charts/PerformanceChart';
import ComparisonChart from '@/components/charts/ComparisonChart';
import { mockDrivers, mockPerformanceData } from '@/data/mockData';

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out`}>
        <div className="p-6 space-y-8">
          <div className="bg-white rounded-lg shadow-md p-4 border border-blue-100">
            <div className="flex items-center gap-2 text-blue-600">
              <Info className="h-5 w-5" />
              <span className="text-sm">Bem-vindo ao painel de controle da frota</span>
            </div>
          </div>

          <section id="drivers" className="animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Motoristas</h2>
              <span className="text-sm text-gray-500">Total: {mockDrivers.length}</span>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {mockDrivers.map((driver) => (
                <DriverCard key={driver.id} {...driver} />
              ))}
            </div>
          </section>

          <section id="performance" className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Desempenho</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
                Ver todos os relatórios
              </button>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <PerformanceChart data={mockPerformanceData} />
              <ComparisonChart data={mockPerformanceData} />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}