import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Switch, ScrollView } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { logError } from '../utils/errorHandler';
import CustomModal from '../components/CustomModal';

const PRIMARY = '#f94b6c';
const DESTRUCTIVE = '#ff3b30';

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
        Alert.alert('Error', 'Failed to change language');
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
      Alert.alert('Error', 'Failed to reset onboarding');
    }
  }, [setAuthStatus]);

  const handleClearCache = useCallback(() => {
    Alert.alert(
      t('clearCachedData'),
      t('clearCacheConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        {
          text: t('clear'),
          style: 'destructive',
          onPress: () => {
            try {
              Alert.alert(t('success'), t('cacheCleared'));
            } catch (error) {
              logError(error as Error, undefined, {
                component: 'SettingsScreen',
                action: 'handleClearCache',
              });
              Alert.alert('Error', t('cacheClearError'));
            }
          },
        },
      ]
    );
  }, [t]);

  const handleLogout = () => {
    Alert.alert(t('logout'), t('logoutConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('logout'),
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(t('deleteAccount'), t('deleteAccountConfirm'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('deleteAccount'),
        style: 'destructive',
        onPress: () => {
          Alert.alert(
            'Feature Not Implemented',
            'Account deletion is not yet available.'
          );
        },
      },
    ]);
  };

  const isDark = theme === 'dark';
  const containerStyle = {
    ...styles.container,
    backgroundColor: isDark ? '#000' : '#f2f2f7',
  };

  const cardStyle = {
    ...styles.card,
    backgroundColor: isDark ? '#1c1c1e' : '#fff',
  };

  const labelStyle = {
    ...styles.label,
    color: isDark ? '#fff' : '#000',
  };

  const sectionTitleStyle = {
    ...styles.sectionTitle,
    color: isDark ? '#fff' : '#000',
  };

  return (
    <ScrollView style={containerStyle} showsVerticalScrollIndicator={false}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>{t('settings')}</Text>
      
      <View style={styles.section}>
        <Text style={sectionTitleStyle}>{t('language')}</Text>
        <View style={styles.langRow}>
          <TouchableOpacity
            style={[
              styles.langButton,
              { backgroundColor: language === 'en' ? PRIMARY : '#e0e0e0' }
            ]}
            onPress={() => handleLanguageChange('en')}>
            <Text style={[
              styles.langText,
              { color: language === 'en' ? '#fff' : '#000' }
            ]}>
              {t('english')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.langButton,
              { backgroundColor: language === 'es' ? PRIMARY : '#e0e0e0' }
            ]}
            onPress={() => handleLanguageChange('es')}>
            <Text style={[
              styles.langText,
              { color: language === 'es' ? '#fff' : '#000' }
            ]}>
              {t('spanish')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={sectionTitleStyle}>{t('preferences')}</Text>
        <View style={cardStyle}>
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="moon-waning-crescent" 
                size={20} 
                color={isDark ? '#fff' : '#666'} 
              />
            </View>
            <Text style={labelStyle}>{t('darkMode')}</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={value => setTheme(value ? 'dark' : 'light')}
              trackColor={{ false: '#e0e0e0', true: PRIMARY }}
              thumbColor="#fff"
              style={styles.switch}
            />
          </View>
          
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="cancel" 
                size={20} 
                color={isDark ? '#fff' : '#666'} 
              />
            </View>
            <Text style={labelStyle}>{t('offlineMode')}</Text>
            <Switch
              value={offline}
              onValueChange={handleOfflineToggle}
              trackColor={{ false: '#e0e0e0', true: PRIMARY }}
              thumbColor="#fff"
              style={styles.switch}
            />
          </View>
          
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="bell" 
                size={20} 
                color={isDark ? '#fff' : '#666'} 
              />
            </View>
            <Text style={labelStyle}>{t('notifications')}</Text>
            <Switch
              value={notifications}
              onValueChange={handleNotificationsToggle}
              trackColor={{ false: '#e0e0e0', true: PRIMARY }}
              thumbColor="#fff"
              style={styles.switch}
            />
          </View>
          
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="map-marker" 
                size={20} 
                color={isDark ? '#fff' : '#666'} 
              />
            </View>
            <Text style={labelStyle}>{t('locationServices')}</Text>
            <Switch
              value={location}
              onValueChange={handleLocationToggle}
              trackColor={{ false: '#e0e0e0', true: PRIMARY }}
              thumbColor="#fff"
              style={styles.switch}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={sectionTitleStyle}>{t('account')}</Text>
        <View style={cardStyle}>
          {user ? (
            <>
              <View style={styles.accountRow}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons 
                    name="account-circle" 
                    size={20} 
                    color={isDark ? '#fff' : '#666'} 
                  />
                </View>
                <View style={styles.accountTextContainer}>
                  <Text style={labelStyle}>{t('loggedInAs')}</Text>
                  <Text style={styles.sublabel}>{user.email}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.row} onPress={handleLogout}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons 
                    name="logout" 
                    size={20} 
                    color={isDark ? '#fff' : '#666'} 
                  />
                </View>
                <Text style={labelStyle}>{t('logout')}</Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.row} onPress={handleDeleteAccount}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons 
                    name="delete-outline" 
                    size={20} 
                    color={isDark ? '#fff' : '#666'} 
                  />
                </View>
                <Text style={labelStyle}>{t('deleteAccount')}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.accountRow} onPress={() => {
                setTargetAuthScreen('SignIn');
                setAuthStatus(null);
              }}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons 
                    name="account-plus" 
                    size={20} 
                    color={isDark ? '#fff' : '#666'} 
                  />
                </View>
                <View style={styles.accountTextContainer}>
                  <Text style={labelStyle}>{t('signInToReliefMap')}</Text>
                  <Text style={styles.sublabel}>
                    {authStatus === 'guest' ? t('currentlySignedInAsGuest') : t('notSignedIn')}
                  </Text>
                </View>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={styles.accountRow} onPress={() => {
                setTargetAuthScreen('Login');
                setAuthStatus(null);
              }}>
                <View style={styles.iconContainer}>
                  <MaterialCommunityIcons 
                    name="login" 
                    size={20} 
                    color={isDark ? '#fff' : '#666'} 
                  />
                </View>
                <View style={styles.accountTextContainer}>
                  <Text style={labelStyle}>{t('logInToReliefMap')}</Text>
                  <Text style={styles.sublabel}>
                    {authStatus === 'guest' ? t('currentlySignedInAsGuest') : t('notSignedIn')}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={sectionTitleStyle}>{t('dataAndLegal')}</Text>
        <View style={cardStyle}>
          <TouchableOpacity style={styles.row} onPress={handleReplayOnboarding}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="replay" 
                size={20} 
                color={isDark ? '#fff' : '#666'} 
              />
            </View>
            <Text style={labelStyle}>{t('replayOnboarding')}</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row} onPress={handleClearCache}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="delete" 
                size={20} 
                color={isDark ? '#fff' : '#666'} 
              />
            </View>
            <Text style={labelStyle}>{t('clearCachedData')}</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="file-document" 
                size={20} 
                color={isDark ? '#fff' : '#666'} 
              />
            </View>
            <Text style={labelStyle}>{t('privacyPolicy')}</Text>
          </TouchableOpacity>
          
          <View style={styles.divider} />
          <TouchableOpacity style={styles.row}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons 
                name="clipboard-text" 
                size={20} 
                color={isDark ? '#fff' : '#666'} 
              />
            </View>
            <Text style={labelStyle}>{t('termsOfService')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 40 }} />
      
      <CustomModal
        visible={modalVisible}
        message={modalMessage}
        onClose={hideModal}
        isDark={isDark}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  langRow: {
    flexDirection: 'row',
    gap: 12,
  },
  langButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  langText: {
    fontSize: 16,
    fontWeight: '500',
  },
  card: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    minHeight: 50,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    minHeight: 60,
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  accountTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  label: {
    fontSize: 17,
    flex: 1,
  },
  sublabel: {
    fontSize: 13,
    marginTop: 2,
    color: '#666',
    lineHeight: 18,
  },
  switch: {
    marginLeft: 16,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#e5e5ea',
    marginLeft: 48,
  },
});

export default SettingsScreen;
