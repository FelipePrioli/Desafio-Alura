import { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  license: string;
  vehicle: string;
  plate: string;
  schedule: string;
  status: string;
  score: number;
  photo: string;
}

interface DriverEditFormProps {
  driver: Driver;
  onClose: () => void;
  onSave: (driver: Driver) => void;
}

export default function DriverEditForm({ driver, onClose, onSave }: DriverEditFormProps) {
  const [formData, setFormData] = useState<Driver>(driver);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.license) {
      setError('Por favor, preencha todos os campos obrigatórios');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError('Por favor, insira um email válido');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      const { data, error: updateError } = await supabase
        .from('drivers')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          license: formData.license,
          vehicle: formData.vehicle,
          plate: formData.plate,
          schedule: formData.schedule,
          status: formData.status,
        })
        .eq('id', driver.id)
        .select()
        .single();

      if (updateError) throw updateError;

      toast.success('Perfil atualizado com sucesso!');
      onSave(data);
      onClose();
    } catch (err) {
      console.error('Error updating driver:', err);
      setError('Erro ao atualizar o perfil. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 animate-fadeIn">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">Editar Motorista</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-md">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Nome*</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email*</label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Telefone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">CNH*</label>
              <Input
                value={formData.license}
                onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Veículo</label>
              <Input
                value={formData.vehicle}
                onChange={(e) => setFormData({ ...formData, vehicle: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Placa</label>
              <Input
                value={formData.plate}
                onChange={(e) => setFormData({ ...formData, plate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Horário</label>
              <Input
                value={formData.schedule}
                onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t">
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
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              <Save className="h-4 w-4" />
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}