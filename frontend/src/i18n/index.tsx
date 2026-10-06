import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import en from './en.json';
import hi from './hi.json';

type Lang = 'en' | 'hi';
type Translations = typeof en;

const translations: Record<Lang, Translations> = { en, hi };

type I18nContextType = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: string) => string;
};

const I18nContext = createContext<I18nContextType>({
  lang: 'en',
  setLang: () => {},
  t: (key: string) => key,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    const saved = localStorage.getItem('suraksha_lang');
    return (saved === 'hi' ? 'hi' : 'en') as Lang;
  });

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang);
    localStorage.setItem('suraksha_lang', newLang);
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split('.');
    let result: unknown = translations[lang];
    for (const k of keys) {
      if (result && typeof result === 'object' && k in (result as Record<string, unknown>)) {
        result = (result as Record<string, unknown>)[k];
      } else {
        return key; // fallback to key
      }
    }
    return typeof result === 'string' ? result : key;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}

export default I18nContext;
