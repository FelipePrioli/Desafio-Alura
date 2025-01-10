import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { authenticateUser } from '@/lib/auth';

export default function LoginForm() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { success, error: authError, user } = await authenticateUser(email, password);

      if (success && user) {
        navigate('/dashboard');
      } else {
        setError(authError || 'Erro ao fazer login. Tente novamente.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Erro ao conectar ao servidor. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleLogin} className="space-y-6 animate-fadeIn">
        {error && (
          <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-md text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              className="pl-10 transition-all duration-200 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              aria-required="true"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="password">
            Senha
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10 transition-all duration-200 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              aria-required="true"
              minLength={8}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </Button>

        <p className="text-center text-sm text-gray-600">
          Não tem uma conta?{' '}
          <button
            type="button"
            onClick={() => navigate('/user-registration')}
            className="text-blue-600 hover:text-blue-500"
          >
            Cadastre-se
          </button>
        </p>
      </form>
    </div>
  );
}