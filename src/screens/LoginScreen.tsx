import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../utils/supabase';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../navigation/AuthNavigator';
import { useAuthError } from '../hooks/useAuthError';
import { validateField, validationRules } from '../utils/validation';

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

const LoginScreen = () => {
  const { setAuthStatus } = useAppContext();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const { error: authError, handleAuthError, clearError } = useAuthError();
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    let isValid = true;

    // Validate email
    const emailValidation = validateField(formData.email, [
      validationRules.required('Email'),
      validationRules.email(),
    ]);
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.errors[0]);
      isValid = false;
    } else {
      setEmailError('');
    }

    // Validate password
    const passwordValidation = validateField(formData.password, [
      validationRules.required('Password'),
    ]);
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors[0]);
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    clearError();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        handleAuthError(error);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      handleAuthError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!formData.email) {
      Alert.alert('Error', 'Please enter your email address first.');
      return;
    }

    const emailValidation = validateField(formData.email, [validationRules.email()]);
    if (!emailValidation.isValid) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }

    Alert.alert(
      'Reset Password',
      'A password reset link will be sent to your email address.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: async () => {
            try {
              const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                redirectTo: 'reliefmap://reset-password',
              });
              if (error) {
                Alert.alert('Error', error.message);
              } else {
                Alert.alert('Success', 'Password reset email sent!');
              }
            } catch (error) {
              Alert.alert('Error', 'Failed to send reset email.');
            }
          },
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('login')}</Text>
          <Text style={styles.subtitle}>{t('welcomeBack')}</Text>
        </View>

        {authError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorMessage}>{authError.userFriendlyMessage}</Text>
          </View>
        )}

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="email" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, emailError ? styles.inputError : null]}
              placeholder={t('email')}
              value={formData.email}
              onChangeText={(text) => {
                setFormData({ ...formData, email: text });
                if (emailError) {setEmailError('');}
              }}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="lock" size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }, passwordError ? styles.inputError : null]}
              placeholder={t('password')}
              value={formData.password}
              onChangeText={(text) => {
                setFormData({ ...formData, password: text });
                if (passwordError) {setPasswordError('');}
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.visibilityIcon}
            >
              <MaterialCommunityIcons
                name={showPassword ? 'eye-off' : 'eye'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          {passwordError && <Text style={styles.errorText}>{passwordError}</Text>}

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text style={styles.forgotPasswordText}>{t('forgotPassword')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, loading ? styles.buttonDisabled : null]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {t('login')}
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation.navigate('Onboarding')}
            >
              <Text style={styles.linkText}>{t('backToOnboarding')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => setAuthStatus('guest')}
            >
              <Text style={styles.linkText}>{t('backToHome')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 8,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'System',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 8,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    marginLeft: 12,
  },
  errorText: {
    color: '#f94b6c',
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 4,
    fontFamily: 'System',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'System',
  },
  button: {
    backgroundColor: '#f94b6c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'System',
  },
  linkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkButton: {
    marginVertical: 8,
    alignItems: 'center',
  },
  linkText: {
    color: '#666',
    fontSize: 16,
    fontFamily: 'System',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorMessage: {
    color: '#c62828',
    textAlign: 'center',
    fontSize: 14,
  },
  visibilityIcon: {
    padding: 4,
  },
  inputError: {
    borderColor: '#f94b6c',
    borderWidth: 1,
  },
  authErrorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  authErrorText: {
    color: '#c62828',
    textAlign: 'center',
    fontSize: 14,
  },
});

export default LoginScreen;
