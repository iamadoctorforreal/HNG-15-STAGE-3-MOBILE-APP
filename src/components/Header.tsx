import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../lib/constants';

export function Header() {
  return (
    <View style={styles.header}>
      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.fishEmoji}>🐟</Text>
          <View>
            <Text style={styles.brandTitle}>Sawfy White</Text>
            <Text style={styles.brandSubtitle}>ENTERPRISES • ABEOKUTA</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🇳🇬 Export Grade</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.cardBg,
    paddingTop: 50,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fishEmoji: {
    fontSize: 28,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark,
    letterSpacing: -0.3,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 1.2,
  },
  badge: {
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B3E0C9',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.primary,
  },
});
