import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { copy, type Language } from '@/lib/copy';

type PreferencesValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  dark: boolean;
  setDark: (dark: boolean) => void;
  t: (typeof copy)['ES'];
};

const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ES');
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  const value = useMemo(() => ({ language, setLanguage, dark, setDark, t: copy[language] }), [language, dark]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) throw new Error('usePreferences must be used within PreferencesProvider');
  return value;
}
