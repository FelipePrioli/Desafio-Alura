import { useState } from 'react';
import { Shield } from 'lucide-react';
import { UserRegistrationData } from '@/types/auth';
import Button from '@/components/ui/Button';

interface RoleSelectionFormProps {
  data: UserRegistrationData;
  onSave: (data: Partial<UserRegistrationData>) => void;
  onComplete: () => void;
}

export default function RoleSelectionForm({ data, onSave, onComplete }: RoleSelectionFormProps) {
  const [selectedRole, setSelectedRole] = useState(data.role);

  const roles = [
    {
      id: 'standard',
      name: 'Usuário Padrão',
      description: 'Acesso básico ao sistema',
      permissions: ['Visualização de conteúdo', 'Acesso a documentos básicos']
    },
    {
      id: 'administrator',
      name: 'Administrador',
      description: 'Acesso administrativo completo',
      permissions: ['Gerenciamento de usuários', 'Configurações do sistema', 'Relatórios']
    },
    {
      id: 'director',
      name: 'Diretor',
      description: 'Controle total do sistema',
      permissions: ['Controle administrativo completo', 'Gerenciamento de permissões', 'Acesso irrestrito']
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ role: selectedRole });
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {roles.map((role) => (
          <div
            key={role.id}
            className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
              selectedRole === role.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-200'
            }`}
            onClick={() => setSelectedRole(role.id as UserRegistrationData['role'])}
          >
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${
                selectedRole === role.id ? 'bg-blue-500 text-white' : 'bg-gray-100'
              }`}>
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{role.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{role.description}</p>
                <ul className="mt-2 space-y-1">
                  {role.permissions.map((permission, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-1 h-1 bg-gray-400 rounded-full" />
                      {permission}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" className="w-full">
        Confirmar Função
      </Button>
    </form>
  );
}