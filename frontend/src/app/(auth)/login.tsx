import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useSignIn, useClerk } from '@clerk/expo';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import { getApiBaseUrl } from '../../utils/api';

const T = {
  bg: '#0d0e12',
  surface: '#161822',
  surfaceSec: '#1f2235',
  primary: '#6366f1',
  primaryGlow: 'rgba(99,102,241,0.15)',
  primaryBorder: 'rgba(99,102,241,0.35)',
  accent: '#a855f7',
  accentGlow: 'rgba(168,85,247,0.10)',
  text: '#f3f4f6',
  textMuted: '#9ca3af',
  border: '#2e3248',
  glass: 'rgba(255,255,255,0.04)',
  error: '#f87171',
  style: '#f3f4f6',
};

// ─── Animated Floating Label Input ─────────────────────────────────────────
function FloatingInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
}) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: focused || value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focused, value]);

  const labelTop = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [17, 4] });
  const labelSize = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [T.textMuted, focused ? T.primary : T.textMuted],
  });

  return (
    <View
      style={[
        fi.wrapper,
        {
          borderColor: focused ? T.primary : T.border,
          backgroundColor: focused ? 'rgba(99,102,241,0.04)' : T.glass,
        },
      ]}
    >
      <Animated.Text style={[fi.label, { top: labelTop, fontSize: labelSize, color: labelColor }]}>
        {label}
      </Animated.Text>
      <TextInput
        style={fi.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={secureTextEntry && !showPw}
        keyboardType={keyboardType || 'default'}
        autoCapitalize="none"
        placeholderTextColor="transparent"
        selectionColor={T.primary}
      />
      {secureTextEntry && (
        <TouchableOpacity style={fi.eye} onPress={() => setShowPw(!showPw)}>
          <Text style={{ color: T.textMuted, fontSize: 16 }}>{showPw ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const fi = StyleSheet.create({
  wrapper: {
    borderWidth: 1.5,
    borderRadius: 14,
    marginBottom: 16,
    height: 58,
    justifyContent: 'flex-end',
    paddingBottom: 8,
    position: 'relative',
  },
  label: { position: 'absolute', left: 16, fontWeight: '500' },
  input: { color: T.text, fontSize: 15, paddingHorizontal: 16, paddingTop: 10, height: 40 },
  eye: { position: 'absolute', right: 14, top: 16 },
});

// ─── Login Screen ──────────────────────────────────────────────────────────
export default function LoginScreen() {
  const { signIn } = useSignIn();          // v3: SignInSignalValue only has signIn
  const { setActive } = useClerk();         // v3: setActive moved to useClerk()
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Glow pulse animation
  const glowPulse = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.5, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleSignIn = useCallback(async () => {
    if (!signIn) return; // signIn is undefined when Clerk isn't loaded yet
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      console.log('Attempting Clerk sign in for:', email.trim());
      const result = await (signIn as any).create({ identifier: email.trim(), password });
      console.log('Clerk sign in result status:', result.status);
      console.log('Clerk sign in full result:', JSON.stringify(result, null, 2));

      if (result.status === 'complete') {
        // Retrieve and sync with the backend database
        try {
          const apiBaseUrl = getApiBaseUrl();
          console.log('Syncing login with backend at:', apiBaseUrl);
          
          const formData = new URLSearchParams();
          formData.append('username', email.trim());
          formData.append('password', password);

          let backendResp = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
          });

          // If database user does not exist, auto-register them
          if (backendResp.status === 401 || backendResp.status === 404) {
            console.log('User not found in backend DB, auto-registering...');
            const name = email.trim().split('@')[0];
            const signupResp = await fetch(`${apiBaseUrl}/api/v1/auth/signup`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: email.trim(),
                password: password,
                name: name || 'Student',
              }),
            });

            if (signupResp.ok) {
              console.log('Backend DB auto-registration succeeded, logging in...');
              backendResp = await fetch(`${apiBaseUrl}/api/v1/auth/login`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData.toString(),
              });
            } else {
              console.warn('Backend DB auto-registration failed:', await signupResp.text());
            }
          }

          if (backendResp.ok) {
            const tokenData = await backendResp.json();
            console.log('Backend sync login successful.');
            await SecureStore.setItemAsync('access_token', tokenData.access_token);
          } else {
            console.warn('Backend login failed with status:', backendResp.status);
          }
        } catch (dbErr) {
          console.error('Failed to sync login/signup with backend database:', dbErr);
        }

        await setActive({ session: result.createdSessionId });
        router.replace('/(main)/home');
      } else {
        setError(`Sign in incomplete. Status: ${result.status}. Please check if email verification is completed.`);
      }
    } catch (err: any) {
      console.error('Clerk sign in error:', err);
      setError(err.errors?.[0]?.longMessage || err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }, [signIn, email, password]);

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Background glows */}
          <Animated.View style={[s.orb1, { opacity: glowPulse }]} />
          <Animated.View style={[s.orb2, { opacity: glowPulse }]} />

          {/* Brand */}
          <View style={s.brand}>
            <View style={s.logoBox}>
              <Text style={s.logoEmoji}>⚡</Text>
            </View>
            <Text style={s.brandName}>SkillSprint</Text>
            <Text style={s.brandSub}>Learn faster. Build smarter.</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            <Text style={s.cardTitle}>Welcome back</Text>
            <Text style={s.cardSub}>Sign in to your account to continue</Text>

            {error ? (
              <View style={s.errorBox}>
                <Text style={s.errorText}>⚠ {error}</Text>
              </View>
            ) : null}

            <FloatingInput
              label="Email address"
              value={email}
              onChangeText={(t) => { setEmail(t); setError(''); }}
              keyboardType="email-address"
            />
            <FloatingInput
              label="Password"
              value={password}
              onChangeText={(t) => { setPassword(t); setError(''); }}
              secureTextEntry
            />

            <TouchableOpacity style={s.forgotBtn}>
              <Text style={s.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[s.primaryBtn, loading && s.primaryBtnDisabled]}
              onPress={handleSignIn}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.primaryBtnText}>Sign In →</Text>
              )}
            </TouchableOpacity>

            <View style={s.divider}>
              <View style={s.divLine} />
              <Text style={s.divText}>or</Text>
              <View style={s.divLine} />
            </View>

            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity style={s.secondaryBtn}>
                <Text style={s.secondaryBtnText}>Create new account</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <Text style={s.footer}>
            Secured by <Text style={{ color: T.primary, fontWeight: '700' }}>Clerk</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: T.bg },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  orb1: {
    position: 'absolute',
    top: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(99,102,241,0.10)',
  },
  orb2: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(168,85,247,0.07)',
  },
  brand: { alignItems: 'center', marginBottom: 36 },
  logoBox: {
    width: 72,
    height: 72,
    borderRadius: 22,
    backgroundColor: T.primaryGlow,
    borderWidth: 1.5,
    borderColor: T.primaryBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  logoEmoji: { fontSize: 34 },
  brandName: { fontSize: 28, fontWeight: '800', color: T.text, letterSpacing: 0.4 },
  brandSub: { fontSize: 14, color: T.textMuted, marginTop: 4 },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: T.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: T.border,
    padding: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.4,
    shadowRadius: 32,
    elevation: 20,
  },
  cardTitle: { fontSize: 22, fontWeight: '700', color: T.text, marginBottom: 4 },
  cardSub: { fontSize: 14, color: T.textMuted, marginBottom: 24 },
  errorBox: {
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: T.error, fontSize: 13, textAlign: 'center' },
  forgotBtn: { alignSelf: 'flex-end', marginTop: -4, marginBottom: 12 },
  forgotText: { color: T.primary, fontSize: 13, fontWeight: '500' },
  primaryBtn: {
    backgroundColor: T.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  secondaryBtn: {
    backgroundColor: T.glass,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryBtnText: { color: T.text, fontSize: 15, fontWeight: '600' },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 },
  divLine: { flex: 1, height: 1, backgroundColor: T.border },
  divText: { color: T.textMuted, fontSize: 13 },
  footer: { color: T.textMuted, fontSize: 12, marginTop: 28 },
});
