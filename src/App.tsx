import React from 'react';
import { AppProvider } from './context/AppContext';
import TabNavigator from './navigation/TabNavigator';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import './utils/i18n'; // Import i18n configuration
import { NavigationContainer } from '@react-navigation/native';
import { createNavigationContainerRef } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const navigationRef = createNavigationContainerRef();

const App = () => {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer ref={navigationRef}>
          <TabNavigator />
        </NavigationContainer>
        <PWAInstallPrompt />
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default App;
