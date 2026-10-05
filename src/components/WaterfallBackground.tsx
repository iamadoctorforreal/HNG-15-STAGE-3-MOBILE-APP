import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Animated, Easing } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export function WaterfallBackground() {
  const streamAnim1 = useRef(new Animated.Value(0)).current;
  const streamAnim2 = useRef(new Animated.Value(0)).current;
  const bubbleAnim1 = useRef(new Animated.Value(0)).current;
  const bubbleAnim2 = useRef(new Animated.Value(0)).current;
  const fishAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 1. River stream flow loop
    Animated.loop(
      Animated.timing(streamAnim1, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(streamAnim2, {
        toValue: 1,
        duration: 12000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // 2. Floating bubbles loop
    Animated.loop(
      Animated.timing(bubbleAnim1, {
        toValue: 1,
        duration: 6000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();

    Animated.loop(
      Animated.timing(bubbleAnim2, {
        toValue: 1,
        duration: 9000,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      })
    ).start();

    // 3. Leaping catfish arc loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(fishAnim, {
          toValue: 1,
          duration: 3500,
          easing: Easing.bezier(0.25, 0.1, 0.25, 1),
          useNativeDriver: true,
        }),
        Animated.delay(4000),
        Animated.timing(fishAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const streamTranslate1 = streamAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [-SCREEN_HEIGHT * 0.3, SCREEN_HEIGHT * 0.3],
  });

  const streamTranslate2 = streamAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.3, -SCREEN_HEIGHT * 0.3],
  });

  const bubbleY1 = bubbleAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT, -50],
  });

  const bubbleY2 = bubbleAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [SCREEN_HEIGHT * 0.8, -50],
  });

  const fishX = fishAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-60, SCREEN_WIDTH + 60],
  });

  const fishY = fishAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [SCREEN_HEIGHT * 0.45, SCREEN_HEIGHT * 0.32, SCREEN_HEIGHT * 0.48],
  });

  const fishRotate = fishAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['-25deg', '5deg', '35deg'],
  });

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* 1. Base Warm Abeokuta Cream Tint */}
      <View style={[StyleSheet.absoluteFill, styles.baseBg]} />

      {/* 2. Soft Emerald River Flow Currents (SVG Waves) */}
      <Animated.View
        style={[
          styles.streamContainer,
          { transform: [{ translateY: streamTranslate1 }] },
        ]}
      >
        <Svg width={SCREEN_WIDTH * 1.5} height={SCREEN_HEIGHT * 1.6} viewBox="0 0 500 1200">
          <Defs>
            <LinearGradient id="waterFlow1" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#008751" stopOpacity="0.04" />
              <Stop offset="50%" stopColor="#E8C468" stopOpacity="0.05" />
              <Stop offset="100%" stopColor="#005230" stopOpacity="0.06" />
            </LinearGradient>
            <LinearGradient id="waterFlow2" x1="100%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#00A86B" stopOpacity="0.03" />
              <Stop offset="100%" stopColor="#FAF8F5" stopOpacity="0.01" />
            </LinearGradient>
          </Defs>

          {/* Flowing River Ribbons */}
          <Path
            d="M-50,0 C120,250 80,450 280,700 C420,880 320,1050 480,1200 L550,1200 L550,0 Z"
            fill="url(#waterFlow1)"
          />
          <Path
            d="M80,0 C-20,300 200,600 100,900 C50,1050 220,1150 280,1200 L-50,1200 L-50,0 Z"
            fill="url(#waterFlow2)"
          />
        </Svg>
      </Animated.View>

      {/* 3. Secondary Reverse Flow for Depth */}
      <Animated.View
        style={[
          styles.streamContainer,
          { transform: [{ translateY: streamTranslate2 }] },
        ]}
      >
        <Svg width={SCREEN_WIDTH * 1.4} height={SCREEN_HEIGHT * 1.5} viewBox="0 0 450 1100">
          <Path
            d="M150,0 C320,200 220,500 380,800 C480,980 400,1080 450,1100"
            stroke="rgba(232, 196, 104, 0.08)"
            strokeWidth="38"
            fill="none"
          />
          <Path
            d="M50,100 C-30,400 120,700 40,1000"
            stroke="rgba(0, 135, 81, 0.05)"
            strokeWidth="24"
            fill="none"
          />
        </Svg>
      </Animated.View>

      {/* 4. Rising Translucent Bubbles */}
      <Animated.View
        style={[
          styles.bubble,
          {
            left: SCREEN_WIDTH * 0.22,
            transform: [{ translateY: bubbleY1 }],
          },
        ]}
      >
        <Svg width="26" height="26" viewBox="0 0 26 26">
          <Circle cx="13" cy="13" r="11" fill="rgba(0, 135, 81, 0.08)" stroke="rgba(232, 196, 104, 0.3)" strokeWidth="1.5" />
          <Circle cx="9" cy="9" r="3" fill="rgba(255, 255, 255, 0.6)" />
        </Svg>
      </Animated.View>

      <Animated.View
        style={[
          styles.bubble,
          {
            left: SCREEN_WIDTH * 0.78,
            transform: [{ translateY: bubbleY2 }],
          },
        ]}
      >
        <Svg width="18" height="18" viewBox="0 0 18 18">
          <Circle cx="9" cy="9" r="7" fill="rgba(0, 135, 81, 0.06)" stroke="rgba(0, 135, 81, 0.25)" strokeWidth="1" />
          <Circle cx="7" cy="7" r="2" fill="rgba(255, 255, 255, 0.5)" />
        </Svg>
      </Animated.View>

      {/* 5. Leaping Golden Catfish Silhouette Across Waterfall */}
      <Animated.View
        style={[
          styles.fishWrapper,
          {
            transform: [
              { translateX: fishX },
              { translateY: fishY },
              { rotate: fishRotate },
            ],
          },
        ]}
      >
        <Svg width="54" height="28" viewBox="0 0 80 40">
          <Defs>
            <LinearGradient id="fishGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor="#D4A843" stopOpacity="0.45" />
              <Stop offset="100%" stopColor="#008751" stopOpacity="0.3" />
            </LinearGradient>
          </Defs>
          {/* Leaping Catfish Body & Fins */}
          <Path
            d="M5,22 C18,12 45,10 65,18 C74,22 78,25 74,28 C65,34 38,36 20,30 C12,27 7,24 5,22 Z"
            fill="url(#fishGold)"
          />
          {/* Dorsal Fin */}
          <Path d="M30,12 C36,4 46,7 48,12 Z" fill="rgba(212, 168, 67, 0.4)" />
          {/* Tail Fin */}
          <Path d="M72,20 C78,14 80,11 76,24 C80,31 77,33 70,27 Z" fill="rgba(212, 168, 67, 0.5)" />
          {/* Catfish Whiskers (Barbels) */}
          <Path d="M5,22 C1,18 -3,24 2,26" stroke="rgba(212, 168, 67, 0.6)" strokeWidth="1.2" fill="none" />
          <Path d="M6,24 C1,28 -2,32 3,31" stroke="rgba(212, 168, 67, 0.6)" strokeWidth="1.2" fill="none" />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  baseBg: {
    backgroundColor: '#FAF8F5',
  },
  streamContainer: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.2,
    left: -SCREEN_WIDTH * 0.2,
    opacity: 0.85,
  },
  bubble: {
    position: 'absolute',
  },
  fishWrapper: {
    position: 'absolute',
    opacity: 0.8,
  },
});
