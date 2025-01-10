import { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DriverRegistrationForm from '@/components/drivers/DriverRegistrationForm';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';
import { Toaster } from 'react-hot-toast';

interface Driver {
  id: string;
  nome: string;
  situacao: string;
  created_at: string;
}

export default function DriverRegistration() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const { data, error } = await supabase
        .from('drivers')
        .select('id, nome, situacao, created_at')
        .order('nome');

      if (error) throw error;
      setDrivers(data || []);
    } catch (err) {
      console.error('Error fetching drivers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDrivers = drivers.filter(driver =>
    driver.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Toaster position="top-right" />
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Motoristas</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gerenciamento de motoristas do sistema
              </p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={() => setShowRegistrationForm(true)}
            >
              <Plus className="h-4 w-4" />
              Novo Motorista
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar motorista..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Nome Completo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                      Data de Cadastro
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {isLoading ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        Carregando motoristas...
                      </td>
                    </tr>
                  ) : filteredDrivers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                        Nenhum motorista encontrado
                      </td>
                    </tr>
                  ) : (
                    filteredDrivers.map((driver) => (
                      <tr key={driver.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {driver.nome}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            driver.situacao === 'Ativo'
                              ? 'bg-green-100 text-green-800'
                              : driver.situacao === 'Férias'
                              ? 'bg-blue-100 text-blue-800'
                              : driver.situacao === 'Afastado'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {driver.situacao}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {new Date(driver.created_at).toLocaleDateString('pt-BR')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {showRegistrationForm && (
        <DriverRegistrationForm
          onClose={() => {
            setShowRegistrationForm(false);
            fetchDrivers();
          }}
        />
      )}
    </div>
  );
}