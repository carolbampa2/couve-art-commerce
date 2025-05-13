
import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'pt-BR';

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  translations: Record<string, string>;
  t: (key: string) => string;
};

const defaultTranslations: Record<Language, Record<string, string>> = {
  'en': {},
  'pt-BR': {}
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  // Tenta recuperar a preferência de idioma do localStorage, senão usa 'en'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'en';
  });
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Função para carregar as traduções
  useEffect(() => {
    const loadTranslations = async () => {
      try {
        // Importa dinamicamente os arquivos de tradução baseados no idioma selecionado
        const translationModule = await import(`../translations/${language}.ts`);
        setTranslations(translationModule.default);
      } catch (error) {
        console.error("Failed to load translations:", error);
        setTranslations(defaultTranslations[language]);
      }
    };
    
    loadTranslations();
  }, [language]);

  // Função para salvar o idioma no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Função de tradução
  const t = (key: string): string => {
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
