import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { COLORS } from '../lib/constants';

const GREETINGS = [
  'Welcome! Export-grade catfish shipped to Nigeria, UK & USA ✈️',
  'Bienvenue! Poisson-chat séché d\'Abeokuta qualité export 🌍',
  'Barka da zuwa! Kifin busasshe mai inganci daga Abeokuta 🇳🇬',
  'Ẹ kú àbọ̀! Premium dried catfish from Abeokuta to the world 🇳🇬',
  'Nnọọ! Azụ kpọrọ nkụ kacha mma si Abeokuta ruo tebụl gị 🇳🇬',
];

export function HeroSection() {
  const [greetingIdx, setGreetingIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setGreetingIdx((prev) => (prev + 1) % GREETINGS.length);
    }, 4000);

    const stopTimer = setTimeout(() => {
      clearInterval(timer);
      setGreetingIdx(0);
    }, 120000);

    return () => {
      clearInterval(timer);
      clearTimeout(stopTimer);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* Multilingual Announcement Bar */}
      <View style={styles.tickerBar}>
        <Text style={styles.tickerText}>
          {GREETINGS[greetingIdx]}
        </Text>
      </View>

      {/* Hero Card */}
      <View style={styles.heroCard}>
        {/* Farm Origin Badge */}
        <View style={styles.originBadge}>
          <Text style={styles.originBadgeText}>
            🌾 Farm-Raised in Abeokuta Fish Farms • Export-Grade
          </Text>
        </View>

        {/* Headline */}
        <Text style={styles.heroTitle}>
          Export-Grade <Text style={{ color: COLORS.primary }}>Dried Catfish</Text> From Abeokuta
        </Text>

        {/* Subtitle / Narrative */}
        <Text style={styles.heroSubtitle}>
          Farm-raised in clean Abeokuta aquaculture ponds, meticulously gutted, thoroughly washed, and hygienically dried to golden-brown crisp perfection. 100% sand-grit free, rich in Omega-3, and sealed for safe shipping across Nigeria, the UK, and the USA.
        </Text>

        {/* Authentic Dried Catfish Image Showcase */}
        <View style={styles.imageShowcaseContainer}>
          <Image
            source={{ uri: 'https://shop.sawfywhite.com/images/catfish-real-glass-plate.png' }}
            style={styles.heroCatfishImage}
            resizeMode="cover"
          />
          <View style={styles.imageBadge}>
            <Text style={styles.imageBadgeText}>🐟 Pure Golden-Smoked Abeokuta Catfish</Text>
          </View>
        </View>

        {/* 3 Core Trust Badges */}
        <View style={styles.trustGrid}>
          <View style={styles.trustItem}>
            <Text style={styles.trustValue}>100%</Text>
            <Text style={styles.trustLabel}>Sand & Grit Free</Text>
          </View>
          <View style={[styles.trustItem, styles.trustBorder]}>
            <Text style={styles.trustValue}>Omega-3</Text>
            <Text style={styles.trustLabel}>Heart-Healthy</Text>
          </View>
          <View style={styles.trustItem}>
            <Text style={styles.trustValue}>1 Year</Text>
            <Text style={styles.trustLabel}>Shelf-Stable</Text>
          </View>
        </View>
      </View>

      {/* Catalog Intro Bar */}
      <View style={styles.catalogBar}>
        <Text style={styles.catalogBarOverline}>AUTHENTIC HERITAGE SELECTIONS</Text>
        <Text style={styles.catalogBarTitle}>10 Curated Dried Catfish Products</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.cream,
    marginBottom: 8,
  },
  tickerBar: {
    backgroundColor: COLORS.primaryDark,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tickerText: {
    color: '#FFF8E7',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  heroCard: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 14,
    marginTop: 14,
    padding: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 135, 81, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  originBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B3E0C9',
    marginBottom: 10,
  },
  originBadgeText: {
    color: COLORS.primaryDark,
    fontSize: 10,
    fontWeight: '800',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textDark,
    lineHeight: 30,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 18,
    fontWeight: '400',
    marginBottom: 12,
  },
  imageShowcaseContainer: {
    width: '100%',
    height: 180,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#D4A843',
    backgroundColor: '#FAF8F5',
    position: 'relative',
  },
  heroCatfishImage: {
    width: '100%',
    height: '100%',
  },
  imageBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(0, 82, 48, 0.88)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  imageBadgeText: {
    color: '#FFF8E7',
    fontSize: 11,
    fontWeight: '800',
  },
  trustGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF8F5',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EDE8',
  },
  trustItem: {
    flex: 1,
    alignItems: 'center',
  },
  trustBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#E5E7EB',
  },
  trustValue: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  trustLabel: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '600',
    marginTop: 2,
  },
  catalogBar: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
  },
  catalogBarOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 1.2,
  },
  catalogBarTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textDark,
    marginTop: 2,
    letterSpacing: -0.3,
  },
});
