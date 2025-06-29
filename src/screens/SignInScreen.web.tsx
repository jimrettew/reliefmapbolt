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
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { MdPerson, MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { supabase } from '../utils/supabase';


interface SignInScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
    goBack?: () => void;
  };
}

const SignInScreen = ({ navigation }: SignInScreenProps) => {
  const { setAuthStatus } = useAppContext();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = t('errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('errors.invalidEmail');
    }

    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('errors.passwordTooShort');
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordsDoNotMatch');
    }

    if (!formData.name) {
      newErrors.name = t('errors.nameRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setSubmitError('');
      setSuccessMessage('');

      const { error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.name,
          },
        },
      });

      if (error) {
        // Handle specific error types
        if (error.message.includes('over_email_send_rate_limit')) {
          throw new Error('Please wait before requesting another confirmation email. Check your email for the previous confirmation.');
        }
        throw error;
      }

      const successMsg = 'Account created successfully! Please check your email to confirm your account.';
      setSuccessMessage(successMsg);
      Alert.alert('Success', successMsg);
    } catch (error: any) {
      const errorMsg = error.message || 'An error occurred during signup';
      setSubmitError(errorMsg);
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('signUp')}</Text>
          <Text style={styles.subtitle}>{t('createAccount')}</Text>
          
          {submitError && <Text style={styles.errorText}>{submitError}</Text>}
          {successMessage && <Text style={styles.successText}>{successMessage}</Text>}
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <MdPerson size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('fullName')}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
          </View>
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <View style={styles.inputContainer}>
            <MdEmail size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t('email')}
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <View style={styles.inputContainer}>
            <MdLock size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={t('password')}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.visibilityIcon}
            >
              {showPassword ?
                <MdVisibilityOff size={24} color="#666" /> :
                <MdVisibility size={24} color="#666" />
              }
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={styles.inputContainer}>
            <MdLock size={24} color="#666" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder={t('confirmPassword')}
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.visibilityIcon}
            >
              {showConfirmPassword ?
                <MdVisibilityOff size={24} color="#666" /> :
                <MdVisibility size={24} color="#666" />
              }
            </TouchableOpacity>
          </View>
          {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={() => {
              handleSignUp();
            }}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? t('signingUp') : t('signUp')}
            </Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <TouchableOpacity
              style={styles.linkButton}
              onPress={() => navigation?.navigate('Onboarding')}
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
    fontFamily: 'System',
  },
  errorText: {
    color: '#f94b6c',
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 4,
    fontFamily: 'System',
  },
  successText: {
    color: '#4caf50',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    textAlign: 'center',
    fontFamily: 'System',
  },
  button: {
    backgroundColor: '#f94b6c',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
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
  visibilityIcon: {
    padding: 4,
  },
});

export default SignInScreen;
