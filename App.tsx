import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { CartProvider, useCart } from './src/context/CartContext';
import { Header } from './src/components/Header';
import { ProductsScreen } from './src/screens/ProductsScreen';
import { CartScreen } from './src/screens/CartScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { WaterfallBackground } from './src/components/WaterfallBackground';
import { SplashScreen } from './src/components/SplashScreen';
import { COLORS } from './src/lib/constants';

function MainApp() {
  const [activeTab, setActiveTab] = useState<'products' | 'cart' | 'account'>('products');
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
      <Header />

      {/* Screen Views */}
      <View style={styles.content}>
        {activeTab === 'products' && (
          <ProductsScreen onGoToCart={() => setActiveTab('cart')} />
        )}
        {activeTab === 'cart' && (
          <CartScreen
            onGoToShop={() => setActiveTab('products')}
            onGoToDashboard={() => setActiveTab('account')}
          />
        )}
        {activeTab === 'account' && <AuthScreen />}
      </View>

      {/* Bottom Navigation Bar */}
      <SafeAreaView style={styles.tabBarContainer}>
        <View style={styles.tabBar}>
          {/* Products Tab */}
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

          {/* Account Tab */}
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'account' && styles.tabButtonActive]}
            onPress={() => setActiveTab('account')}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{user ? '👤' : '🔑'}</Text>
            <Text style={[styles.tabLabel, activeTab === 'account' && styles.tabLabelActive]}>
              {user ? 'Account' : 'Sign In'}
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
        <MainApp />
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
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 12,
  },
  tabButtonActive: {
    backgroundColor: '#E6F5ED',
  },
  tabIcon: {
    fontSize: 20,
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
