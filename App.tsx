import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { WishlistProvider } from './src/context/WishlistContext';
import { Header } from './src/components/Header';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { CartScreen } from './src/screens/CartScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { WaterfallBackground } from './src/components/WaterfallBackground';
import { SplashScreen } from './src/components/SplashScreen';
import { COLORS } from './src/lib/constants';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'cart' | 'account'>('home');
  const [showSplash, setShowSplash] = useState(true);
  const { totalItems } = useCart();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* 1. Continuous Flowing Waterfall & Leaping Fish River Background */}
      <WaterfallBackground />

      {/* 2. Initial Royal Splash Screen */}
      {showSplash && <SplashScreen onFinish={() => setShowSplash(false)} />}

      {/* Brand Header */}
      <Header
        onGoToAccount={() => setActiveTab('account')}
        onGoToHome={() => setActiveTab('home')}
      />

      {/* Screen Views */}
      <View style={styles.content}>
        {activeTab === 'home' && (
          <ProductsScreen
            showHero={true}
            onGoToCart={() => setActiveTab('cart')}
            onGoToDashboard={() => setActiveTab('account')}
          />
        )}
        {activeTab === 'products' && (
          <ProductsScreen
            showHero={false}
            onGoToCart={() => setActiveTab('cart')}
            onGoToDashboard={() => setActiveTab('account')}
          />
        )}
        {activeTab === 'cart' && (
          <CartScreen
            onGoToShop={() => setActiveTab('products')}
            onGoToDashboard={() => setActiveTab('account')}
          />
        )}
        {activeTab === 'account' && (
          <AuthScreen onLoginSuccess={() => setActiveTab('home')} />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <SafeAreaView style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {/* Home Tab */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'home' && styles.tabButtonActive]}
            onPress={() => setActiveTab('home')}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>🏠</Text>
            <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
              Home
            </Text>
          </TouchableOpacity>

          {/* Dedicated Products Tab */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'products' && styles.tabButtonActive]}
            onPress={() => setActiveTab('products')}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>🐟</Text>
            <Text style={[styles.tabLabel, activeTab === 'products' && styles.tabLabelActive]}>
              Products
            </Text>
          </TouchableOpacity>

          {/* Cart Tab with Live Counter Badge */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'cart' && styles.tabButtonActive]}
            onPress={() => setActiveTab('cart')}
            activeOpacity={0.7}
          >
            <View style={styles.cartIconWrapper}>
              <Text style={styles.tabIcon}>🛒</Text>
              {totalItems > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{totalItems}</Text>
                </View>
              )}
            </View>
            <Text style={[styles.tabLabel, activeTab === 'cart' && styles.tabLabelActive]}>
              Cart
            </Text>
          </TouchableOpacity>

          {/* Dashboard / Account Tab */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'account' && styles.tabButtonActive]}
            onPress={() => setActiveTab('account')}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{user ? '👤' : '🔑'}</Text>
            <Text style={[styles.tabLabel, activeTab === 'account' && styles.tabLabelActive]}>
              {user ? 'Dashboard' : 'Sign In'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <MainApp />
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  content: {
    flex: 1,
  },
  tabBarContainer: {
    backgroundColor: COLORS.cardBg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'android' ? 58 : 10,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  tabBar: {
    flexDirection: 'row',
    height: 58,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#E6F5ED',
  },
  tabIcon: {
    fontSize: 22,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    color: COLORS.primaryDark,
    fontWeight: '900',
  },
  cartIconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
});
