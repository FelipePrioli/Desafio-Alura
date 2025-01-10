import { useState, useEffect } from 'react';
import { Plus, Search, AlertCircle, Edit2, Trash2 } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import EvaluationItemForm from '@/components/evaluation/EvaluationItemForm';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface EvaluationItem {
  id: string;
  name: string;
  weight: number;
  description?: string;
  created_at: string;
}

const getWeightLabel = (weight: number): string => {
  switch (weight) {
    case 1: return 'Muito Baixo';
    case 2: return 'Baixo';
    case 3: return 'Médio';
    case 4: return 'Alto';
    case 5: return 'Muito Alto';
    default: return 'N/A';
  }
};

const getWeightColor = (weight: number): string => {
  switch (weight) {
    case 1: return 'text-gray-600';
    case 2: return 'text-yellow-600';
    case 3: return 'text-blue-600';
    case 4: return 'text-green-600';
    case 5: return 'text-purple-600';
    default: return 'text-gray-600';
  }
};

export default function EvaluationItems() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState<EvaluationItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<EvaluationItem | null>(null);

  const fetchItems = async () => {
    try {
      setError(null);
      const { data, error: supabaseError } = await supabase
        .from('evaluation_items')
        .select('*')
        .order('weight', { ascending: false });

      if (supabaseError) throw supabaseError;
      setItems(data || []);
    } catch (err) {
      console.error('Error fetching evaluation items:', err);
      setError('Erro ao carregar itens de avaliação');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('evaluation_items')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;

      toast.success('Item excluído com sucesso');
      fetchItems();
    } catch (err) {
      console.error('Error deleting item:', err);
      toast.error('Erro ao excluir item');
    }
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Itens de Avaliação</h1>
              <p className="mt-1 text-sm text-gray-600">
                Gerenciamento dos critérios de avaliação dos motoristas
              </p>
            </div>
            <Button
              onClick={() => {
                setSelectedItem(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Novo Item
            </Button>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{error}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchItems}
                className="ml-auto"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          <div className="bg-white rounded-lg shadow-lg">
            <div className="p-4 border-b">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar item..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
                  <span>Carregando itens...</span>
                </div>
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'Nenhum item encontrado' : 'Nenhum item cadastrado'}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredItems.map((item) => (
                  <li key={item.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                        {item.description && (
                          <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                        )}
                        <p className="mt-1 text-sm text-gray-500">
                          Criado em {new Date(item.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-sm text-gray-500">Peso</span>
                          <div className={`text-lg font-semibold ${getWeightColor(item.weight)}`}>
                            {getWeightLabel(item.weight)}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setShowForm(true);
                            }}
                            className="flex items-center gap-1"
                          >
                            <Edit2 className="h-4 w-4" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>

      {showForm && (
        <EvaluationItemForm
          item={selectedItem}
          onClose={() => {
            setShowForm(false);
            setSelectedItem(null);
          }}
          onSuccess={fetchItems}
        />
      )}
    </div>
  );
}