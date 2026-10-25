// UI Design Tokens & Theme Interface
// Generated from contracts/ui-design-tokens.json

export interface ThemeColors {
  backgroundVoid: string;
  surfaceGlass: string;
  surfaceCard: string;
  surfaceElevated: string;
  borderGlass: string;
  borderSubtle: string;
  accentPrimary: string;
  accentSecondary: string;
  accentMagenta: string;
  accentAmber: string;
  accentGreen: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  dangerRed: string;
}

export const THEME_STANDARD: ThemeColors = {
  backgroundVoid: '#070B14',
  surfaceGlass: 'rgba(15, 23, 42, 0.75)',
  surfaceCard: '#0F172A',
  surfaceElevated: '#1E293B',
  borderGlass: 'rgba(13, 238, 243, 0.25)',
  borderSubtle: '#334155',
  accentPrimary: '#0DEEF3',
  accentSecondary: '#7928CA',
  accentMagenta: '#FF007A',
  accentAmber: '#FFB800',
  accentGreen: '#00F5A0',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  dangerRed: '#EF4444'
};

export const THEME_LIGHTS_OFF: ThemeColors = {
  backgroundVoid: '#030408',
  surfaceGlass: 'rgba(5, 7, 14, 0.88)',
  surfaceCard: '#060913',
  surfaceElevated: '#0B1020',
  borderGlass: 'rgba(13, 238, 243, 0.45)',
  borderSubtle: 'rgba(255, 0, 122, 0.35)',
  accentPrimary: '#0DEEF3',
  accentSecondary: '#FF007A',
  accentMagenta: '#FF007A',
  accentAmber: '#FFB800',
  accentGreen: '#00F5A0',
  textPrimary: '#FFFFFF',
  textSecondary: '#CBD5E1',
  textMuted: '#64748B',
  dangerRed: '#FF3366'
};

export const GYM_THEME_DEFAULT = {
  backgroundVoid: '#090D16',
  surfaceCard: '#0F172A',
  surfaceGlass: 'rgba(15, 23, 42, 0.80)',
  accentPrimary: '#0DEEF3',
  accentVoltage: '#10B981',
  accentOrange: '#F97316',
  accentMagenta: '#FF007A',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8'
};

export type UiLifecycleState = 'loading_skeleton' | 'empty_state' | 'error_rfc9457_retry' | 'data_ready';
