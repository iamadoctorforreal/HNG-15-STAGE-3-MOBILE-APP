import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function AuthScreen() {
  const { user, signIn, signUp, signOut, isLoading } = useAuth();
  const { refreshCart } = useCart();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setErrorMsg(error.message || 'Registration failed.');
      } else {
        Alert.alert(
          'Account Created',
          'Welcome to Sawfy White Enterprises! Your account is now active.'
        );
        refreshCart();
      }
    }
    setSubmitting(false);
  };

  const handleSignOut = async () => {
    await signOut();
    refreshCart();
  };

  if (user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user.email?.[0] || 'U').toUpperCase()}
            </Text>
          </View>

          <Text style={styles.userEmail}>{user.email}</Text>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Connected to Sawfy White Cloud</Text>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>Cross-Platform Synchronization</Text>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerTitle}>
          {isLoginMode ? 'Welcome Back' : 'Create an Account'}
        </Text>
        <Text style={styles.headerSubtitle}>
          {isLoginMode
            ? 'Sign in with your Sawfy White web credentials'
            : 'Register to synchronize your cart across devices'}
        </Text>

        {errorMsg ? (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        ) : null}

        {!isLoginMode && (
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Adebayo Johnson"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="you@domain.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
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
              {isLoginMode ? 'Sign In to Account' : 'Register Account'}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primaryDark,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 20,
    lineHeight: 16,
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: COLORS.textDark,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    elevation: 2,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
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
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 8,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  infoBox: {
    backgroundColor: '#FAF8F5',
    padding: 14,
    borderRadius: 16,
    marginTop: 20,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E5E7EB',
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
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.danger,
    width: '100%',
    alignItems: 'center',
  },
  signOutText: {
    color: COLORS.danger,
    fontSize: 13,
    fontWeight: '800',
  },
});
