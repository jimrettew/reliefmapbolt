import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { MdGetApp, MdClose } from 'react-icons/md';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowInstallPrompt(true);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeinstallprompt', handler);

      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {return;}

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
  };

  if (Platform.OS !== 'web') {
    return null;
  }

  if (!showInstallPrompt) {return null;}

  return (
    <View style={styles.container}>
      <View style={styles.prompt}>
        <Text style={styles.title}>Install ReliefMap</Text>
        <Text style={styles.description}>
          Add ReliefMap to your home screen for quick access to disaster resources
        </Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.installButton} onPress={handleInstallClick}>
            <MdGetApp size={20} color="#fff" />
            <Text style={styles.installButtonText}>Install</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dismissButton} onPress={handleDismiss}>
            <MdClose size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  prompt: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#f94b6c',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  installButton: {
    backgroundColor: '#f94b6c',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  installButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  dismissButton: {
    padding: 8,
  },
});

export default PWAInstallPrompt;
