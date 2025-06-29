import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import boltLogo from '../../assets/black_circle_360x360.png';
import mainLogo from '../../assets/logo.png';

interface OnboardingScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
    goBack?: () => void;
  };
}

const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const { language, setLanguage, setAuthStatus } = useAppContext();
  const [step, setStep] = useState(0);
  const { t, i18n } = useTranslation();
  
  const { width, height } = Dimensions.get('window');
  const isTablet = width > 768;
  const isSmallScreen = height < 700;

  // Responsive sizing for better mobile experience
  const logoSize = width < 375 ? 280 : (width < 480 ? 320 : (width < 768 ? 360 : 360));
  const fontSize = width < 480 ? 18 : 22;
  const textContainerHeight = height < 600 ? 80 : 100;

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
    navigation?.navigate('SignIn');
  };

  const handleLogin = () => {
    navigation?.navigate('Login');
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
      <Image source={mainLogo} style={[styles.logo, { width: logoSize, height: logoSize }]} />
      <Animatable.View
        animation="fadeIn"
        key={step}
        duration={600}
        style={[styles.textContainer, { height: textContainerHeight }]}
      >
        <Text style={[styles.text, { fontSize }]}>{onboardingTexts[step]}</Text>
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
  logo: { width: 400, height: 400, marginBottom: 20 },
  text: { fontSize: 22, textAlign: 'center', marginHorizontal: 20, fontFamily: 'System' },
  button: { backgroundColor: '#f94b6c', padding: 16, borderRadius: 8, marginVertical: 8, minWidth: 180 },
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
    height: 100,
    justifyContent: 'center',
    marginBottom: 20,
  },
});

export default OnboardingScreen;
