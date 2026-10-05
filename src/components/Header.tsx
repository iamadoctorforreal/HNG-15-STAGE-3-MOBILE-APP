import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../lib/constants';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';

const HEADER_GREETINGS = [
  '👋 Welcome',
  '👋 Bienvenue',
  '👋 Barka da zuwa',
  '👋 Ẹ kú àbọ̀',
  '👋 Nnọọ',
];

export function Header({
  onGoToAccount,
  onGoToHome,
}: {
  onGoToAccount?: () => void;
  onGoToHome?: () => void;
}) {
  const { user } = useAuth();
  const [greetingIdx, setGreetingIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIdx((prev) => (prev + 1) % HEADER_GREETINGS.length);
    }, 3500);

    const stopTimer = setTimeout(() => {
      clearInterval(timer);
      setGreetingIdx(0); // Always stop on English
    }, 120000);

    return () => {
      clearInterval(timer);
      clearTimeout(stopTimer);
    };
  }, []);

  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    '';

  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <TouchableOpacity
          onPress={onGoToHome}
          activeOpacity={0.8}
          disabled={!onGoToHome}
        >
          <BrandLogo size="md" showText={true} />
        </TouchableOpacity>

        <View style={styles.rightContent}>
          <TouchableOpacity
            onPress={onGoToAccount}
            activeOpacity={0.75}
            disabled={!onGoToAccount}
            style={user ? styles.userBadge : styles.badge}
          >
            {user ? (
              <Text style={styles.userBadgeText}>
                {HEADER_GREETINGS[greetingIdx]}, <Text style={styles.userBadgeBold}>{firstName || 'Customer'}</Text> 📊
              </Text>
            ) : (
              <Text style={styles.badgeText}>🔑 Account</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.cardBg,
    paddingTop: 48,
    paddingBottom: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userBadge: {
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B3E0C9',
  },
  userBadgeText: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '600',
  },
  userBadgeBold: {
    fontWeight: '900',
    color: COLORS.primary,
  },
  badge: {
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#B3E0C9',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
  },
});
