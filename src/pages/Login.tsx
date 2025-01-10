import { Medal } from 'lucide-react';
import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  return (
    <div className="min-h-screen bg-[#E3F2FD] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 transform transition-all duration-300 hover:shadow-xl">
        <div className="flex flex-col items-center mb-8 animate-fadeIn">
          <div className="bg-[#ADD8E6] bg-opacity-30 p-4 rounded-full mb-4">
            <Medal className="w-12 h-12 text-[#ADD8E6]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Motorista Show</h1>
          <p className="mt-2 text-gray-600 text-center">
            Sistema de Gerenciamento de Frota
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}