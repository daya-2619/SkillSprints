// src/theme/index.ts
import { StyleSheet } from 'react-native';

export const colors = {
  primary: 'hsl(210, 70%, 55%)',
  secondary: 'hsl(160, 60%, 45%)',
  background: '#121212',
  surface: '#1E1E1E',
  glass: 'rgba(255, 255, 255, 0.1)',
  textPrimary: '#FFFFFF',
  textSecondary: '#CCCCCC',
  error: '#FF453A',
  success: '#32D74B',
  primaryLight: 'rgba(10, 132, 255, 0.15)',
  accent: '#A855F7',
};

export const gradients = {
  primary: ['#0A84FF', '#005BB5'],
  dark: ['#1E1E1E', '#121212'],
};

export const shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
};

export const typography = {
  heading: {
    fontFamily: 'Inter',
    fontWeight: '700' as '700',
    fontSize: 24,
    color: colors.textPrimary,
  },
  body: {
    fontFamily: 'Inter',
    fontWeight: '400' as '400',
    fontSize: 16,
    color: colors.textPrimary,
  },
  bodyBold: {
    fontFamily: 'Inter',
    fontWeight: '700' as '700',
    fontSize: 16,
    color: colors.textPrimary,
  },
};

export default StyleSheet.create({});
