import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

interface CustomModalProps {
  visible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  isDark?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  visible,
  title,
  message,
  onClose,
  isDark = false,
}) => {
  const PRIMARY = '#f94b6c';
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[
          styles.modal,
          { backgroundColor: isDark ? '#2c2c2e' : '#fff' }
        ]}>
          {title && (
            <Text style={[
              styles.title,
              { color: isDark ? '#fff' : '#000' }
            ]}>
              {title}
            </Text>
          )}
          <Text style={[
            styles.message,
            { color: isDark ? '#fff' : '#000' }
          ]}>
            {message}
          </Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: PRIMARY }]}
            onPress={onClose}
          >
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    borderRadius: 16,
    padding: 24,
    minWidth: 280,
    maxWidth: 340,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CustomModal; 