import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';

import { logError } from '../utils/errorHandler';
import CustomModal from '../components/CustomModal.web';

const PRIMARY = '#f94b6c';
const GREY = '#e0e0e0';
const DESTRUCTIVE = '#ff3b30';

const CustomSwitch = ({ value, onValueChange }: { value: boolean; onValueChange: (v: boolean) => void }) => {
  const toggleSwitch = () => onValueChange(!value);
  return (
    <div
      onClick={toggleSwitch}
      style={{
        width: 52,
        height: 32,
        borderRadius: 16,
        backgroundColor: value ? PRIMARY : GREY,
        display: 'flex',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        padding: 2,
        boxSizing: 'border-box',
        marginLeft: 16,
      }}>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: '#fff',
          transform: value ? 'translateX(20px)' : 'translateX(0)',
          transition: 'transform 0.2s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }}
      />
    </div>
  );
};

const SettingsScreen = () => {
  const {
    language,
    setLanguage,
    setAuthStatus,
    theme,
    setTheme,
    user,
    logout,
    authStatus,
    setTargetAuthScreen,
  } = useAppContext();
  const { t } = useTranslation();
  const [offline, setOffline] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [location, setLocation] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const showModal = useCallback((message: string) => {
    setModalMessage(message);
    setModalVisible(true);
  }, []);

  const hideModal = useCallback(() => {
    setModalVisible(false);
    setModalMessage('');
  }, []);

  const handleNotificationsToggle = useCallback((value: boolean) => {
    setNotifications(value);
    if (value) {
      showModal(t('notificationMessage'));
    }
  }, [t, showModal]);

  const handleOfflineToggle = useCallback((value: boolean) => {
    setOffline(value);
    if (value) {
      showModal(t('offlineModeMessage'));
    }
  }, [t, showModal]);

  const handleLocationToggle = useCallback((value: boolean) => {
    setLocation(value);
    if (value) {
      showModal(t('locationServicesMessage'));
    }
  }, [t, showModal]);

  const handleLanguageChange = useCallback(
    async (newLanguage: 'en' | 'es') => {
      try {
        await setLanguage(newLanguage);
      } catch (error) {
        logError(error as Error, undefined, {
          component: 'SettingsScreen',
          action: 'handleLanguageChange',
          language: newLanguage,
        });
        alert('Error: Failed to change language');
      }
    },
    [setLanguage]
  );

  const handleReplayOnboarding = useCallback(() => {
    try {
      setAuthStatus(null);
    } catch (error) {
      logError(error as Error, undefined, {
        component: 'SettingsScreen',
        action: 'handleReplayOnboarding',
      });
      alert('Error: Failed to reset onboarding');
    }
  }, [setAuthStatus]);

  const handleClearCache = useCallback(() => {
    if (window.confirm(t('clearCacheConfirm'))) {
      try {
        alert(t('success') + ': ' + t('cacheCleared'));
      } catch (error) {
        logError(error as Error, undefined, {
          component: 'SettingsScreen',
          action: 'handleClearCache',
        });
        alert('Error: ' + t('cacheClearError'));
      }
    }
  }, [t]);

  const handleLogout = () => {
    if (window.confirm(t('logoutConfirm'))) {
      logout();
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm(t('deleteAccountConfirm'))) {
      alert('Feature Not Implemented: Account deletion is not yet available.');
    }
  };

  const isDark = theme === 'dark';
  const containerStyle = {
    ...styles.container,
    backgroundColor: isDark ? '#1a1a1a' : '#f5f5f7',
  };

  const cardStyle = {
    ...styles.card,
    backgroundColor: isDark ? '#2c2c2e' : '#fff',
  };

  const labelStyle = {
    color: isDark ? '#fff' : '#000',
    fontSize: 17,
    fontWeight: '400' as const,
    flex: 1,
  };

  return (
    <div style={containerStyle}>
        <h1 style={styles.title}>{t('settings')}</h1>
        
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('language')}</h2>
          <div style={styles.langRow}>
            <div
              style={{
                ...styles.langButton,
                backgroundColor: language === 'en' ? PRIMARY : '#e0e0e0',
              }}
              onClick={() => handleLanguageChange('en')}>
              <span style={{
                ...styles.langText,
                color: language === 'en' ? '#fff' : '#000',
              }}>
                {t('english')}
              </span>
            </div>
            <div
              style={{
                ...styles.langButton,
                backgroundColor: language === 'es' ? PRIMARY : '#e0e0e0',
              }}
              onClick={() => handleLanguageChange('es')}>
              <span style={{
                ...styles.langText,
                color: language === 'es' ? '#fff' : '#000',
              }}>
                {t('spanish')}
              </span>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('preferences')}</h2>
          <div style={cardStyle}>
            <div style={styles.row}>
              <div style={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
                </svg>
              </div>
              <span style={labelStyle}>{t('darkMode')}</span>
              <CustomSwitch
                value={theme === 'dark'}
                onValueChange={value => setTheme(value ? 'dark' : 'light')}
              />
            </div>
            
            <div style={styles.divider}></div>
            <div style={styles.row}>
              <div style={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M4.93 4.93l14.14 14.14" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span style={labelStyle}>{t('offlineMode')}</span>
              <CustomSwitch value={offline} onValueChange={handleOfflineToggle} />
            </div>
            
            <div style={styles.divider}></div>
            <div style={styles.row}>
              <div style={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/>
                </svg>
              </div>
              <span style={labelStyle}>{t('notifications')}</span>
              <CustomSwitch value={notifications} onValueChange={handleNotificationsToggle} />
            </div>
            
            <div style={styles.divider}></div>
            <div style={styles.row}>
              <div style={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                </svg>
              </div>
              <span style={labelStyle}>{t('locationServices')}</span>
              <CustomSwitch value={location} onValueChange={handleLocationToggle} />
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('account')}</h2>
          <div style={cardStyle}>
            {user ? (
              <>
                <div style={styles.row}>
                  <div style={styles.iconContainer}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <div style={styles.textContainer}>
                    <span style={labelStyle}>{t('loggedInAs')}</span>
                    <div style={styles.sublabel}>{user.email}</div>
                  </div>
                </div>
                <div style={styles.divider}></div>
                <div style={styles.row} onClick={handleLogout}>
                  <div style={styles.iconContainer}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span style={labelStyle}>{t('logout')}</span>
                </div>
                <div style={styles.divider}></div>
                <div style={styles.row} onClick={handleDeleteAccount}>
                  <div style={styles.iconContainer}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                  <span style={labelStyle}>{t('deleteAccount')}</span>
                </div>
              </>
                      ) : (
            <>
              <div style={styles.row} onClick={() => {
                setTargetAuthScreen('SignIn');
                setAuthStatus(null);
              }}>
                <div style={styles.iconContainer}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    <line x1="19" y1="8" x2="19" y2="14" stroke="currentColor" strokeWidth="2"/>
                    <line x1="22" y1="11" x2="16" y2="11" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.textContainer}>
                  <span style={labelStyle}>{t('signInToReliefMap')}</span>
                  <div style={styles.sublabel}>
                    {authStatus === 'guest' ? t('currentlySignedInAsGuest') : t('notSignedIn')}
                  </div>
                </div>
              </div>
              <div style={styles.divider}></div>
              <div style={styles.row} onClick={() => {
                setTargetAuthScreen('Login');
                setAuthStatus(null);
              }}>
                <div style={styles.iconContainer}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                    <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                    <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div style={styles.textContainer}>
                  <span style={labelStyle}>{t('logInToReliefMap')}</span>
                  <div style={styles.sublabel}>
                    {authStatus === 'guest' ? t('currentlySignedInAsGuest') : t('notSignedIn')}
                  </div>
                </div>
              </div>
            </>
          )}
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>{t('dataAndLegal')}</h2>
          <div style={cardStyle}>
            <div style={styles.row} onClick={handleReplayOnboarding}>
              <div style={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <span style={labelStyle}>{t('replayOnboarding')}</span>
            </div>
            
            <div style={styles.divider}></div>
            <div style={styles.row} onClick={handleClearCache}>
              <div style={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <span style={labelStyle}>{t('clearCachedData')}</span>
            </div>
            
            <div style={styles.divider}></div>
            <div style={styles.row} onClick={() => window.open('https://example.com/privacy', '_blank')}>
              <div style={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span style={labelStyle}>{t('privacyPolicy')}</span>
            </div>
            
            <div style={styles.divider}></div>
            <div style={styles.row} onClick={() => window.open('https://example.com/terms', '_blank')}>
              <div style={styles.iconContainer}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2" fill="none"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </div>
              <span style={labelStyle}>{t('termsOfService')}</span>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <div style={{ ...styles.aboutTitle, color: isDark ? '#ccc' : '#000' }}>{t('aboutTitle')}</div>
          <div style={{ ...styles.aboutSubtitle, color: isDark ? '#999' : '#444' }}>{t('aboutSubtitle')}</div>
          <div style={{ ...styles.footerText, color: isDark ? '#888' : '#888' }}>{t('footer')}</div>
        </div>
        
        <CustomModal
          visible={modalVisible}
          message={modalMessage}
          onClose={hideModal}
          isDark={isDark}
        />
      </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: 24,
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    maxWidth: 600,
    margin: '0 auto',
    width: '100%',
    minHeight: '100vh',
    transition: 'background-color 0.3s ease',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    color: '#000',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    color: '#000',
  },
  langRow: {
    display: 'flex',
    gap: 12,
  },
  langButton: {
    flex: 1,
    padding: '12px 24px',
    borderRadius: 8,
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'all 0.2s ease',
    border: 'none',
  },
  langText: {
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 20px',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 16,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
  },
  textContainer: {
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e5ea',
    marginLeft: 48,
  },
  sublabel: {
    fontSize: 13,
    marginTop: 2,
    transition: 'color 0.3s ease',
    color: '#666',
  },
  chevron: {
    fontSize: 18,
    color: '#c7c7cc',
    fontWeight: 'bold',
  },
  footer: {
    textAlign: 'center',
    paddingTop: 20,
    paddingBottom: 20,
    paddingLeft: 16,
    paddingRight: 16,
  },
  aboutTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
    transition: 'color 0.3s ease',
  },
  aboutSubtitle: {
    fontSize: 13,
    marginBottom: 8,
    transition: 'color 0.3s ease',
  },
  footerText: {
    fontSize: 13,
    transition: 'color 0.3s ease',
  },
};

export default SettingsScreen; 