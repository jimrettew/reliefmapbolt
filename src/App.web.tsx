import React from 'react';
import { AppProvider } from './context/AppContext';
import TabNavigator from './navigation/TabNavigator';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import './utils/i18n';

const App = () => {
  return (
    <div style={{ minHeight: '100vh' }}>
      <AppProvider>
        <TabNavigator />
        <PWAInstallPrompt />
      </AppProvider>
    </div>
  );
};

export default App;
