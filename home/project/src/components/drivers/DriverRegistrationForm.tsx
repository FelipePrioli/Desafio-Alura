import { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { supabase } from '@/lib/supabase';

interface DriverRegistrationFormProps {
  onClose: () => void;
}

export default function DriverRegistrationForm({ onClose }: DriverRegistrationFormProps) {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    data_admissao: '',
    situacao: 'Ativo'
  });
  const [errors, setErrors] = useState({
    nome: '',
    cpf: '',
    data_admissao: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const validateName = (name: string) => {
    if (!name) return 'Nome é obrigatório';
    if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]*$/.test(name)) {
      return 'Nome não pode conter números ou caracteres especiais';
    }
    return '';
  };

  const validateCPF = (cpf: string) => {
    if (!cpf) return 'CPF é obrigatório';
    
    // Remove non-digits
    const numbers = cpf.replace(/\D/g, '');
    
    if (numbers.length !== 11) return 'CPF deve ter 11 dígitos';
    
    // Validate CPF algorithm
    let sum = 0;
    let remainder;
    
    if (numbers === '00000000000') return 'CPF inválido';
    
    for (let i = 1; i <= 9; i++) {
      sum = sum + parseInt(numbers.substring(i - 1, i)) * (11 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(9, 10))) return 'CPF inválido';
    
    sum = 0;
    for (let i = 1; i <= 10; i++) {
      sum = sum + parseInt(numbers.substring(i - 1, i)) * (12 - i);
    }
    
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(numbers.substring(10, 11))) return 'CPF inválido';
    
    return '';
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'nome') {
      // Capitalize first letter of each word
      const formattedName = value.toLowerCase().replace(/(?:^|\s)\S/g, l => l.toUpperCase());
      setFormData(prev => ({ ...prev, [name]: formattedName }));
      setErrors(prev => ({ ...prev, [name]: validateName(formattedName) }));
    } else if (name === 'cpf') {
      const numbers = value.replace(/\D/g, '');
      if (numbers.length <= 11) {
        const formattedCPF = formatCPF(numbers);
        setFormData(prev => ({ ...prev, [name]: formattedCPF }));
        setErrors(prev => ({ ...prev, [name]: validateCPF(numbers) }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const nameError = validateName(formData.nome);
    const cpfError = validateCPF(formData.cpf);
    const dateError = !formData.data_admissao ? 'Data de admissão é obrigatória' : '';
    
    setErrors({
      nome: nameError,
      cpf: cpfError,
      data_admissao: dateError,
    });

    if (nameError || cpfError || dateError) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('drivers')
        .insert([{
          nome: formData.nome,
          cpf: formData.cpf.replace(/\D/g, ''),
          data_admissao: formData.data_admissao,
          situacao: formData.situacao,
        }]);

      if (error) throw error;

      toast.success('Motorista cadastrado com sucesso!');
      onClose();
    } catch (err) {
      console.error('Error creating driver:', err);
      toast.error('Erro ao cadastrar motorista');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Cadastro de Motorista</h2>
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
              Nome Completo *
            </label>
            <Input
              name="nome"
              value={formData.nome}
              onChange={handleInputChange}
              className={errors.nome ? 'border-red-500' : ''}
              placeholder="João da Silva"
            />
            {errors.nome && (
              <p className="text-sm text-red-600">{errors.nome}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              CPF *
            </label>
            <Input
              name="cpf"
              value={formData.cpf}
              onChange={handleInputChange}
              className={errors.cpf ? 'border-red-500' : ''}
              placeholder="000.000.000-00"
            />
            {errors.cpf && (
              <p className="text-sm text-red-600">{errors.cpf}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Data de Admissão *
            </label>
            <Input
              type="date"
              name="data_admissao"
              value={formData.data_admissao}
              onChange={handleInputChange}
              max={new Date().toISOString().split('T')[0]}
              className={errors.data_admissao ? 'border-red-500' : ''}
            />
            {errors.data_admissao && (
              <p className="text-sm text-red-600">{errors.data_admissao}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Situação *
            </label>
            <select
              name="situacao"
              value={formData.situacao}
              onChange={handleInputChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="Ativo">Ativo</option>
              <option value="Inativo">Inativo</option>
              <option value="Afastado">Afastado</option>
              <option value="Férias">Férias</option>
            </select>
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
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}