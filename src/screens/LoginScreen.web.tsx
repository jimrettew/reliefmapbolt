import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { supabase } from '../utils/supabase';

interface LoginScreenProps {
  navigation?: {
    navigate: (screen: string) => void;
    goBack?: () => void;
  };
}

const LoginScreen = ({ navigation }: LoginScreenProps) => {
  const { setAuthStatus } = useAppContext();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!formData.email || !formData.password) {
      const errorMsg = 'Please fill in all fields';
      setError(errorMsg);
      Alert.alert('Error', errorMsg);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setError(error.message);
        Alert.alert('Error', error.message);
      }
      // Note: authStatus and user will be automatically updated by the auth state change listener
    } catch (error: any) {
      setError(error.message);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('login')}</Text>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.inputContainer}>
        <MdEmail size={24} color="#666" />
        <TextInput
          style={styles.input}
          placeholder={t('email')}
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <MdLock size={24} color="#666" />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder={t('password')}
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          {showPassword ? <MdVisibilityOff size={24} color="#666" /> : <MdVisibility size={24} color="#666" />}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? 'Logging in...' : t('login')}</Text>
      </TouchableOpacity>

      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation?.navigate('Onboarding')}>
          <Text style={styles.linkText}>{t('backToOnboarding')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setAuthStatus('guest')}>
          <Text style={styles.linkText}>{t('backToHome')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#222', marginBottom: 40 },
  errorText: { color: '#ff3333', fontSize: 16, marginBottom: 16, textAlign: 'center', maxWidth: 400 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f5', borderRadius: 12, marginBottom: 16, paddingHorizontal: 16, height: 56, width: '100%', maxWidth: 400 },
  input: { flex: 1, fontSize: 16, color: '#222', marginLeft: 12 },
  button: { backgroundColor: '#f94b6c', padding: 16, borderRadius: 12, alignItems: 'center', width: '100%', maxWidth: 400, marginTop: 16 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkContainer: { alignItems: 'center', marginTop: 16 },
  linkText: { color: '#666', fontSize: 16, marginVertical: 8 },
});

export default LoginScreen;
