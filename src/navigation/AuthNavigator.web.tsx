import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import OnboardingScreen from '../screens/OnboardingScreen.web';
import SignInScreen from '../screens/SignInScreen.web';
import LoginScreen from '../screens/LoginScreen.web';
import ResetPasswordScreen from '../screens/ResetPasswordScreen.web';

type AuthScreen = 'Onboarding' | 'SignIn' | 'Login' | 'ResetPassword';

const AuthNavigator = () => {
  const { targetAuthScreen, setTargetAuthScreen } = useAppContext();
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>(
    (targetAuthScreen as AuthScreen) || 'Onboarding'
  );

  React.useEffect(() => {
    if (targetAuthScreen) {
      setTargetAuthScreen(null);
    }
  }, [targetAuthScreen, setTargetAuthScreen]);

  const navigate = (screen: string) => {
    setCurrentScreen(screen as AuthScreen);
  };

  const navigation = {
    navigate,
    goBack: () => {

      if (currentScreen === 'Login' || currentScreen === 'SignIn') {
        setCurrentScreen('Onboarding');
      } else if (currentScreen === 'ResetPassword') {
        setCurrentScreen('Login');
      }
    },
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Onboarding':
        return <OnboardingScreen navigation={navigation} />;
      case 'SignIn':
        return <SignInScreen navigation={navigation} />;
      case 'Login':
        return <LoginScreen navigation={navigation} />;
      case 'ResetPassword':
        return <ResetPasswordScreen navigation={navigation} />;
      default:
        return <OnboardingScreen navigation={navigation} />;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {renderScreen()}
    </div>
  );
};

export default AuthNavigator;
