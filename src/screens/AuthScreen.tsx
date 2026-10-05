import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { COLORS } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { BrandLogo } from '../components/BrandLogo';

const SUCCESS_GREETINGS = [
  { lang: 'English', getHeading: (name: string) => `Congratulations, ${name}!` },
  { lang: 'Français', getHeading: (name: string) => `Félicitations, ${name}!` },
  { lang: 'Hausa', getHeading: (name: string) => `Barka, ${name}!` },
  { lang: 'Yorùbá', getHeading: (name: string) => `Ẹ kú oríire, ${name}!` },
  { lang: 'Igbo', getHeading: (name: string) => `Ekele, ${name}!` },
];

function RotatingSuccessTitle({ name }: { name: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SUCCESS_GREETINGS.length);
    }, 3500);

    const stopTimer = setTimeout(() => {
      clearInterval(timer);
    }, 120000);

    return () => {
      clearInterval(timer);
      clearTimeout(stopTimer);
    };
  }, []);

  const current = SUCCESS_GREETINGS[index];

  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{ backgroundColor: '#E6F5ED', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, marginBottom: 8 }}>
        <Text style={{ fontSize: 10, fontWeight: '800', color: COLORS.primaryDark }}>
          {current.lang}
        </Text>
      </View>
      <Text style={styles.successTitle}>
        {current.getHeading(name)}
      </Text>
    </View>
  );
}

const PROFILE_GREETINGS = [
  'Welcome back',
  'Bon retour',
  'Barka da dawowa',
  'Ẹ kú àbọ̀',
  'Nnọọ ọzọ',
];

function RotatingProfileGreeting({ name }: { name: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % PROFILE_GREETINGS.length);
    }, 3500);

    const stopTimer = setTimeout(() => {
      clearInterval(timer);
    }, 120000);

    return () => {
      clearInterval(timer);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <Text style={styles.welcomeGreeting}>
      {PROFILE_GREETINGS[index]}, <Text style={{ color: COLORS.primary }}>{name}</Text>!
    </Text>
  );
}

