import { useState, useCallback } from 'react';
import { Moon, Sun, Monitor, Type, Sliders, ZapOff, Volume2, Bell, RotateCcw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/ui/Button';
import { useSettings } from '@/hooks/useSettings';

export default function Settings() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { settings, isLoading, isSaving, updateSettings, resetSettings } = useSettings();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const handleSettingChange = useCallback(async (key: string, value: any) => {
    setHasUnsavedChanges(true);
    const success = await updateSettings({ [key]: value });
    if (success) {
      setHasUnsavedChanges(false);
    }
  }, [updateSettings]);

  const handleReset = async () => {
    if (window.confirm('Tem certeza que deseja restaurar as configurações padrão?')) {
      await resetSettings();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Carregando configurações...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Sidebar isOpen={sidebarOpen} />

      <main className={`pt-16 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        <div className="p-6 space-y-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
              <p className="mt-1 text-sm text-gray-600">
                Personalize sua experiência no sistema
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              Restaurar Padrões
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Theme Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sun className="h-5 w-5 text-amber-500" />
                Tema
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Modo</span>
                  <select
                    value={settings.theme}
                    onChange={(e) => handleSettingChange('theme', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Escuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Tamanho da Fonte</span>
                  <select
                    value={settings.fontSize}
                    onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="small">Pequeno</option>
                    <option value="medium">Médio</option>
                    <option value="large">Grande</option>
                  </select>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Contraste</span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.contrast}
                    onChange={(e) => handleSettingChange('contrast', parseInt(e.target.value))}
                    className="w-32"
                  />
                </label>
              </div>
            </div>

            {/* Accessibility Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Type className="h-5 w-5 text-blue-500" />
                Acessibilidade
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Alto Contraste</span>
                  <button
                    onClick={() => handleSettingChange('highContrast', !settings.highContrast)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.highContrast ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.highContrast ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Reduzir Movimento</span>
                  <button
                    onClick={() => handleSettingChange('reducedMotion', !settings.reducedMotion)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.reducedMotion ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-500" />
                Notificações
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Notificações</span>
                  <button
                    onClick={() => handleSettingChange('notifications', !settings.notifications)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.notifications ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Sons</span>
                  <button
                    onClick={() => handleSettingChange('sound', !settings.sound)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.sound ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.sound ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sliders className="h-5 w-5 text-green-500" />
                Sistema
              </h2>
              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Salvar Automaticamente</span>
                  <button
                    onClick={() => handleSettingChange('autoSave', !settings.autoSave)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      settings.autoSave ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Idioma</span>
                  <select
                    value={settings.language}
                    onChange={(e) => handleSettingChange('language', e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  >
                    <option value="pt-BR">Português (BR)</option>
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}