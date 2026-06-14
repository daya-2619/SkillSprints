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
} from 'react-native';
import { useSignUp, useClerk } from '@clerk/expo';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const T = {
  bg: '#0d0e12',
  surface: '#161822',
  surfaceSec: '#1f2235',
  primary: '#6366f1',
  primaryGlow: 'rgba(99,102,241,0.15)',
  primaryBorder: 'rgba(99,102,241,0.35)',
  accent: '#a855f7',
  accentGlow: 'rgba(168,85,247,0.12)',
  text: '#f3f4f6',
  textMuted: '#9ca3af',
  border: '#2e3248',
  glass: 'rgba(255,255,255,0.04)',
  error: '#f87171',
  success: '#34d399',
};

function FloatingInput({
  label,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric';
  autoCapitalize?: 'none' | 'sentences' | 'words';
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
        { borderColor: focused ? T.primary : T.border, backgroundColor: focused ? 'rgba(99,102,241,0.04)' : T.glass },
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
        autoCapitalize={autoCapitalize || 'none'}
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
  wrapper: { borderWidth: 1.5, borderRadius: 14, marginBottom: 16, height: 58, justifyContent: 'flex-end', paddingBottom: 8, position: 'relative' },
  label: { position: 'absolute', left: 16, fontWeight: '500' },
  input: { color: T.text, fontSize: 15, paddingHorizontal: 16, paddingTop: 10, height: 40 },
  eye: { position: 'absolute', right: 14, top: 16 },
});