export function AuthScreen() {
  const { user, signIn, signUp, signInWithGoogle, signOut, isLoading } = useAuth();
  const { refreshCart } = useCart();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState<{
    email: string;
    name: string;
  } | null>(null);

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setSubmitting(true);
    if (isLoginMode) {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message || 'Failed to sign in. Please verify credentials.');
      } else {
        refreshCart();
      }
    } else {
      const res = await signUp(email, password, fullName);
      if (res.error) {
        setErrorMsg(res.error.message || 'Registration failed.');
      } else {
        // Show explicit registration success screen requiring login
        setRegistrationSuccess({
          email: res.data?.email || email.trim(),
          name: res.data?.firstName || fullName.trim() || 'Valued Customer',
        });
        setPassword('');
      }
    }
    setSubmitting(false);
  };

  const handleGoogleAuth = async () => {
    setErrorMsg('');
    setSubmitting(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setErrorMsg(error.message || 'Google Sign-In failed.');
    } else {
      refreshCart();
    }
    setSubmitting(false);
  };

  const handleSignOut = async () => {
    await signOut();
    refreshCart();
  };

  // 1. Logged In State: Show Profile & Sign Out
  if (user) {
    const firstName =
      user.user_metadata?.first_name ||
      user.user_metadata?.full_name?.split(' ')[0] ||
      user.email?.split('@')[0] ||
      '';

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profileCard}>
          <BrandLogo size="md" showText={false} />

          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(firstName?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </Text>
          </View>

          <RotatingProfileGreeting name={firstName || 'Customer'} />
          <Text style={styles.userEmail}>{user.email}</Text>

          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Connected to Sawfy White Cloud</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Cross-Platform Synchronization Active</Text>
            <Text style={styles.infoText}>
              You are logged in with the exact same account as the web storefront. Any items added to your cart here or on shop.sawfywhite.com sync in real-time.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={handleSignOut}
            activeOpacity={0.8}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 2. Explicit Registration Success Screen
  if (registrationSuccess) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.successCard}>
          <BrandLogo size="md" showText={false} />

          <View style={styles.successIcon}>
            <Text style={styles.successCheck}>✓</Text>
          </View>

          <View style={styles.successBadge}>
            <Text style={styles.successBadgeText}>🎉 Registration Successful</Text>
          </View>

          <RotatingSuccessTitle name={registrationSuccess.name} />

          <Text style={styles.successSubtitle}>
            Your Sawfy White account has been created and activated. A personalized welcome confirmation has also been dispatched to:
          </Text>
          <Text style={styles.successEmailHighlight}>
            {registrationSuccess.email}
          </Text>

          <View style={styles.successPromptBox}>
            <Text style={styles.successPromptText}>
              Please sign in with your email and password below to access your account and synchronize your cart.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={() => {
              setRegistrationSuccess(null);
              setIsLoginMode(true);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.submitBtnText}>Sign In with Your Password →</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 3. Logged Out State: Show Sign In or Sign Up
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          {/* Brand Logo Header */}
          <View style={styles.logoHeader}>
            <BrandLogo size="md" showText={true} />
          </View>

          <Text style={styles.headerTitle}>
            {isLoginMode ? 'Welcome Back' : 'Create an Account'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {isLoginMode
              ? 'Sign in with your Sawfy White web credentials'
              : 'Register to synchronize your cart across web and mobile'}
          </Text>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Google Sign-In Button */}
          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleAuth}
            disabled={submitting || isLoading}
            activeOpacity={0.85}
          >
            <Text style={styles.googleIconText}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {!isLoginMode && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Babatunde"
                placeholderTextColor="#999999"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.input}
              placeholder="you@domain.com"
              placeholderTextColor="#999999"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password (min. 6 characters) *</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#999999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSubmit}
            disabled={submitting || isLoading}
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.submitBtnText}>
                {isLoginMode ? 'Sign In →' : 'Create Account →'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleBtn}
            onPress={() => {
              setErrorMsg('');
              setIsLoginMode(!isLoginMode);
            }}
          >
            <Text style={styles.toggleText}>
              {isLoginMode
                ? "Don't have an account yet? Create one"
                : 'Already have an account? Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
    paddingVertical: 32,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 135, 81, 0.15)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  logoHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textDark,
    textAlign: 'center',
    letterSpacing: -0.4,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 20,
    lineHeight: 18,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  googleIconText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#4285F4',
  },
  googleBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  dividerText: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#991B1B',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    fontSize: 13,
    color: COLORS.textDark,
    backgroundColor: '#FAFAFA',
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  toggleBtn: {
    marginTop: 16,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  profileCard: {
    backgroundColor: COLORS.cardBg,
    margin: 16,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#B3E0C9',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.primary,
  },
  welcomeGreeting: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textDark,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
    marginBottom: 20,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#065F46',
  },
  infoBox: {
    backgroundColor: '#FAF8F5',
    padding: 16,
    borderRadius: 16,
    width: '100%',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#F0EDE8',
  },
  infoTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 11,
    color: COLORS.textMuted,
    lineHeight: 16,
  },
  signOutBtn: {
    backgroundColor: '#FEE2E2',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  signOutText: {
    color: '#DC2626',
    fontWeight: '800',
    fontSize: 12,
  },
  successCard: {
    backgroundColor: COLORS.cardBg,
    margin: 16,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 135, 81, 0.25)',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
    borderWidth: 2,
    borderColor: '#B3E0C9',
  },
  successCheck: {
    fontSize: 32,
    color: COLORS.primary,
    fontWeight: '900',
  },
  successBadge: {
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#B3E0C9',
  },
  successBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  successEmailHighlight: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
    textAlign: 'center',
    marginBottom: 14,
  },
  successPromptBox: {
    backgroundColor: '#FAF8F5',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0EDE8',
    marginBottom: 20,
    width: '100%',
  },
  successPromptText: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
});
