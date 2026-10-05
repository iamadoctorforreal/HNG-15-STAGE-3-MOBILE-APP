import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../lib/constants';
import { BrandLogo } from './BrandLogo';
import { useAuth } from '../context/AuthContext';

export function Header() {
  const { user } = useAuth();
  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    '';

  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <BrandLogo size="md" showText={true} />
        <View style={styles.rightContent}>
          {user ? (
            <View style={styles.userBadge}>
              <Text style={styles.userBadgeText}>
                👋 Welcome, <Text style={styles.userBadgeBold}>{firstName}</Text>!
              </Text>
            </View>
          ) : (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>🇳🇬 Export Grade</Text>
            </View>
          )}
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
