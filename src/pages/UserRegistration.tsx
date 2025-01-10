import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import UserRegistrationForm from '@/components/auth/UserRegistrationForm';

export default function UserRegistration() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="text-center mb-8 animate-[fadeIn_0.5s_ease-out]">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo ao Cadastro
            </h1>
            <p className="text-gray-600">
              Complete seu registro para começar a usar o sistema
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 animate-[fadeIn_0.5s_ease-out_0.2s] transform transition-all hover:shadow-xl">
            <UserRegistrationForm />
          </div>
        </div>
      </main>
    </div>
  );
}