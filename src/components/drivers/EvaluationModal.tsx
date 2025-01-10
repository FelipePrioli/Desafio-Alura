import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';

interface EvaluationItem {
  id: string;
  name: string;
  description: string;
  weight: number;
}

interface EvaluationModalProps {
  driverId: string;
  driverName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EvaluationModal({ driverId, driverName, onClose, onSuccess }: EvaluationModalProps) {
  const [items, setItems] = useState<EvaluationItem[]>([]);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const { data, error } = await supabase
          .from('evaluation_items')
          .select('*')
          .order('weight', { ascending: false });

        if (error) throw error;
        setItems(data || []);

        const initialScores: Record<string, string> = {};
        const initialNotes: Record<string, string> = {};
        data?.forEach(item => {
          initialScores[item.id] = '';
          initialNotes[item.id] = '';
        });
        setScores(initialScores);
        setNotes(initialNotes);
      } catch (err) {
        console.error('Error fetching evaluation items:', err);
        toast.error('Erro ao carregar itens de avaliação');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const validateScore = (value: string): string => {
    if (!value) return 'Nota é obrigatória';
    const score = parseFloat(value);
    if (isNaN(score)) return 'Digite um número válido';
    if (score < 1 || score > 10) return 'A nota deve estar entre 1 e 10';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    items.forEach(item => {
      const error = validateScore(scores[item.id]);
      if (error) {
        newErrors[item.id] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const evaluations = items.map(item => ({
        driver_id: driverId,
        evaluation_item_id: item.id,
        score: parseFloat(scores[item.id]) * 10,
        notes: notes[item.id] || '',
        evaluator_id: user.id,
        evaluated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('driver_evaluations')
        .insert(evaluations);

      if (error) throw error;

      toast.success('Avaliação registrada com sucesso');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving evaluation:', err);
      toast.error('Erro ao salvar avaliação');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Nova Avaliação</h2>
            <p className="mt-1 text-sm text-gray-600">{driverName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {isLoading ? (
          <div className="p-6 text-center text-gray-500">Carregando itens de avaliação...</div>
        ) : (
          <form onSubmit={handleSubmit} className="overflow-auto">
            <div className="grid grid-cols-[auto,1fr] gap-x-4 p-6">
              {/* Headers */}
              <div className="col-span-2 grid grid-cols-[auto,1fr] gap-x-4 pb-4 border-b">
                <div className="font-medium text-gray-700 w-64">Item de Avaliação</div>
                <div className="grid grid-cols-[100px,1fr] gap-x-4">
                  <div className="font-medium text-gray-700">Nota (1-10)</div>
                  <div className="font-medium text-gray-700">Observações</div>
                </div>
              </div>

              {/* Evaluation Items */}
              {items.map((item) => (
                <div key={item.id} className="col-span-2 grid grid-cols-[auto,1fr] gap-x-4 py-4 border-b">
                  <div className="w-64">
                    <div className="font-medium text-gray-900">{item.name}</div>
                    {item.description && (
                      <div className="text-sm text-gray-500 mt-1">{item.description}</div>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      Peso: {item.weight}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-[100px,1fr] gap-x-4">
                    <div>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="10"
                        value={scores[item.id]}
                        onChange={(e) => {
                          setScores(prev => ({ ...prev, [item.id]: e.target.value }));
                          setErrors(prev => ({ ...prev, [item.id]: '' }));
                        }}
                        className={`w-full rounded-md border ${
                          errors[item.id] ? 'border-red-500' : 'border-gray-300'
                        } shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50`}
                      />
                      {errors[item.id] && (
                        <p className="text-xs text-red-600 mt-1">{errors[item.id]}</p>
                      )}
                    </div>
                    <textarea
                      value={notes[item.id]}
                      onChange={(e) => setNotes(prev => ({
                        ...prev,
                        [item.id]: e.target.value
                      }))}
                      className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      rows={2}
                      placeholder="Observações (opcional)"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-4 p-6 border-t bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSaving}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSaving || items.length === 0}
              >
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}