import { useState, useEffect } from 'react';
import { ChevronDown, Plus, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import EvaluationModal from './EvaluationModal';

interface Driver {
  id: string;
  nome: string;
  situacao: string;
  data_admissao: string;
}

interface EvaluationItem {
  id: string;
  name: string;
  weight: number;
}

interface DriverEvaluation {
  driver_id: string;
  evaluation_item_id: string;
  score: number;
}

export default function DriverEvaluationGrid() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [evaluationItems, setEvaluationItems] = useState<EvaluationItem[]>([]);
  const [evaluations, setEvaluations] = useState<DriverEvaluation[]>([]);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [showEvaluationModal, setShowEvaluationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch drivers
        const { data: driversData, error: driversError } = await supabase
          .from('drivers')
          .select('*')
          .order('nome');

        if (driversError) throw driversError;
        setDrivers(driversData || []);

        // Fetch evaluation items
        const { data: itemsData, error: itemsError } = await supabase
          .from('evaluation_items')
          .select('*')
          .order('weight', { ascending: false });

        if (itemsError) throw itemsError;
        setEvaluationItems(itemsData || []);

        // Fetch evaluations
        const { data: evaluationsData, error: evaluationsError } = await supabase
          .from('driver_evaluations')
          .select('*');

        if (evaluationsError) throw evaluationsError;
        setEvaluations(evaluationsData || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Erro ao carregar dados');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDriverScore = (driverId: string, itemId: string) => {
    const evaluation = evaluations.find(
      e => e.driver_id === driverId && e.evaluation_item_id === itemId
    );
    return evaluation ? (evaluation.score / 10).toFixed(1) : '-';
  };

  const getScoreColor = (score: string) => {
    if (score === '-') return 'text-gray-400';
    const numScore = parseFloat(score);
    if (numScore >= 8) return 'text-green-600';
    if (numScore >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span>Carregando dados...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Avaliação de Motoristas</h1>
        <Button
          onClick={() => setShowEvaluationModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Avaliar Motorista
        </Button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r sticky left-0 bg-gray-50">
                  Nome
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-r">
                  Admissão
                </th>
                {evaluationItems.map((item) => (
                  <th 
                    key={item.id}
                    className="px-4 py-3 text-center text-sm font-medium text-gray-700 border-r"
                    title={`Peso: ${item.weight}`}
                  >
                    {item.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {drivers.map((driver) => (
                <tr 
                  key={driver.id}
                  className="hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedDriver(driver);
                    setShowEvaluationModal(true);
                  }}
                >
                  <td className="px-4 py-3 text-sm text-gray-900 border-r font-medium sticky left-0 bg-white">
                    {driver.nome}
                  </td>
                  <td className="px-4 py-3 text-sm border-r">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      driver.situacao === 'Ativo' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {driver.situacao}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600 border-r whitespace-nowrap">
                    {new Date(driver.data_admissao).toLocaleDateString('pt-BR')}
                  </td>
                  {evaluationItems.map((item) => {
                    const score = getDriverScore(driver.id, item.id);
                    return (
                      <td 
                        key={item.id}
                        className={`px-4 py-3 text-sm border-r text-center font-medium ${getScoreColor(score)}`}
                      >
                        {score}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showEvaluationModal && (
        <EvaluationModal
          driverId={selectedDriver?.id || drivers[0]?.id}
          driverName={selectedDriver?.nome || drivers[0]?.nome}
          onClose={() => {
            setShowEvaluationModal(false);
            setSelectedDriver(null);
          }}
          onSuccess={() => {
            // Refresh evaluations after new evaluation is added
            supabase
              .from('driver_evaluations')
              .select('*')
              .then(({ data }) => {
                if (data) setEvaluations(data);
              });
            setShowEvaluationModal(false);
            setSelectedDriver(null);
          }}
        />
      )}
    </div>
  );
}