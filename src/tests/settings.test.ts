import { describe, it, expect, beforeEach, vi } from 'vitest';
import { settingsService, defaultSettings } from '@/lib/settings';
import { supabase } from '@/lib/supabase';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));

describe('SettingsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should load default settings when no settings exist', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValue({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null }),
        }),
      }),
    } as any);

    const settings = await settingsService.loadSettings();
    expect(settings).toEqual(defaultSettings);
  });

  it('should save settings successfully', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValue({
      upsert: () => Promise.resolve({ error: null }),
    } as any);

    const newSettings = { theme: 'dark' };
    const success = await settingsService.saveSettings(newSettings);
    expect(success).toBe(true);
  });

  it('should notify subscribers when settings change', async () => {
    const callback = vi.fn();
    const unsubscribe = settingsService.subscribe(callback);

    expect(callback).toHaveBeenCalledWith(settingsService.getCurrentSettings());

    await settingsService.saveSettings({ theme: 'dark' });
    expect(callback).toHaveBeenCalledWith(expect.objectContaining({ theme: 'dark' }));

    unsubscribe();
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'test-user' } },
      error: null,
    });

    vi.mocked(supabase.from).mockReturnValue({
      upsert: () => Promise.resolve({ error: new Error('Database error') }),
    } as any);

    const success = await settingsService.saveSettings({ theme: 'dark' });
    expect(success).toBe(false);
  });
});