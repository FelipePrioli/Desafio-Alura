import { supabase } from './supabase';

export interface Settings {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  contrast: number;
  animations: boolean;
  notifications: boolean;
  sound: boolean;
  language: string;
  autoSave: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
}

export const defaultSettings: Settings = {
  theme: 'system',
  fontSize: 'medium',
  contrast: 50,
  animations: true,
  notifications: true,
  sound: true,
  language: 'pt-BR',
  autoSave: true,
  highContrast: false,
  reducedMotion: false,
};

class SettingsService {
  private static instance: SettingsService;
  private currentSettings: Settings = defaultSettings;
  private subscribers: ((settings: Settings) => void)[] = [];
  private saveTimeout: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): SettingsService {
    if (!SettingsService.instance) {
      SettingsService.instance = new SettingsService();
    }
    return SettingsService.instance;
  }

  async loadSettings(): Promise<Settings> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('user_settings')
        .select('settings')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      this.currentSettings = {
        ...defaultSettings,
        ...data?.settings,
      };
      
      this.notifySubscribers();
      this.applySettings();
      
      return this.currentSettings;
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  }

  async saveSettings(settings: Partial<Settings>): Promise<boolean> {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }

    return new Promise((resolve) => {
      this.saveTimeout = setTimeout(async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) throw new Error('User not authenticated');

          const newSettings = { ...this.currentSettings, ...settings };

          const { error } = await supabase
            .from('user_settings')
            .upsert({
              user_id: user.id,
              settings: newSettings,
              updated_at: new Date().toISOString(),
            });

          if (error) throw error;

          this.currentSettings = newSettings;
          this.notifySubscribers();
          this.applySettings();
          
          resolve(true);
        } catch (error) {
          console.error('Error saving settings:', error);
          resolve(false);
        }
      }, 500); // Debounce save operations
    });
  }

  private applySettings(): void {
    // Apply theme
    document.documentElement.classList.remove('light', 'dark');
    if (this.currentSettings.theme !== 'system') {
      document.documentElement.classList.add(this.currentSettings.theme);
    }

    // Apply font size
    document.documentElement.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px',
    }[this.currentSettings.fontSize];

    // Apply high contrast
    document.documentElement.classList.toggle(
      'high-contrast',
      this.currentSettings.highContrast
    );

    // Apply reduced motion
    document.documentElement.classList.toggle(
      'reduce-motion',
      this.currentSettings.reducedMotion
    );

    // Apply contrast
    document.documentElement.style.setProperty(
      '--app-contrast',
      `${this.currentSettings.contrast}%`
    );
  }

  subscribe(callback: (settings: Settings) => void): () => void {
    this.subscribers.push(callback);
    callback(this.currentSettings);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.currentSettings));
  }

  getCurrentSettings(): Settings {
    return { ...this.currentSettings };
  }

  async resetToDefaults(): Promise<boolean> {
    return this.saveSettings(defaultSettings);
  }

  validateSettings(settings: Partial<Settings>): boolean {
    // Add validation rules as needed
    if (settings.contrast !== undefined && (settings.contrast < 0 || settings.contrast > 100)) {
      return false;
    }
    return true;
  }
}

export const settingsService = SettingsService.getInstance();