// ─── Signup Screen ─────────────────────────────────────────────────────────
export default function SignupScreen() {
  const { signUp } = useSignUp();          // v3: SignUpSignalValue only has signUp
  const { setActive } = useClerk();         // v3: setActive moved to useClerk()
  const router = useRouter();

  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const glowPulse = useRef(new Animated.Value(0.5)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 1, duration: 3000, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.5, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleSignUp = useCallback(async () => {
    if (!signUp) return; // signUp is undefined when Clerk isn't loaded yet
    if (!firstName.trim() || !email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUp.create({
        emailAddress: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      await (signUp as any).prepareVerification({ strategy: 'email_code' });
      setStep('verify');
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || 'Sign up failed.');
    } finally {
      setLoading(false);
    }
  }, [signUp, firstName, lastName, email, password]);


  const handleVerify = useCallback(async () => {
    if (!signUp) return; // signUp is undefined when Clerk isn't loaded yet
    if (!code.trim()) { setError('Please enter the verification code.'); return; }
    setLoading(true);
    setError('');
    try {
      const result = await (signUp as any).attemptVerification({ strategy: 'email_code', code: code.trim() });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/(main)/home');
      } else {
        setError('Verification failed. Please try again.');
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.longMessage || err.message || 'Verification failed.');
    } finally {
      setLoading(false);
    }
  }, [signUp, code]);


  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Animated.View style={[s.orb1, { opacity: glowPulse }]} />
          <Animated.View style={[s.orb2, { opacity: glowPulse }]} />

          {/* Brand */}
          <View style={s.brand}>
            <View style={s.logoBox}>
              <Text style={s.logoEmoji}>⚡</Text>
            </View>
            <Text style={s.brandName}>SkillSprint</Text>
            <Text style={s.brandSub}>Start your learning sprint today</Text>
          </View>

          {/* Card */}
          <View style={s.card}>
            {step === 'form' ? (
              <>
                <Text style={s.cardTitle}>Create account</Text>
                <Text style={s.cardSub}>Join thousands of learners on SkillSprint</Text>

                {error ? (
                  <View style={s.errorBox}>
                    <Text style={s.errorText}>⚠ {error}</Text>
                  </View>
                ) : null}

                {/* Name row */}
                <View style={s.nameRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <FloatingInput label="First name *" value={firstName} onChangeText={(t) => { setFirstName(t); setError(''); }} autoCapitalize="words" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <FloatingInput label="Last name" value={lastName} onChangeText={setLastName} autoCapitalize="words" />
                  </View>
                </View>

                <FloatingInput label="Email address *" value={email} onChangeText={(t) => { setEmail(t); setError(''); }} keyboardType="email-address" />
                <FloatingInput label="Password *" value={password} onChangeText={(t) => { setPassword(t); setError(''); }} secureTextEntry />
                <Text style={s.hint}>Min 8 characters · 1 uppercase · 1 number</Text>

                <TouchableOpacity style={[s.primaryBtn, loading && s.disabled]} onPress={handleSignUp} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Create Account →</Text>}
                </TouchableOpacity>

                <Text style={s.terms}>
                  By signing up you agree to our{' '}
                  <Text style={{ color: T.primary }}>Terms</Text> and{' '}
                  <Text style={{ color: T.primary }}>Privacy Policy</Text>.
                </Text>

                <View style={s.divider}>
                  <View style={s.divLine} />
                  <Text style={s.divText}>already have an account?</Text>
                  <View style={s.divLine} />
                </View>

                <Link href="/(auth)/login" asChild>
                  <TouchableOpacity style={s.secondaryBtn}>
                    <Text style={s.secondaryBtnText}>Sign In Instead</Text>
                  </TouchableOpacity>
                </Link>
              </>
            ) : (
              /* Verify step */
              <View style={s.verifySection}>
                <View style={s.verifyIconBox}>
                  <Text style={{ fontSize: 36 }}>📬</Text>
                </View>
                <Text style={s.cardTitle}>Check your email</Text>
                <Text style={s.cardSub}>
                  We sent a 6-digit code to{'\n'}
                  <Text style={{ color: T.primary, fontWeight: '600' }}>{email}</Text>
                </Text>

                {error ? (
                  <View style={s.errorBox}>
                    <Text style={s.errorText}>⚠ {error}</Text>
                  </View>
                ) : null}

                <FloatingInput label="6-digit code" value={code} onChangeText={(t) => { setCode(t); setError(''); }} keyboardType="numeric" />

                <TouchableOpacity style={[s.primaryBtn, loading && s.disabled]} onPress={handleVerify} disabled={loading}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={s.primaryBtnText}>Verify & Continue →</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={s.backBtn} onPress={() => setStep('form')}>
                  <Text style={s.backBtnText}>← Back to Sign Up</Text>
                </TouchableOpacity>
              </View>
            )}
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
  scroll: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 40 },
  orb1: { position: 'absolute', top: -80, left: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(99,102,241,0.10)' },
  orb2: { position: 'absolute', bottom: -80, right: -80, width: 300, height: 300, borderRadius: 150, backgroundColor: 'rgba(168,85,247,0.07)' },
  brand: { alignItems: 'center', marginBottom: 36 },
  logoBox: { width: 72, height: 72, borderRadius: 22, backgroundColor: T.primaryGlow, borderWidth: 1.5, borderColor: T.primaryBorder, justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  logoEmoji: { fontSize: 34 },
  brandName: { fontSize: 28, fontWeight: '800', color: T.text, letterSpacing: 0.4 },
  brandSub: { fontSize: 14, color: T.textMuted, marginTop: 4 },
  card: { width: '100%', maxWidth: 440, backgroundColor: T.surface, borderRadius: 24, borderWidth: 1, borderColor: T.border, padding: 28, shadowColor: '#000', shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.4, shadowRadius: 32, elevation: 20 },
  cardTitle: { fontSize: 22, fontWeight: '700', color: T.text, marginBottom: 4 },
  cardSub: { fontSize: 14, color: T.textMuted, marginBottom: 24, lineHeight: 22, textAlign: 'center' },
  nameRow: { flexDirection: 'row' },
  hint: { color: T.textMuted, fontSize: 11, marginTop: -8, marginBottom: 14, marginLeft: 4 },
  errorBox: { backgroundColor: 'rgba(248,113,113,0.1)', borderWidth: 1, borderColor: 'rgba(248,113,113,0.3)', borderRadius: 10, padding: 12, marginBottom: 16 },
  errorText: { color: T.error, fontSize: 13, textAlign: 'center' },
  primaryBtn: { backgroundColor: T.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  disabled: { opacity: 0.6 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700', letterSpacing: 0.3 },
  secondaryBtn: { backgroundColor: T.glass, borderWidth: 1, borderColor: T.border, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  secondaryBtnText: { color: T.text, fontSize: 15, fontWeight: '600' },
  terms: { color: T.textMuted, fontSize: 11, textAlign: 'center', marginTop: 12, marginBottom: 4, lineHeight: 17 },
  divider: { flexDirection: 'row', alignItems: 'center', marginVertical: 20, gap: 12 },
  divLine: { flex: 1, height: 1, backgroundColor: T.border },
  divText: { color: T.textMuted, fontSize: 11, textAlign: 'center' },
  footer: { color: T.textMuted, fontSize: 12, marginTop: 28 },
  // Verify step
  verifySection: { alignItems: 'center' },
  verifyIconBox: { width: 72, height: 72, borderRadius: 20, backgroundColor: T.accentGlow, borderWidth: 1, borderColor: 'rgba(168,85,247,0.3)', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  backBtn: { padding: 12, marginTop: 10 },
  backBtnText: { color: T.textMuted, fontSize: 14 },
});
