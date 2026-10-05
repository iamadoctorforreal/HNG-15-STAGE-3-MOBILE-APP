import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../lib/constants';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  light?: boolean;
}

export function BrandLogo({
  size = 'md',
  showText = true,
  light = false,
}: BrandLogoProps) {
  const iconSize = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;

  return (
    <View style={styles.container}>
      {/* Abstract Sacred River & Golden Catfish Crest */}
      <View
        style={[
          styles.iconBox,
          {
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize * 0.35,
            backgroundColor: light ? 'rgba(255,255,255,0.15)' : '#005230',
            borderColor: light ? 'rgba(255,255,255,0.3)' : 'rgba(212,168,67,0.4)',
          },
        ]}
      >
        <Svg viewBox="0 0 100 100" width="100%" height="100%">
          <Defs>
            <LinearGradient id="goldGradMobile" x1="20%" y1="20%" x2="85%" y2="60%">
              <Stop offset="0%" stopColor="#FFF8E7" />
              <Stop offset="40%" stopColor="#E8C468" />
              <Stop offset="85%" stopColor="#D4A843" />
              <Stop offset="100%" stopColor="#B8922E" />
            </LinearGradient>
          </Defs>

          {/* Subtle River Wave Current */}
          <Path
            d="M15 72C28 62 42 78 56 68C68 60 76 66 85 58"
            stroke={light ? '#E8C468' : '#D4A843'}
            strokeWidth="5"
            strokeLinecap="round"
            strokeOpacity="0.85"
          />
          <Path
            d="M20 82C32 74 46 86 58 78C70 70 78 74 85 68"
            stroke={light ? '#ffffff' : '#e6f5ed'}
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeOpacity="0.6"
          />

          {/* Abstract Golden Leaping Catfish Arc */}
          <Path
            d="M26 58C28 36 44 20 66 22C74 23 80 27 82 32C80 37 72 40 64 38C52 35 40 44 38 56C37 60 33 62 26 58Z"
            fill="url(#goldGradMobile)"
          />

          {/* Catfish Whiskers (Fluid Stream Lines) */}
          <Path
            d="M80 30C86 28 92 31 94 36"
            stroke="#FFF8E7"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <Path
            d="M78 34C84 35 88 40 89 45"
            stroke="#D4A843"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Eye of Wisdom */}
          <Circle cx="72" cy="29" r="2.5" fill="#FFF8E7" />
        </Svg>
      </View>

      {/* Typography */}
      {showText && (
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.brandTitle,
              { color: light ? '#FFFFFF' : COLORS.primaryDark },
              size === 'sm' && { fontSize: 16 },
              size === 'lg' && { fontSize: 22 },
            ]}
          >
            Sawfy White
          </Text>
          <Text
            style={[
              styles.brandSubtitle,
              { color: light ? '#E8C468' : COLORS.secondary },
              size === 'sm' && { fontSize: 8 },
              size === 'lg' && { fontSize: 10 },
            ]}
          >
            ENTERPRISES • ABEOKUTA
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconBox: {
    padding: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    shadowColor: '#008751',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.4,
  },
  brandSubtitle: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginTop: 1,
  },
});
