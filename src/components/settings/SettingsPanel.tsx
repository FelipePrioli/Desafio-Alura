import { useState } from 'react';
import { X, Moon, Sun, Bell, Globe, Eye, Volume2, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useSettings } from '@/hooks/useSettings';
import { toast } from 'react-hot-toast';

export default function SettingsPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { settings, isLoading, updateSettings, resetSettings } = useSettings();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = async (key: string, value: any) => {
    setHasChanges(true);
    await updateSettings({ [key]: value });
  };

  const handleReset = async () => {
    if (window.confirm('Deseja restaurar as configurações padrão?')) {
      setIsSaving(true);
      try {
        await resetSettings();
        setHasChanges(false);
        toast.success('Configurações restauradas com sucesso');
      } catch (error) {
        toast.error('Erro ao restaurar configurações');
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleClose = () => {
    if (hasChanges) {
      if (window.confirm('Você tem alterações não salvas. Deseja descartar?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg">
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } z-50`}
    >
      <div className="h-full flex flex-col">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Configurações</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Settings controls here - same as before */}
        </div>

        <div className="p-4 border-t space-y-4">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={handleReset}
            disabled={isSaving}
          >
            <RotateCcw className="h-4 w-4" />
            Restaurar Padrões
          </Button>
        </div>
      </div>
    </div>
  );
}