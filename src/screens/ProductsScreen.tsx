import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { PRODUCTS, COLORS, MobileProduct, API_BASE_URL } from '../lib/constants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { HeroSection } from '../components/HeroSection';
import { LeadMagnetModal } from '../components/LeadMagnetModal';
import { ProductDetailModal } from '../components/ProductDetailModal';

export function ProductsScreen({ onGoToCart }: { onGoToCart?: () => void }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [products, setProducts] = useState<MobileProduct[]>(PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [leadMagnetVisible, setLeadMagnetVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MobileProduct | null>(null);

  const fetchLiveProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/products`);
      if (res.ok) {
        const data = await res.json();
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          // Normalize to MobileProduct format
          const mapped: MobileProduct[] = data.products.map((p: any) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            description: p.description || '',
            base_price: Number(p.base_price) || 0,
            currency: p.currency || 'NGN',
            badge: p.badge || (p.is_digital ? 'Digital Product' : 'Export Grade'),
            weightInfo: p.weightInfo || 'Abeokuta Farm Pack',
            image: p.images?.[0]
              ? (p.images[0].startsWith('http') ? p.images[0] : `${API_BASE_URL}${p.images[0]}`)
              : `${API_BASE_URL}/images/catfish-real-glass-plate.png`,
            is_digital: !!p.is_digital,
          }));
          setProducts(mapped);
        }
      }
    } catch (e) {
      console.warn('Using offline product cache:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveProducts();
  }, [fetchLiveProducts]);

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
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.92}
        onPress={() => setSelectedProduct(item)}
      >
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
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        ListHeaderComponent={
          <View>
            <HeroSection />

            {/* Lead Magnet Free Guide Banner */}
            <View style={styles.leadMagnetBanner}>
              <View style={styles.leadMagnetBadge}>
                <Text style={styles.leadMagnetBadgeText}>FREE GIFT 📖</Text>
              </View>
              <Text style={styles.leadMagnetTitle}>
                The 7 Hidden Health Benefits of Dried Catfish
              </Text>
              <Text style={styles.leadMagnetSubtitle}>
                Discover protein density, heart-healthy Omega-3s, and traditional cooking secrets from Abeokuta.
              </Text>
              <TouchableOpacity
                style={styles.leadMagnetBtn}
                onPress={() => setLeadMagnetVisible(true)}
                activeOpacity={0.8}
              >
                <Text style={styles.leadMagnetBtnText}>📥 Download Free PDF Guide →</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchLiveProducts}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      />

      {/* Free Guide Modal */}
      <LeadMagnetModal
        visible={leadMagnetVisible}
        onClose={() => setLeadMagnetVisible(false)}
        userEmail={user?.email || ''}
        userName={user?.user_metadata?.first_name || ''}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        visible={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onGoToCart={onGoToCart}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    marginHorizontal: 14,
    marginBottom: 16,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    height: 190,
    backgroundColor: '#F0EDE8',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: 'rgba(0, 82, 48, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFF8E7',
    fontSize: 10,
    fontWeight: '800',
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
    lineHeight: 22,
  },
  weightInfo: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.secondary,
    marginTop: 4,
  },
  description: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
    marginTop: 6,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0EDE8',
  },
  priceLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  price: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  addButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonSuccess: {
    backgroundColor: '#005230',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  leadMagnetBanner: {
    backgroundColor: '#FAF5EA',
    borderWidth: 1.5,
    borderColor: '#E8C468',
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#E8C468',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  leadMagnetBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8C468',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 6,
  },
  leadMagnetBadgeText: {
    color: '#78350F',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  leadMagnetTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#78350F',
    marginBottom: 4,
    fontFamily: 'serif',
  },
  leadMagnetSubtitle: {
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
    marginBottom: 12,
  },
  leadMagnetBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  leadMagnetBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
});
