import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../lib/constants';
import { useCart, MobileCartItem } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CheckoutModal } from '../components/CheckoutModal';

export function CartScreen({
  onGoToShop,
  onGoToDashboard,
}: {
  onGoToShop?: () => void;
  onGoToDashboard?: () => void;
}) {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal, totalItems, refreshCart } = useCart();
  const { user } = useAuth();
  const [checkoutVisible, setCheckoutVisible] = useState(false);

  const renderItem = ({ item }: { item: MobileCartItem }) => {
    return (
      <View style={styles.cartCard}>
        <Image source={{ uri: item.image }} style={styles.itemImage} resizeMode="cover" />

        <View style={styles.itemInfo}>
          <Text style={styles.itemTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.itemPrice}>₦{(item.price || item.base_price).toLocaleString()}</Text>

          <View style={styles.qtyRow}>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.id, -1, item.variantId)}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => updateQuantity(item.id, 1, item.variantId)}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => removeFromCart(item.id, item.variantId)}
              style={styles.deleteBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.deleteText}>Remove</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Live Sync Status Banner */}
      <View style={styles.syncBanner}>
        <View style={styles.syncIndicator}>
          <View style={styles.syncDot} />
          <Text style={styles.syncText}>
            {user ? 'Live Real-Time Synced with Web Store' : 'Sync Active (Sign in to pair with Web account)'}
          </Text>
        </View>
        <TouchableOpacity onPress={() => refreshCart()} style={styles.refreshBtn}>
          <Text style={styles.refreshBtnText}>🔄 Refresh</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>🛒</Text>
          <Text style={styles.emptyTitle}>Your Cart is Empty</Text>
          <Text style={styles.emptySubtitle}>
            Add export-grade dried catfish from our catalog or on the web store!
          </Text>
          {onGoToShop && (
            <TouchableOpacity style={styles.shopBtn} onPress={onGoToShop} activeOpacity={0.8}>
              <Text style={styles.shopBtnText}>Browse Catfish Catalog</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item, idx) => `${item.id}-${item.variantId || idx}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Checkout & Summary Footer */}
          <View style={styles.footer}>
            <View style={styles.clearRow}>
              <Text style={styles.itemsCount}>{totalItems} Item(s) in Cart</Text>
              <TouchableOpacity onPress={() => clearCart()}>
                <Text style={styles.clearText}>Clear Cart</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryTotal}>₦{subtotal.toLocaleString()}</Text>
            </View>

            <TouchableOpacity
              style={styles.checkoutBtn}
              activeOpacity={0.85}
              onPress={() => setCheckoutVisible(true)}
            >
              <Text style={styles.checkoutBtnText}>⚡ Proceed to Checkout</Text>
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Checkout & Invoicing Modal */}
      <CheckoutModal
        visible={checkoutVisible}
        onClose={() => setCheckoutVisible(false)}
        onGoToDashboard={() => onGoToDashboard?.()}
        onGoToShop={() => onGoToShop?.()}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  syncBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#B3E0C9',
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  syncText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  refreshBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  refreshBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 12,
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.primaryDark,
    marginTop: 4,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  qtyText: {
    paddingHorizontal: 8,
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  deleteBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.danger,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 54,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  emptySubtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  shopBtn: {
    backgroundColor: COLORS.primary,
    marginTop: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
  },
  shopBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  footer: {
    backgroundColor: COLORS.cardBg,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 10,
  },
  clearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemsCount: {
    fontSize: 12,
    color: COLORS.textMuted,
    fontWeight: '700',
  },
  clearText: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '700',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  checkoutBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
