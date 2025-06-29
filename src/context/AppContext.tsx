import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthStatus, Language, Disaster, TabName, Theme } from '../types';
import { User } from '@supabase/supabase-js';
import i18n from '../utils/i18n';
import { supabase } from '../utils/supabase';

interface AppContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  authStatus: AuthStatus;
  setAuthStatus: (status: AuthStatus) => void;
  selectedDisaster: Disaster;
  setSelectedDisaster: (disaster: Disaster) => void;
  activeTab: TabName;
  setActiveTab: (tab: TabName) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  targetAuthScreen: string | null;
  setTargetAuthScreen: (screen: string | null) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setTheme] = useState<Theme>('light');
  const [authStatus, setAuthStatus] = useState<AuthStatus>(null);
  const [selectedDisaster, setSelectedDisaster] = useState<Disaster>(null);
  const [activeTab, setActiveTab] = useState<TabName>('Home');
  const [user, setUser] = useState<User | null>(null);
  const [targetAuthScreen, setTargetAuthScreen] = useState<string | null>(null);

  // Handle authentication state changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        setAuthStatus('loggedin');
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      if (session?.user) {
        setUser(session.user);
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setAuthStatus('loggedin');
        }
      } else {
        setUser(null);
        if (event === 'SIGNED_OUT') {
          setAuthStatus(null);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    await i18n.changeLanguage(lang);
    // Force a small delay to ensure i18n has updated
    setTimeout(() => {
      setLanguageState(lang);
    }, 100);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setAuthStatus(null);
    setUser(null);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        theme,
        setTheme,
        authStatus,
        setAuthStatus,
        selectedDisaster,
        setSelectedDisaster,
        activeTab,
        setActiveTab,
        user,
        setUser,
        logout,
        targetAuthScreen,
        setTargetAuthScreen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
