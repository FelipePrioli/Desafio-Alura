import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, UserPlus, Users, FileBarChart, Settings, LogOut, ClipboardList, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';

interface SidebarProps {
  isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const navigate = useNavigate();

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Painel', path: '/dashboard' },
    { id: 'driver-registration', icon: UserPlus, label: 'Cadastro de Motoristas', path: '/driver-registration' },
    { id: 'drivers', icon: Truck, label: 'Motoristas', path: '/drivers' },
    { id: 'evaluation-items', icon: ClipboardList, label: 'Itens Cadastrados', path: '/evaluation-items' },
    { id: 'user-registration', icon: Users, label: 'Cadastro de Usuários', path: '/user-registration' },
    { id: 'reports', icon: FileBarChart, label: 'Relatórios', path: '/reports' },
    { id: 'settings', icon: Settings, label: 'Configurações', path: '/settings' }
  ];

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      toast.success('Logout realizado com sucesso');
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
      toast.error('Erro ao fazer logout');
    }
  };

  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg transform transition-all duration-300 ease-in-out z-20',
        isOpen ? 'w-64' : 'w-20',
        'flex flex-col'
      )}
    >
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map(({ id, icon: Icon, label, path }) => (
          <button
            key={id}
            onClick={() => navigate(path)}
            className={cn(
              'w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200',
              'hover:bg-blue-50 hover:text-blue-600',
              location.pathname === path ? 'bg-blue-50 text-blue-600' : 'text-gray-600',
              isOpen ? 'justify-start' : 'justify-center'
            )}
          >
            <Icon className={cn('h-5 w-5', !isOpen && 'mx-auto')} />
            {isOpen && <span className="ml-3 text-sm font-medium">{label}</span>}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className={cn(
            'w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            'text-red-600 hover:bg-red-50',
            isOpen ? 'justify-start' : 'justify-center'
          )}
        >
          <LogOut className={cn('h-5 w-5', !isOpen && 'mx-auto')} />
          {isOpen && <span className="ml-3 text-sm font-medium">Sair</span>}
        </button>
      </div>
    </aside>
  );
}