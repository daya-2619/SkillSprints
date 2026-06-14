import { ClerkProvider, useAuth } from '@clerk/expo';
import { Slot, useRouter, useSegments } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { View, ActivityIndicator, Text, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// ─── Clerk Secure Token Cache ──────────────────────────────────────────────
const tokenCache = {
  async getToken(key: string) {
    try {
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch {
      /* ignore */
    }
  },
};

const PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? '';

// ─── Auth Guard (redirects based on Clerk session) ─────────────────────────
function AuthGuard() {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (isSignedIn && inAuthGroup) {
      // Signed in but still on auth screen → send to app
      router.replace('/(main)/home');
    } else if (!isSignedIn && !inAuthGroup) {
      // Not signed in and not on auth screen → send to login
      router.replace('/(auth)/login');
    }
  }, [isLoaded, isSignedIn, segments]);

  // Show loading screen while Clerk resolves
  if (!isLoaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#0d0e12',
        }}
      >
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ color: '#9ca3af', marginTop: 14, fontSize: 14 }}>
          Loading session...
        </Text>
      </View>
    );
  }

  return <Slot />;
}

// ─── Root Layout ───────────────────────────────────────────────────────────
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY} tokenCache={tokenCache}>
        <StatusBar barStyle="light-content" backgroundColor="#0d0e12" />
        <AuthGuard />
      </ClerkProvider>
    </SafeAreaProvider>
  );
}
