import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { PRODUCTS, COLORS, MobileProduct, API_BASE_URL } from '../lib/constants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { HeroSection } from '../components/HeroSection';
import { LeadMagnetModal } from '../components/LeadMagnetModal';
import { ProductDetailModal } from '../components/ProductDetailModal';

const MOBILE_CATEGORIES = [
  { id: 'all', label: 'All (10)' },
  { id: 'whole', label: 'Whole Catfish' },
  { id: 'flakes', label: 'Flakes & Cuts' },
  { id: 'bulk', label: 'Bulk Wholesale' },
  { id: 'digital', label: 'Cookbook' },
];

export function ProductsScreen({ onGoToCart }: { onGoToCart?: () => void }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState<MobileProduct[]>(PRODUCTS);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [leadMagnetVisible, setLeadMagnetVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MobileProduct | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const displayedProducts = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'digital' && !p.is_digital) return false;
        if (selectedCategory === 'bulk' && !p.slug.includes('bulk') && !p.title.toLowerCase().includes('bulk')) return false;
        if (selectedCategory === 'flakes' && !p.slug.includes('flakes') && !p.slug.includes('cuts') && !p.slug.includes('steaks') && !p.title.toLowerCase().includes('flakes') && !p.title.toLowerCase().includes('cuts') && !p.title.toLowerCase().includes('steaks')) return false;
        if (selectedCategory === 'whole' && (p.is_digital || p.slug.includes('bulk') || p.slug.includes('flakes') || p.slug.includes('cuts') || p.slug.includes('steaks'))) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match =
          p.title.toLowerCase().includes(q) ||
          (p.description || '').toLowerCase().includes(q) ||
          (p.badge || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  const renderProduct = ({ item }: { item: MobileProduct }) => {
    const isAdding = addingId === item.id;
    const favorited = isInWishlist(item.id);

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

          {/* Wishlist Heart Toggle */}
          <TouchableOpacity
            style={[styles.heartBtn, favorited && styles.heartBtnActive]}
            onPress={() => toggleWishlist(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.heartIcon}>{favorited ? '❤️' : '🤍'}</Text>
          </TouchableOpacity>
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
        data={displayedProducts}
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

            {/* Search Bar & Category Filter Section */}
            <View style={styles.filterSection}>
              <View style={styles.searchBar}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                  style={styles.searchInput}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder="Search catfish, cuts, flakes, cookbook..."
                  placeholderTextColor="#9CA3AF"
                />
                {searchQuery ? (
                  <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.searchClearBtn}>
                    <Text style={styles.searchClearText}>✕</Text>
                  </TouchableOpacity>
                ) : null}
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {MOBILE_CATEGORIES.map((cat) => {
                  const isActive = selectedCategory === cat.id;
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                      onPress={() => setSelectedCategory(cat.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                        {cat.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
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
  heartBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  heartBtnActive: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
  },
  heartIcon: {
    fontSize: 16,
  },
  filterSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textDark,
    padding: 0,
  },
  searchClearBtn: {
    padding: 4,
  },
  searchClearText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '700',
  },
  categoryScroll: {
    paddingVertical: 2,
    gap: 8,
  },
  categoryChip: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
});
