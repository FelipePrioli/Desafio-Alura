import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

interface RatingModalProps {
  driverId: string;
  driverName: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RatingModal({ driverId, driverName, onClose, onSuccess }: RatingModalProps) {
  const [rating, setRating] = useState('');
  const [comments, setComments] = useState('');
  const [existingRating, setExistingRating] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkExistingRating = async () => {
      try {
        const currentDate = new Date();
        const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        
        const { data, error } = await supabase
          .from('avaliacoes_mensais')
          .select('*')
          .eq('driver_id', driverId)
          .eq('mes_ano', firstDayOfMonth.toISOString().split('T')[0])
          .single();

        if (error && error.code !== 'PGRST116') throw error;
        
        if (data) {
          setExistingRating(data);
          setRating(data.nota.toString());
          setComments(data.comentarios || '');
        }
      } catch (err) {
        console.error('Error checking existing rating:', err);
        toast.error('Erro ao verificar avaliação existente');
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingRating();
  }, [driverId]);

  const validateRating = (value: string): string => {
    if (!value) return 'Nota é obrigatória';
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return 'Digite um número válido';
    if (numValue < 0 || numValue > 10) return 'A nota deve estar entre 0 e 10';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateRating(rating);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);
    try {
      const currentDate = new Date();
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      const ratingData = {
        driver_id: driverId,
        mes_ano: firstDayOfMonth.toISOString().split('T')[0],
        nota: parseFloat(rating),
        comentarios: comments,
        status: 'preenchida'
      };

      if (existingRating) {
        const { error } = await supabase
          .from('avaliacoes_mensais')
          .update(ratingData)
          .eq('id', existingRating.id);

        if (error) throw error;
        toast.success('Avaliação atualizada com sucesso');
      } else {
        const { error } = await supabase
          .from('avaliacoes_mensais')
          .insert([ratingData]);

        if (error) throw error;
        toast.success('Avaliação registrada com sucesso');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving rating:', err);
      toast.error('Erro ao salvar avaliação');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {existingRating ? 'Editar Avaliação' : 'Nova Avaliação'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">{driverName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Nota (0-10) *
            </label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={rating}
              onChange={(e) => {
                setRating(e.target.value);
                setError('');
              }}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Comentários
            </label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              rows={4}
              placeholder="Observações sobre o desempenho do motorista..."
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
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
              disabled={isSaving}
            >
              {isSaving ? 'Salvando...' : (existingRating ? 'Atualizar' : 'Salvar')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}