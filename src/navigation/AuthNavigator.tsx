import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from '../context/AppContext';
import OnboardingScreen from '../screens/OnboardingScreen';
import SignInScreen from '../screens/SignInScreen';
import LoginScreen from '../screens/LoginScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

export type AuthStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  Login: undefined;
  ResetPassword: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator = () => {
  const { targetAuthScreen, setTargetAuthScreen } = useAppContext();

  return (
    <Stack.Navigator
      initialRouteName={targetAuthScreen as keyof AuthStackParamList || 'Onboarding'}
      screenOptions={{
        headerShown: false,
        presentation: 'card',
        cardStyle: { backgroundColor: 'white' },
      }}
    >
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
