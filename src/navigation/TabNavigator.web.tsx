import React from 'react';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import HomeScreen from '../screens/HomeScreen';
import MapScreen from '../screens/MapScreen.web';
import NewsScreen from '../screens/NewsScreen';
import SettingsScreen from '../screens/SettingsScreen.web';
import { MdWhatshot, MdMap, MdUpdate, MdSettings } from 'react-icons/md';
import AuthNavigator from './AuthNavigator.web';

const TabNavigator = () => {
  const { authStatus, activeTab, setActiveTab, theme } = useAppContext();
  const { t } = useTranslation();

  const isDark = theme === 'dark';


  if (!authStatus) {
    return <AuthNavigator />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Home':
        return <HomeScreen />;
      case 'Map':
        return <MapScreen />;
      case 'News':
        return <NewsScreen />;
      case 'Settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      position: 'relative', 
      background: isDark ? '#000' : '#f8fafc',
      transition: 'background-color 0.3s ease'
    }}>
      <div style={{ minHeight: 'calc(100vh - 80px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {renderTabContent()}
      </div>

      {/* Modern floating tab bar */}
      <div style={{
        position: 'fixed',
        left: '50%',
        bottom: '20px',
        transform: 'translateX(-50%)',
        display: 'flex',
        background: isDark 
          ? 'rgba(28, 28, 30, 0.95)' 
          : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '8px',
        gap: '4px',
        boxShadow: isDark
          ? '0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)'
          : '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        border: isDark 
          ? '1px solid rgba(255, 255, 255, 0.1)' 
          : '1px solid rgba(255, 255, 255, 0.2)',
        zIndex: 1000,
        minWidth: '320px',
        transition: 'all 0.3s ease',
      }}>
        {[
          { key: 'Home', icon: MdWhatshot, label: t('disasters') },
          { key: 'Map', icon: MdMap, label: t('map') },
          { key: 'News', icon: MdUpdate, label: t('updates') },
          { key: 'Settings', icon: MdSettings, label: t('settings') },
        ].map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            style={{
              flex: 1,
              background: activeTab === key
                ? 'linear-gradient(135deg, #f94b6c 0%, #ff6b8a 100%)'
                : 'transparent',
              color: activeTab === key ? 'white' : (isDark ? '#8e8e93' : '#64748b'),
              border: 'none',
              borderRadius: '16px',
              padding: '12px 8px',
              cursor: 'pointer',
              outline: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              fontWeight: activeTab === key ? '700' : '600',
              fontSize: '11px',
              letterSpacing: '0.02em',
              transform: activeTab === key ? 'translateY(-2px)' : 'translateY(0)',
              boxShadow: activeTab === key
                ? '0 4px 12px rgba(249, 75, 108, 0.3), 0 2px 4px rgba(249, 75, 108, 0.2)'
                : 'none',
            }}
            onMouseEnter={(e) => {
              if (activeTab !== key) {
                e.currentTarget.style.background = 'rgba(249, 75, 108, 0.08)';
                e.currentTarget.style.color = '#f94b6c';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== key) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = isDark ? '#8e8e93' : '#64748b';
                e.currentTarget.style.transform = 'translateY(0)';
              }
            }}
            onClick={() => setActiveTab(key as any)}
          >
            <Icon
              size={20}
              style={{
                filter: activeTab === key ? 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' : 'none',
                transition: 'all 0.3s ease',
              }}
            />
            <span style={{
              textShadow: activeTab === key ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              transition: 'all 0.3s ease',
            }}>
              {label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TabNavigator;
