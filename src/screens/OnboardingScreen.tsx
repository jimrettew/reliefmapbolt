import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import boltLogo from '../../assets/black_circle_360x360.png';
import mainLogo from '../../assets/logo.png';

type OnboardingScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Onboarding'>;

const OnboardingScreen = () => {
  const { language, setLanguage, setAuthStatus } = useAppContext();
  const [step, setStep] = useState(0);
  const { t, i18n } = useTranslation();
  const navigation = useNavigation<OnboardingScreenNavigationProp>();
  
  const { width, height } = Dimensions.get('window');
  const isTablet = width > 768;
  const isSmallScreen = height < 700;

  const onboardingTexts = [
    t('onboarding.0'),
    t('onboarding.1'),
    t('onboarding.2'),
    t('onboarding.3'),
    t('onboarding.4'),
  ];

  const nextStep = () => {
    if (step < onboardingTexts.length - 1) {setStep(step + 1);}
  };

  const handleSignUp = () => {
    navigation.navigate('SignIn');
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleGuest = () => {
    setAuthStatus('guest');
  };

  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'es' : 'en';
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <TouchableOpacity onPress={() => Linking.openURL('https://bolt.new/')}>
          <Image
            source={boltLogo}
            style={styles.boltLogo}
          />
        </TouchableOpacity>
      </View>
      <Image source={mainLogo} style={styles.logo} />
      <Animatable.View
        animation="fadeIn"
        key={step}
        duration={600}
        style={styles.textContainer}
      >
        <Text style={styles.text}>{onboardingTexts[step]}</Text>
      </Animatable.View>
      {step < onboardingTexts.length - 1 ? (
        <>
          <TouchableOpacity style={styles.button} onPress={nextStep}>
            <Text style={styles.buttonText}>{t('next')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.langButton}
            onPress={toggleLanguage}
          >
            <Text style={styles.langButtonText}>
              {language === 'en' ? t('translate') : t('translateToEnglish')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGuest}>
            <Text style={styles.skipText}>{t('skip')}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.authButtons}>
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>{t('signUp')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>{t('login')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleGuest}>
            <Text style={styles.buttonText}>{t('guest')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logo: { width: 320, height: 320, marginBottom: 20 },
  text: { fontSize: 22, textAlign: 'center', marginHorizontal: 20, fontFamily: 'System' },
  button: { backgroundColor: '#f94b6c', padding: 16, borderRadius: 8, marginVertical: 8, minWidth: 200 },
  buttonText: { color: '#fff', fontSize: 18, textAlign: 'center', fontFamily: 'System' },
  authButtons: { width: '100%', alignItems: 'center' },
  logoContainer: {
    position: 'absolute',
    top: '8%',
    right: '5%',
    zIndex: 100,
  },
  boltLogo: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  langButton: {
    backgroundColor: '#e0e0e0',
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  langButtonText: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 16,
  },
  skipText: {
    color: '#888',
    fontSize: 14,
    fontFamily: 'System',
    marginTop: 24,
    textAlign: 'center',
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    height: 80,
    justifyContent: 'center',
    marginBottom: 20,
  },
});

export default OnboardingScreen;
