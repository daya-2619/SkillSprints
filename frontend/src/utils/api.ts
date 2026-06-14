import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Dynamically resolves the backend API base URL.
 * On emulators and physical devices, it parses the host developer machine's IP
 * from Expo's hostUri to prevent "Network request failed" connection issues.
 */
export const getApiBaseUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Try to extract host IP from Expo's hostUri
  const hostUri = Constants.expoConfig?.hostUri || (Constants.manifest2 as any)?.extra?.expoGo?.developer?.address || '';
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      console.log('Parsed API host IP from hostUri:', ip);
      return `http://${ip}:8000`;
    }
  }

  // Fallback for Android emulator
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8000';
  }

  // Fallback for iOS simulator / web / local development
  return 'http://localhost:8000';
};
