import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { supabase } from '../utils/supabase';

const ResetPasswordScreen = () => {
  const { setAuthStatus } = useAppContext();
  const { t } = useTranslation();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const handleRecoveryToken = async () => {
      const hash = window.location.hash;
      if (hash && hash.includes('type=recovery')) {
    
      }
    };

    if (Platform.OS === 'web') {
      handleRecoveryToken();
    }
  }, []);

  const handlePasswordReset = async () => {
    setError(null);

    if (newPassword !== confirmPassword) {
      setError(t('errors.passwordsDoNotMatch'));
      return;
    }

    if (newPassword.length < 6) {
      setError(t('errors.passwordTooShort'));
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {throw error;}

      setSuccess(true);
      setTimeout(() => {
        setAuthStatus('loggedin');
      }, 2000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('resetPassword')}</Text>
        <Text style={styles.subtitle}>{t('enterNewPassword')}</Text>
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {success && (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>{t('passwordResetSuccess')}</Text>
        </View>
      )}

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('newPassword')}
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-check" size={24} color="#666" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={t('confirmNewPassword')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handlePasswordReset}
          disabled={loading || success}
        >
          <Text style={styles.buttonText}>
            {loading ? t('resettingPassword') : t('resetPassword')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#222',
    marginLeft: 12,
  },
  inputIcon: {
    marginRight: 12,
  },
  button: {
    backgroundColor: '#f94b6c',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  buttonDisabled: {
    backgroundColor: '#ffb4b4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
    textAlign: 'center',
  },
  successContainer: {
    backgroundColor: '#e8f5e9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    color: '#2e7d32',
    textAlign: 'center',
  },
});

export default ResetPasswordScreen;
