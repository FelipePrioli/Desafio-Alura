import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

interface EvaluationItem {
  id: string;
  name: string;
  weight: number;
  description?: string;
}

interface EvaluationItemFormProps {
  item?: EvaluationItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EvaluationItemForm({ item, onClose, onSuccess }: EvaluationItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    weight: '2' // Default to 'Média'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        description: item.description || '',
        weight: item.weight.toString()
      });
    }
  }, [item]);

  const importanceLevels = [
    { value: '1', label: 'Baixa' },
    { value: '2', label: 'Média' },
    { value: '3', label: 'Alta' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Nome do item é obrigatório');
      return;
    }

    setIsLoading(true);
    try {
      if (item) {
        const { error: updateError } = await supabase
          .from('evaluation_items')
          .update({
            name: formData.name.trim(),
            description: formData.description.trim(),
            weight: parseInt(formData.weight)
          })
          .eq('id', item.id);

        if (updateError) throw updateError;
        toast.success('Item atualizado com sucesso');
      } else {
        const { error: createError } = await supabase
          .from('evaluation_items')
          .insert([{
            name: formData.name.trim(),
            description: formData.description.trim(),
            weight: parseInt(formData.weight)
          }]);

        if (createError) throw createError;
        toast.success('Item cadastrado com sucesso');
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error saving evaluation item:', err);
      toast.error(item ? 'Erro ao atualizar item' : 'Erro ao cadastrar item');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {item ? 'Editar Item' : 'Novo Item de Avaliação'}
          </h2>
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
              Nome do Item *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, name: e.target.value }));
                setError('');
              }}
              className={error ? 'border-red-500' : ''}
              placeholder="Ex: Pontualidade"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Descrição
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              rows={3}
              placeholder="Descrição detalhada do item de avaliação..."
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Importância *
            </label>
            <div className="flex gap-4">
              {importanceLevels.map(({ value, label }) => (
                <label
                  key={value}
                  className={`
                    flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border-2 cursor-pointer
                    transition-all duration-200
                    ${formData.weight === value 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-blue-200'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="weight"
                    value={value}
                    checked={formData.weight === value}
                    onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : (item ? 'Atualizar' : 'Salvar')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}