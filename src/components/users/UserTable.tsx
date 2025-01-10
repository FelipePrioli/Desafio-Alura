import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Search, UserPlus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import UserRegistrationForm from '@/components/auth/UserRegistrationForm';

interface User {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  is_active: boolean;
  last_login: string | null;
}

interface SortConfig {
  key: keyof User;
  direction: 'asc' | 'desc';
}

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ 
    key: 'created_at', 
    direction: 'desc' 
  });

  const usersPerPage = 10;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: keyof User) => {
    setSortConfig(current => ({
      key,
      direction: current.key === key && current.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue === null) return 1;
    if (bValue === null) return -1;

    const comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });

  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const SortIcon = ({ column }: { column: keyof User }) => {
    if (sortConfig.key !== column) return <ChevronDown className="h-4 w-4 text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="h-4 w-4 text-blue-600" />
      : <ChevronDown className="h-4 w-4 text-blue-600" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Buscar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          onClick={() => setShowRegistrationModal(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Novo Usuário
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('full_name')}
              >
                <div className="flex items-center gap-1">
                  Nome
                  <SortIcon column="full_name" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-1">
                  Email
                  <SortIcon column="email" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('created_at')}
              >
                <div className="flex items-center gap-1">
                  Data de Cadastro
                  <SortIcon column="created_at" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('is_active')}
              >
                <div className="flex items-center gap-1">
                  Status
                  <SortIcon column="is_active" />
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                onClick={() => handleSort('last_login')}
              >
                <div className="flex items-center gap-1">
                  Último Acesso
                  <SortIcon column="last_login" />
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Carregando...
                </td>
              </tr>
            ) : paginatedUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-4 text-gray-500">
                  Nenhum usuário encontrado
                </td>
              </tr>
            ) : (
              paginatedUsers.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {user.full_name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {format(new Date(user.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.is_active 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {user.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.last_login 
                      ? format(new Date(user.last_login), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
                      : 'Nunca acessou'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <span className="text-sm text-gray-600">
            Mostrando {((currentPage - 1) * usersPerPage) + 1} a {Math.min(currentPage * usersPerPage, sortedUsers.length)} de {sortedUsers.length} usuários
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Próxima
            </Button>
          </div>
        </div>
      )}

      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Novo Usuário</h2>
                <button
                  onClick={() => setShowRegistrationModal(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  ×
                </button>
              </div>
              <UserRegistrationForm />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}