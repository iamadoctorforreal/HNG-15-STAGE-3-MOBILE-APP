import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { PRODUCTS, COLORS, MobileProduct } from '../lib/constants';
import { useCart } from '../context/CartContext';

export function ProductsScreen() {
  const { addToCart } = useCart();
  const [addingId, setAddingId] = useState<string | null>(null);

  const handleAdd = async (product: MobileProduct) => {
    setAddingId(product.id);
    await addToCart(product, 1);
    setTimeout(() => {
      setAddingId(null);
    }, 600);
  };

  const renderProduct = ({ item }: { item: MobileProduct }) => {
    const isAdding = addingId === item.id;

    return (
      <View style={styles.card}>
        {/* Product Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        </View>

        {/* Product Details */}
        <View style={styles.details}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.weightInfo}>⚖️ {item.weightInfo}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>

          {/* Price & Add Action */}
          <View style={styles.bottomRow}>
            <View>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.price}>₦{item.base_price.toLocaleString()}</Text>
            </View>

            <TouchableOpacity
              style={[styles.addButton, isAdding && styles.addButtonSuccess]}
              onPress={() => handleAdd(item)}
              activeOpacity={0.8}
            >
              <Text style={styles.addButtonText}>
                {isAdding ? '✓ Added' : '🛒 Add to Cart'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerBanner}>
        <Text style={styles.bannerSubtitle}>FARMS OF ABEOKUTA, OGUN STATE</Text>
        <Text style={styles.bannerTitle}>10 Curated Dried Catfish Selections</Text>
      </View>

      <FlatList
        data={PRODUCTS}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  headerBanner: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  bannerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.textDark,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  imageContainer: {
    height: 180,
    width: '100%',
    backgroundColor: '#F3F4F6',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textDark,
    lineHeight: 20,
  },
  weightInfo: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.primary,
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 17,
    marginTop: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  price: {
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    elevation: 1,
  },
  addButtonSuccess: {
    backgroundColor: '#059669',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
});
