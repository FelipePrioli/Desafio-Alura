import { useState, useEffect, useCallback } from 'react';
import { Settings, settingsService, defaultSettings } from '@/lib/settings';
import { toast } from 'react-hot-toast';

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        await settingsService.loadSettings();
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast.error('Erro ao carregar configurações');
        setIsLoading(false);
      }
    };

    const unsubscribe = settingsService.subscribe(setSettings);
    loadSettings();

    return unsubscribe;
  }, []);

  const updateSettings = useCallback(async (newSettings: Partial<Settings>) => {
    setIsSaving(true);
    try {
      const success = await settingsService.saveSettings(newSettings);
      if (success) {
        toast.success('Configurações atualizadas com sucesso');
      }
      return success;
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Erro ao atualizar configurações');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  const resetSettings = useCallback(async () => {
    setIsSaving(true);
    try {
      const success = await settingsService.resetToDefaults();
      if (success) {
        toast.success('Configurações restauradas com sucesso');
      }
      return success;
    } catch (error) {
      console.error('Error resetting settings:', error);
      toast.error('Erro ao restaurar configurações');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    settings,
    isLoading,
    isSaving,
    updateSettings,
    resetSettings,
  };
}