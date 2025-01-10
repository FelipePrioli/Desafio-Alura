import { useState } from 'react';
import { FileDown, Calendar, Filter, TrendingUp } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import PerformanceMetrics from '@/components/reports/PerformanceMetrics';
import DeliveryTrends from '@/components/reports/DeliveryTrends';
import EfficiencyIndicators from '@/components/reports/EfficiencyIndicators';
import DateRangePicker from '@/components/reports/DateRangePicker';

export default function Reports() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [dateRange, setDateRange] = useState('week');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleExportExcel = () => {
    // Excel export logic will be implemented here
    console.log('Exporting to Excel...');
  };

  const periodLabels = {
    day: 'Diário',
    week: 'Semanal',
    month: 'Mensal',
    year: 'Anual'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="p-6 space-y-6">
          {/* Header Section */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
              <p className="mt-1 text-sm text-gray-600">
                Análise detalhada de desempenho e métricas
              </p>
            </div>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setShowDatePicker(true)}
              >
                <Calendar className="h-4 w-4" />
                Período
              </Button>
              <Button
                className="flex items-center gap-2"
                onClick={handleExportExcel}
              >
                <FileDown className="h-4 w-4" />
                Exportar Excel
              </Button>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-4">
            <Filter className="h-5 w-5 text-gray-400" />
            <div className="flex gap-2">
              {Object.entries(periodLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setDateRange(key)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    dateRange === key
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Métricas de Performance
                </h2>
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <PerformanceMetrics period={dateRange} />
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  Tendências de Entrega
                </h2>
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <DeliveryTrends period={dateRange} />
            </div>
          </div>

          {/* Efficiency Indicators */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Indicadores de Eficiência
              </h2>
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
            <EfficiencyIndicators period={dateRange} />
          </div>
        </div>
      </main>

      {showDatePicker && (
        <DateRangePicker
          onClose={() => setShowDatePicker(false)}
          onSelect={(range) => {
            console.log('Selected range:', range);
            setShowDatePicker(false);
          }}
        />
      )}
    </div>
  );
}