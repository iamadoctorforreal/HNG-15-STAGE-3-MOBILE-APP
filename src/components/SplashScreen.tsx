import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { BrandLogo } from './BrandLogo';
import { COLORS } from '../lib/constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const exitFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 1600,
        useNativeDriver: false,
      }),
    ]).start();

    // 2. Exit transition after 1.8s
    const timer = setTimeout(() => {
      Animated.timing(exitFade, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => {
        onFinish();
      });
    }, 1800);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const progressBarWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Animated.View style={[styles.container, { opacity: exitFade }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glow Ring Behind Logo */}
        <View style={styles.glowRing}>
          <BrandLogo size="lg" showText={false} />
        </View>

        {/* Brand Name */}
        <Text style={styles.brandTitle}>SAWFY WHITE</Text>
        <Text style={styles.brandSubtitle}>ENTERPRISES</Text>

        {/* Heritage Tagline */}
        <View style={styles.taglineBadge}>
          <Text style={styles.taglineText}>
            Export-Grade Dried Catfish • Abeokuta, Nigeria 🇳🇬
          </Text>
        </View>

        {/* Subtle Loading Progress Bar */}
        <View style={styles.progressBarTrack}>
          <Animated.View style={[styles.progressBarFill, { width: progressBarWidth }]} />
        </View>
        <Text style={styles.loadingNote}>Connecting to Abeokuta Fish Farms Cloud...</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#004729',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  glowRing: {
    padding: 20,
    borderRadius: 999,
    backgroundColor: 'rgba(232, 196, 104, 0.1)',
    borderWidth: 1.5,
    borderColor: 'rgba(232, 196, 104, 0.3)',
    marginBottom: 24,
    shadowColor: '#E8C468',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    fontFamily: 'serif',
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#E8C468',
    letterSpacing: 4,
    marginTop: 2,
    marginBottom: 16,
  },
  taglineBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(232, 196, 104, 0.3)',
    marginBottom: 32,
  },
  taglineText: {
    color: '#FAF8F5',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  progressBarTrack: {
    width: 180,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#E8C468',
    borderRadius: 2,
  },
  loadingNote: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    fontWeight: '500',
  },
});
