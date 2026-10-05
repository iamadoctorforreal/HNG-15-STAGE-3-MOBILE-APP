import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { COLORS, MobileProduct } from '../lib/constants';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  visible: boolean;
  product: MobileProduct | null;
  onClose: () => void;
  onGoToCart?: () => void;
  onBuyNow?: () => void;
}

export function ProductDetailModal({
  visible,
  product,
  onClose,
  onGoToCart,
  onBuyNow,
}: ProductDetailModalProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [addedUpsellId, setAddedUpsellId] = useState<string | null>(null);

  if (!product) return null;

  const handleAddMainProduct = async () => {
    setAdded(true);
    await addToCart(product, quantity);
    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuyNowProduct = async () => {
    await addToCart(product, quantity);
    onClose();
    if (onBuyNow) {
      onBuyNow();
    }
  };

  const handleAddUpsell = async (upsell: {
    id: string;
    title: string;
    price: number;
    image: string;
    is_digital?: boolean;
    badge?: string;
  }) => {
    setAddedUpsellId(upsell.id);
    await addToCart(
      {
        id: upsell.id,
        title: upsell.title,
        slug: upsell.id,
        base_price: upsell.price,
        image: upsell.image,
        is_digital: !!upsell.is_digital,
        badge: upsell.badge || 'Chef Recommendation',
      },
      1
    );
    setTimeout(() => {
      setAddedUpsellId(null);
    }, 1200);
  };

  const UPSELLS = [
    {
      id: 'upsell-spice-blend-01',
      title: 'Abeokuta Gourmet Pepper Soup Spice Blend (250g)',
      price: 2500,
      image: 'https://shop.sawfywhite.com/images/catfish-efo-soup.jpg',
      badge: 'Perfect Pairing',
    },
    {
      id: '00000000-0000-0000-0000-000000000008',
      title: 'Digital Abeokuta Catfish Recipe Cookbook (PDF)',
      price: 5000,
      image: 'https://shop.sawfywhite.com/images/cookbook-cover.jpg',
      is_digital: true,
      badge: 'Digital Chef Guide',
    },
    {
      id: '00000000-0000-0000-0000-000000000005',
      title: 'Fine Dried Catfish Flakes (500g Jar)',
      price: 8500,
      image: 'https://shop.sawfywhite.com/images/catfish-flakes-jar.jpg',
      badge: 'Quick Prep',
    },
  ].filter((u) => u.id !== product.id);

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
            <Text style={styles.closeBtnText}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Product Details
          </Text>
          {onGoToCart ? (
            <TouchableOpacity onPress={() => { onClose(); onGoToCart(); }} style={styles.cartIconBtn}>
              <Text style={styles.cartIconText}>🛒 Cart</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ width: 50 }} />
          )}
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Main Hero Product Image */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image }} style={styles.productImage} resizeMode="cover" />
            <View style={styles.badgeTag}>
              <Text style={styles.badgeTagText}>{product.badge || 'Abeokuta Heritage'}</Text>
            </View>
            {product.is_digital && (
              <View style={styles.digitalBadge}>
                <Text style={styles.digitalBadgeText}>⚡ Instant Digital PDF</Text>
              </View>
            )}
          </View>

          {/* Product Header Info */}
          <View style={styles.detailsCard}>
            <Text style={styles.originSubtitle}>
              Sawfy White Enterprises • Abeokuta, Ogun State
            </Text>
            <Text style={styles.productTitle}>{product.title}</Text>

            <View style={styles.metaRow}>
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Price</Text>
                <Text style={styles.priceValue}>₦{product.base_price.toLocaleString()}</Text>
              </View>
              {product.weightInfo && (
                <View style={styles.weightBadge}>
                  <Text style={styles.weightText}>⚖️ {product.weightInfo}</Text>
                </View>
              )}
            </View>

            {/* Quality Checklist */}
            <View style={styles.qualityRow}>
              <View style={styles.qualityItem}>
                <Text style={styles.qualityIcon}>✓</Text>
                <Text style={styles.qualityLabel}>Sand & Grit Free</Text>
              </View>
              <View style={styles.qualityItem}>
                <Text style={styles.qualityIcon}>✓</Text>
                <Text style={styles.qualityLabel}>Clean Oven Smoked</Text>
              </View>
              <View style={styles.qualityItem}>
                <Text style={styles.qualityIcon}>✓</Text>
                <Text style={styles.qualityLabel}>Vacuum Sealed</Text>
              </View>
            </View>

            {/* Description */}
            <View style={styles.sectionDivider} />
            <Text style={styles.sectionHeading}>Product Overview</Text>
            <Text style={styles.descriptionText}>
              {product.description ||
                'Farm-raised in clean Abeokuta aquaculture ponds, meticulously degutted and oven-dried to golden-brown crisp perfection. 100% free of sand, odor, and preservative additives. Packaged hygienically for safe export and domestic shipping.'}
            </Text>

            {/* Quantity Selector & Add Button */}
            <View style={styles.actionContainer}>
              <View style={styles.qtyBox}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                  activeOpacity={0.7}
                >
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.qtyDisplay}>{quantity}</Text>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQuantity((q) => q + 1)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <View style={{ flex: 1, flexDirection: 'row', gap: 8, marginLeft: 10 }}>
                <TouchableOpacity
                  style={[styles.addToCartBtn, added && styles.addToCartBtnSuccess, { flex: 1 }]}
                  onPress={handleAddMainProduct}
                  activeOpacity={0.85}
                >
                  <Text style={styles.addToCartBtnText}>
                    {added ? '✓ Added' : '🛒 Add'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.addToCartBtn, { flex: 1.2, backgroundColor: '#D4A843' }]}
                  onPress={handleBuyNowProduct}
                  activeOpacity={0.85}
                >
                  <Text style={[styles.addToCartBtnText, { color: '#1F2937' }]}>
                    ⚡ Buy Now
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

          </View>

          {/* Upsells Section / Recommended Pairings */}
          <View style={styles.upsellSection}>
            <View style={styles.upsellHeader}>
              <Text style={styles.upsellOverline}>RECOMMENDED CHEF PAIRINGS</Text>
              <Text style={styles.upsellTitle}>Frequently Bought Together</Text>
              <Text style={styles.upsellSubtitle}>
                Enhance your Abeokuta catfish meal with our authentic traditional pairings.
              </Text>
            </View>

            {UPSELLS.map((upsell) => {
              const isUpsellAdded = addedUpsellId === upsell.id;
              return (
                <View key={upsell.id} style={styles.upsellCard}>
                  <Image source={{ uri: upsell.image }} style={styles.upsellImg} resizeMode="cover" />
                  <View style={styles.upsellInfo}>
                    <Text style={styles.upsellItemBadge}>{upsell.badge}</Text>
                    <Text style={styles.upsellItemTitle} numberOfLines={2}>
                      {upsell.title}
                    </Text>
                    <Text style={styles.upsellItemPrice}>₦{upsell.price.toLocaleString()}</Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.upsellAddBtn, isUpsellAdded && styles.upsellAddBtnSuccess]}
                    onPress={() => handleAddUpsell(upsell)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.upsellAddBtnText}>
                      {isUpsellAdded ? '✓' : '+ Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  closeBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  cartIconBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#E6F5ED',
    borderRadius: 8,
  },
  cartIconText: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  imageContainer: {
    width: '100%',
    height: 260,
    backgroundColor: '#FAF8F5',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  badgeTag: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(0, 82, 48, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeTagText: {
    color: '#FFF8E7',
    fontSize: 11,
    fontWeight: '800',
  },
  digitalBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(212, 168, 67, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  digitalBadgeText: {
    color: '#2D2D2D',
    fontSize: 11,
    fontWeight: '800',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginHorizontal: 14,
    marginTop: -20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  originSubtitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  productTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textDark,
    lineHeight: 26,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  priceContainer: {},
  priceLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  priceValue: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  weightBadge: {
    backgroundColor: '#FAF8F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  weightText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
  qualityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#E6F5ED',
    padding: 10,
    borderRadius: 12,
    marginBottom: 14,
  },
  qualityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  qualityIcon: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '900',
  },
  qualityLabel: {
    fontSize: 10,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 6,
  },
  descriptionText: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 18,
  },
  actionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  qtyBtnText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#374151',
  },
  qtyDisplay: {
    fontSize: 15,
    fontWeight: '800',
    paddingHorizontal: 8,
    color: COLORS.textDark,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  addToCartBtnSuccess: {
    backgroundColor: COLORS.primaryDark,
  },
  addToCartBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  upsellSection: {
    marginTop: 20,
    paddingHorizontal: 14,
  },
  upsellHeader: {
    marginBottom: 12,
  },
  upsellOverline: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 1,
  },
  upsellTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.textDark,
    marginTop: 2,
  },
  upsellSubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  upsellCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  upsellImg: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  upsellInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  upsellItemBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: COLORS.secondary,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  upsellItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
    lineHeight: 16,
  },
  upsellItemPrice: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  upsellAddBtn: {
    backgroundColor: '#E6F5ED',
    borderWidth: 1,
    borderColor: '#B3E0C9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  upsellAddBtnSuccess: {
    backgroundColor: COLORS.primaryDark,
    borderColor: COLORS.primaryDark,
  },
  upsellAddBtnText: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
});
