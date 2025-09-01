import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Toast, { BaseToastProps } from 'react-native-toast-message';
import { Feather } from '@expo/vector-icons';

interface CustomToastProps extends BaseToastProps {
  text1?: string;
  text2?: string;
}

const toastConfig = {
  // Success Toast
  appSuccess: ({ text1, text2 }: CustomToastProps) => (
    <View style={styles.toastContainer}>
      <View style={styles.accentSuccess} />
      <View style={[styles.iconContainer, styles.iconBgSuccess]}>
        <Feather name="check" size={20} color="#FFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.subtitle}>{text2}</Text>
      </View>
    </View>
  ),

  // Error Toast
  appError: ({ text1, text2 }: CustomToastProps) => (
    <View style={styles.toastContainer}>
      <View style={styles.accentError} />
      <View style={[styles.iconContainer, styles.iconBgError]}>
        <Feather name="x-circle" size={20} color="#FFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.subtitle}>{text2}</Text>
      </View>
    </View>
  ),

  // Warning/Action Toast
  appWarning: ({ text1, text2 }: CustomToastProps) => (
    <View style={styles.toastContainer}>
      <View style={styles.accentWarning} />
      <View style={[styles.iconContainer, styles.iconBgWarning]}>
        <Feather name="alert-triangle" size={20} color="#FFF" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        <Text style={styles.subtitle}>{text2}</Text>
      </View>
    </View>
  ),
};

export default function CustomToast() {
  return (
    <Toast config={toastConfig} />
  );
}

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    backgroundColor: '#2D2D2D', // Dark background
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 8,
    overflow: 'hidden', // Ensures the accent bar stays within the border radius
  },
  accentSuccess: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#34D399', // Green
  },
  accentError: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#EF4444', // Red
  },
  accentWarning: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 6,
    backgroundColor: '#F59E0B', // Yellow/Gold
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15, // Space from the accent bar
    marginRight: 12,
  },
  iconBgSuccess: { backgroundColor: '#10B981' },
  iconBgError: { backgroundColor: '#DC2626' },
  iconBgWarning: { backgroundColor: '#D97706' },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  subtitle: {
    color: '#E5E7EB', // Lighter gray for subtitle
    fontSize: 13,
    marginTop: 2,
  },
});