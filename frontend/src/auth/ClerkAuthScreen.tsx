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
  Alert,
} from 'react-native';
import { useSignIn, useSignUp, useClerk } from '@clerk/expo';

const { width: SCREEN_W } = Dimensions.get('window');

// ─── Theme ─────────────────────────────────────────────────────────────────
const T = {
  bg: '#0d0e12',
  surface: '#161822',
  surfaceSec: '#1f2235',
  primary: '#6366f1',
  primaryGlow: 'rgba(99,102,241,0.15)',
  primaryBorder: 'rgba(99,102,241,0.4)',
  secondary: '#10b981',
  accent: '#a855f7',
  accentGlow: 'rgba(168,85,247,0.12)',
  text: '#f3f4f6',
  textMuted: '#9ca3af',
  border: '#2e3248',
  glass: 'rgba(255,255,255,0.04)',
  error: '#f87171',
  success: '#34d399',
};

type AuthMode = 'login' | 'signup' | 'verify';

// ─── FloatingLabel Input ────────────────────────────────────────────────────
function FloatingInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  editable = true,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  editable?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const labelAnim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const hasContent = Boolean(value);

  useEffect(() => {
    Animated.timing(labelAnim, {
      toValue: focused || hasContent ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [focused, hasContent]);

  const labelTop = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [17, 4] });
  const labelSize = labelAnim.interpolate({ inputRange: [0, 1], outputRange: [15, 11] });
  const labelColor = labelAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [T.textMuted, focused ? T.primary : T.textMuted],
  });

  const isSecure = secureTextEntry && !showPw;

  return (
    <View
      style={[
        fStyles.wrapper,
        {
          borderColor: focused ? T.primary : T.border,
          backgroundColor: focused ? 'rgba(99,102,241,0.04)' : T.glass,
        },
      ]}
    >
      <Animated.Text
        style={[fStyles.label, { top: labelTop, fontSize: labelSize, color: labelColor }]}
      >
        {label}
      </Animated.Text>
      <TextInput
        style={fStyles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        secureTextEntry={isSecure}
        keyboardType={keyboardType || 'default'}
        autoCapitalize={autoCapitalize || 'none'}
        editable={editable}
        placeholderTextColor="transparent"
        selectionColor={T.primary}
      />
      {secureTextEntry && (
        <TouchableOpacity style={fStyles.eyeBtn} onPress={() => setShowPw(!showPw)}>
          <Text style={{ color: T.textMuted, fontSize: 16 }}>{showPw ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const fStyles = StyleSheet.create({
  wrapper: {
    borderWidth: 1.5,
    borderRadius: 14,
    marginBottom: 16,
    position: 'relative',
    height: 58,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  label: {
    position: 'absolute',
    left: 16,
    fontWeight: '500',
  },
  input: {
    color: T.text,
    fontSize: 15,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 2,
    height: 40,
  },
  eyeBtn: {
    position: 'absolute',
    right: 14,
    top: 16,
  },
});

// ─── Main Auth Screen ───────────────────────────────────────────────────────
export default function ClerkAuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Clerk hooks
  const { signIn, isLoaded: signInLoaded } = useSignIn() as any;
  const { signUp, isLoaded: signUpLoaded } = useSignUp() as any;
  const { setActive } = useClerk() as any;

  // Slide animation between login/signup
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Gradient pulse
  const glowPulse = useRef(new Animated.Value(0.6)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.6, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const switchMode = (newMode: AuthMode) => {
    Animated.sequence([
      Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
    ]).start(() => {
      setMode(newMode);
      setError('');
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    });
  };

  const clearError = () => setError('');

  // ── Sign In ───────────────────────────────────────────────────────────────
  const handleSignIn = useCallback(async () => {
    if (!signInLoaded || !signIn) return;
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const result = await (signIn as any).create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        onAuthenticated();
      } else {
        setError('Sign in incomplete. Please try again.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }, [signIn, signInLoaded, email, password]);

  // ── Sign Up ───────────────────────────────────────────────────────────────
  const handleSignUp = useCallback(async () => {
    if (!signUpLoaded || !signUp) return;
    if (!email || !password || !firstName) { setError('Please fill in all required fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const signUpAttempt = await (signUp as any).create({ emailAddress: email, password, firstName, lastName });
      await signUpAttempt.prepareVerification({ strategy: 'email_code' });
      switchMode('verify');
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  }, [signUp, signUpLoaded, email, password, firstName, lastName]);

  // ── Verify Email ──────────────────────────────────────────────────────────
  const handleVerify = useCallback(async () => {
    if (!signUpLoaded || !signUp) return;
    if (!code) { setError('Please enter the verification code.'); return; }
    setLoading(true);
    setError('');
    try {
      const result = await (signUp as any).attemptVerification({ strategy: 'email_code', code });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        onAuthenticated();
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  }, [signUp, signUpLoaded, code]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Background glow orbs */}
        <Animated.View style={[styles.glowOrb1, { opacity: glowPulse }]} />
        <Animated.View style={[styles.glowOrb2, { opacity: glowPulse }]} />

        {/* Logo / Brand */}
        <View style={styles.brandSection}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>⚡</Text>
          </View>
          <Text style={styles.brandName}>SkillSprint</Text>
          <Text style={styles.brandTagline}>Learn faster. Build smarter.</Text>
        </View>

        {/* Card */}
        <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
          {/* Tab switcher (login / signup) */}
          {mode !== 'verify' && (
            <View style={styles.tabRow}>
              <TouchableOpacity
                style={[styles.tabBtn, mode === 'login' && styles.tabActive]}
                onPress={() => switchMode('login')}
              >
                <Text style={[styles.tabText, mode === 'login' && styles.tabTextActive]}>
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.tabBtn, mode === 'signup' && styles.tabActive]}
                onPress={() => switchMode('signup')}
              >
                <Text style={[styles.tabText, mode === 'signup' && styles.tabTextActive]}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Error message */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠ {error}</Text>
            </View>
          ) : null}

          {/* ── LOGIN FORM ── */}
          {mode === 'login' && (
            <View>
              <FloatingInput
                label="Email address"
                value={email}
                onChangeText={(t) => { setEmail(t); clearError(); }}
                keyboardType="email-address"
              />
              <FloatingInput
                label="Password"
                value={password}
                onChangeText={(t) => { setPassword(t); clearError(); }}
                secureTextEntry
              />
              <TouchableOpacity style={styles.forgotBtn}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleSignIn}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Sign In →</Text>
                )}
              </TouchableOpacity>
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => switchMode('signup')}>
                <Text style={styles.secondaryBtnText}>Create new account</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ── SIGNUP FORM ── */}
          {mode === 'signup' && (
            <View>
              <View style={styles.nameRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <FloatingInput
                    label="First name *"
                    value={firstName}
                    onChangeText={(t) => { setFirstName(t); clearError(); }}
                    autoCapitalize="words"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FloatingInput
                    label="Last name"
                    value={lastName}
                    onChangeText={(t) => { setLastName(t); clearError(); }}
                    autoCapitalize="words"
                  />
                </View>
              </View>
              <FloatingInput
                label="Email address *"
                value={email}
                onChangeText={(t) => { setEmail(t); clearError(); }}
                keyboardType="email-address"
              />
              <FloatingInput
                label="Password *"
                value={password}
                onChangeText={(t) => { setPassword(t); clearError(); }}
                secureTextEntry
              />
              <Text style={styles.passwordHint}>
                Min 8 chars · one uppercase · one number
              </Text>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleSignUp}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Create Account →</Text>
                )}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                By signing up, you agree to our{' '}
                <Text style={{ color: T.primary }}>Terms of Service</Text> and{' '}
                <Text style={{ color: T.primary }}>Privacy Policy</Text>.
              </Text>
            </View>
          )}

          {/* ── VERIFY EMAIL ── */}
          {mode === 'verify' && (
            <View style={styles.verifySection}>
              <View style={styles.verifyIconWrap}>
                <Text style={styles.verifyIcon}>📬</Text>
              </View>
              <Text style={styles.verifyTitle}>Check your email</Text>
              <Text style={styles.verifySubtitle}>
                We sent a 6-digit code to{'\n'}
                <Text style={{ color: T.primary, fontWeight: '600' }}>{email}</Text>
              </Text>
              <FloatingInput
                label="6-digit code"
                value={code}
                onChangeText={(t) => { setCode(t); clearError(); }}
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
                onPress={handleVerify}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryBtnText}>Verify & Continue →</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.backBtn} onPress={() => switchMode('signup')}>
                <Text style={styles.backBtnText}>← Back to Sign Up</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>

        {/* Footer */}
        <Text style={styles.footerText}>
          Secured by{' '}
          <Text style={{ color: T.primary, fontWeight: '700' }}>Clerk</Text>
          {' '}·{' '}
          <Text style={{ color: T.textMuted }}>SkillSprint © 2025</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: T.bg,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
    minHeight: '100%',
  },

  // Glow orbs
  glowOrb1: {
    position: 'absolute',
    top: -60,
    left: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(99,102,241,0.12)',
  },
  glowOrb2: {
    position: 'absolute',
    bottom: -80,
    right: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(168,85,247,0.08)',
  },

  // Brand
  brandSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
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
  logoText: {
    fontSize: 34,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: T.text,
    letterSpacing: 0.5,
  },
  brandTagline: {
    fontSize: 14,
    color: T.textMuted,
    marginTop: 4,
    letterSpacing: 0.3,
  },

  // Card
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

  // Tabs
  tabRow: {
    flexDirection: 'row',
    backgroundColor: T.surfaceSec,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 9,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: T.primary,
  },
  tabText: {
    color: T.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#ffffff',
  },

  // Error
  errorBox: {
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(248,113,113,0.3)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: T.error,
    fontSize: 13,
    textAlign: 'center',
  },

  // Buttons
  primaryBtn: {
    backgroundColor: T.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryBtnDisabled: {
    opacity: 0.6,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  secondaryBtn: {
    backgroundColor: T.glass,
    borderWidth: 1,
    borderColor: T.border,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  secondaryBtnText: {
    color: T.text,
    fontSize: 15,
    fontWeight: '600',
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 8,
    marginTop: -4,
  },
  forgotText: {
    color: T.primary,
    fontSize: 13,
    fontWeight: '500',
  },

  // Divider
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: T.border,
  },
  dividerText: {
    color: T.textMuted,
    fontSize: 13,
  },

  // Name row
  nameRow: {
    flexDirection: 'row',
  },

  // Password hint
  passwordHint: {
    color: T.textMuted,
    fontSize: 11,
    marginTop: -8,
    marginBottom: 14,
    marginLeft: 4,
  },

  // Terms
  termsText: {
    color: T.textMuted,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 14,
    lineHeight: 17,
  },

  // Verify
  verifySection: {
    alignItems: 'center',
    paddingTop: 8,
  },
  verifyIconWrap: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: T.accentGlow,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyIcon: {
    fontSize: 34,
  },
  verifyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: T.text,
    marginBottom: 10,
  },
  verifySubtitle: {
    color: T.textMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  backBtn: {
    marginTop: 16,
    padding: 10,
  },
  backBtnText: {
    color: T.textMuted,
    fontSize: 14,
  },

  // Footer
  footerText: {
    color: T.textMuted,
    fontSize: 12,
    marginTop: 28,
    textAlign: 'center',
  },
});
