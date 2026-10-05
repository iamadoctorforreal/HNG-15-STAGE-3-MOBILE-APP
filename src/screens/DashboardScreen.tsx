import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { COLORS, MobileProduct, API_BASE_URL } from '../lib/constants';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { BrandLogo } from '../components/BrandLogo';
import { LeadMagnetModal } from '../components/LeadMagnetModal';
import { PolicyModal, PolicyTab } from '../components/PolicyModal';

const PROFILE_GREETINGS = [
  'Welcome back',
  'Bon retour',
  'Barka da dawowa',
  'Ẹ kú àbọ̀',
  'Nnọọ ọzọ',
];

const BACKEND_URL = typeof API_BASE_URL !== 'undefined' && API_BASE_URL ? API_BASE_URL : 'https://shop.sawfywhite.com';

export function DashboardScreen() {
  const { user, signOut } = useAuth();
  const { addToCart, refreshCart } = useCart();
  const { items: wishlist, removeFromWishlist } = useWishlist();

  const [greetingIdx, setGreetingIdx] = useState(0);
  const [leadMagnetOpen, setLeadMagnetOpen] = useState(false);
  const [policyModalOpen, setPolicyModalOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState<PolicyTab>('about');
  const [orders, setOrders] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Fetch live order history from API & rotate greeting
  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      try {
        setOrdersLoading(true);
        const res = await fetch(
          `${BACKEND_URL}/api/orders?userId=${user.id}&email=${encodeURIComponent(user.email || '')}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data.orders) {
            setOrders(data.orders);
          }
        }
      } catch (err) {
        console.warn('Failed to load user orders on mobile:', err);
      } finally {
        setOrdersLoading(false);
      }
    }

    fetchOrders();

    const timer = setInterval(() => {
      setGreetingIdx((prev) => (prev + 1) % PROFILE_GREETINGS.length);
    }, 3500);

    const stopTimer = setTimeout(() => {
      clearInterval(timer);
      setGreetingIdx(0); // Always stop on English
    }, 120000);

    return () => {
      clearInterval(timer);
      clearTimeout(stopTimer);
    };
  }, [user]);

  const firstName =
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name?.split(' ')[0] ||
    user?.email?.split('@')[0] ||
    'Customer';

  const handleAddWishlistToCart = async (item: any) => {
    await addToCart(item, 1);
    Alert.alert('Added to Cart! 🛒', `${item.title} has been added to your synchronized cart.`);
  };

  const handleRemoveWishlist = (id: string) => {
    removeFromWishlist(id);
  };

  const handleOpenPolicy = (tab: PolicyTab) => {
    setPolicyTab(tab);
    setPolicyModalOpen(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentInner}>
      {/* 1. Header Profile Card */}
      <View style={styles.profileHeaderCard}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{(firstName[0] || 'U').toUpperCase()}</Text>
          </View>
          <View style={styles.profileDetails}>
            <Text style={styles.welcomeGreeting}>
              {PROFILE_GREETINGS[greetingIdx]}, <Text style={{ color: COLORS.primary }}>{firstName}</Text>!
            </Text>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <View style={styles.tierBadge}>
              <Text style={styles.tierBadgeText}>★ Abeokuta Club • Gold Tier</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 2. Current Order Tracking Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🚚 Current Order Tracking</Text>
        <Text style={styles.sectionBadge}>LIVE</Text>
      </View>

      <View style={styles.trackingCard}>
        <View style={styles.trackingHeader}>
          <View>
            <Text style={styles.trackingIdLabel}>ACTIVE ORDER</Text>
            <Text style={styles.trackingId}>#SW-849201</Text>
          </View>
          <View style={styles.statusPill}>
            <Text style={styles.statusPillText}>In Transit</Text>
          </View>
        </View>

        {/* Milestone Steps */}
        <View style={styles.stepperContainer}>
          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <Text style={styles.stepCheck}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Order Placed</Text>
          </View>
          <View style={[styles.stepLine, styles.stepLineDone]} />

          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotDone]}>
              <Text style={styles.stepCheck}>✓</Text>
            </View>
            <Text style={styles.stepLabel}>Quality Checked</Text>
          </View>
          <View style={[styles.stepLine, styles.stepLineDone]} />

          <View style={styles.stepItem}>
            <View style={[styles.stepDot, styles.stepDotActive]}>
              <Text style={styles.stepPulseDot}>●</Text>
            </View>
            <Text style={[styles.stepLabel, styles.stepLabelActive]}>Dispatched (ABK)</Text>
          </View>
          <View style={styles.stepLine} />

          <View style={styles.stepItem}>
            <View style={styles.stepDot}>
              <Text style={styles.stepNumber}>4</Text>
            </View>
            <Text style={styles.stepLabel}>Delivered</Text>
          </View>
        </View>

        {/* Order Details Grid */}
        <View style={styles.trackingInfoBox}>
          <View style={styles.trackingRow}>
            <Text style={styles.trackingLabel}>Origin Farm:</Text>
            <Text style={styles.trackingVal}>Abeokuta Fish Farms, Ogun State 🇳🇬</Text>
          </View>
          <View style={styles.trackingRow}>
            <Text style={styles.trackingLabel}>Courier:</Text>
            <Text style={styles.trackingVal}>GIG Logistics / DHL Diaspora</Text>
          </View>
          <View style={styles.trackingRow}>
            <Text style={styles.trackingLabel}>Waybill / Track #:</Text>
            <Text style={styles.trackingValBold}>NG-ABK-849201</Text>
          </View>
          <View style={styles.trackingRow}>
            <Text style={styles.trackingLabel}>Estimated Arrival:</Text>
            <Text style={styles.trackingValGreen}>Tomorrow, by 4:00 PM</Text>
          </View>
        </View>
      </View>

      {/* 3. Best Deals of the Day & Exclusive Upsells */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🔥 Best Deals of the Day</Text>
        <Text style={styles.sectionBadge}>SAVE UP TO 25%</Text>
      </View>

      {/* Hero Deal Card */}
      <View style={styles.dealCard}>
        <View style={styles.dealBadge}>
          <Text style={styles.dealBadgeText}>⚡ TODAY&apos;S HERITAGE DEAL</Text>
        </View>
        <Text style={styles.dealTitle}>Abeokuta Heritage Feast Combo</Text>
        <Text style={styles.dealDesc}>
          Includes 2kg Signature Round-Curled Dried Catfish + Free Abeokuta Smoked Pepper Seasoning Blend + Digital Cookbook PDF.
        </Text>
        <View style={styles.dealPricingRow}>
          <View>
            <Text style={styles.dealOriginalPrice}>₦24,500</Text>
            <Text style={styles.dealPrice}>₦19,500</Text>
          </View>
          <TouchableOpacity
            style={styles.dealBtn}
            onPress={async () => {
              await addToCart({
                id: '00000000-0000-0000-0000-000000000001',
                title: 'Abeokuta Heritage Feast Combo (2kg + Spices)',
                slug: 'abeokuta-heritage-feast-combo',
                base_price: 19500,
                image: 'https://shop.sawfywhite.com/images/catfish-round-curled.png',
                is_digital: false,
              }, 1);
              Alert.alert('Deal Added! 🎉', 'Abeokuta Heritage Feast Combo added to your cart.');
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.dealBtnText}>Add Deal to Cart 🛒</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upsell: Digital Cookbook */}
      <View style={styles.upsellCard}>
        <View style={styles.upsellIconBox}>
          <Text style={styles.upsellIcon}>📖</Text>
        </View>
        <View style={styles.upsellContent}>
          <Text style={styles.upsellTitle}>Traditional Abeokuta Catfish Cookbook</Text>
          <Text style={styles.upsellDesc}>
            50+ Authentic Yoruba recipes for Efo Riro, Egusi, Obe Eja, & Catfish Pepper Soup.
          </Text>
          <View style={styles.upsellActionRow}>
            <Text style={styles.upsellPrice}>₦3,500 (Instant PDF)</Text>
            <TouchableOpacity
              style={styles.upsellBtn}
              onPress={async () => {
                await addToCart({
                  id: '00000000-0000-0000-0000-000000000010',
                  title: 'Abeokuta Catfish Heritage Cookbook (Digital PDF)',
                  slug: 'digital-catfish-cookbook',
                  base_price: 3500,
                  image: 'https://shop.sawfywhite.com/images/catfish-efo-soup.png',
                  is_digital: true,
                }, 1);
                Alert.alert('Cookbook Added! 📖', 'Digital Cookbook added to your cart.');
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.upsellBtnText}>+ Add to Cart</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* 4. My Wishlist Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>❤️ My Wishlist ({wishlist.length})</Text>
      </View>

      {wishlist.length > 0 ? (
        <View style={styles.wishlistContainer}>
          {wishlist.map((item) => (
            <View key={item.id} style={styles.wishlistItem}>
              <View style={styles.wishlistLeft}>
                <View style={styles.wishlistThumbBox}>
                  {item.image ? (
                    <Image source={{ uri: item.image }} style={styles.wishlistThumbImg} resizeMode="cover" />
                  ) : (
                    <Text style={{ fontSize: 24 }}>🐟</Text>
                  )}
                </View>
                <View style={styles.wishlistInfo}>
                  <Text style={styles.wishlistTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.wishlistPrice}>₦{item.base_price.toLocaleString()}</Text>
                  <Text style={styles.wishlistTag}>{item.tag || item.badge || 'Abeokuta Heritage'}</Text>
                </View>
              </View>

              <View style={styles.wishlistActions}>
                <TouchableOpacity
                  style={styles.moveToCartBtn}
                  onPress={() => handleAddWishlistToCart(item)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.moveToCartText}>Move to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeWishlistBtn}
                  onPress={() => handleRemoveWishlist(item.id)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.removeWishlistText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Your wishlist is empty. Browse products to save your favorites!</Text>
        </View>
      )}

      {/* 5. Order History Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>📋 Order History</Text>
        <Text style={styles.sectionBadge}>
          {orders.length} {orders.length === 1 ? 'ORDER' : 'ORDERS'}
        </Text>
      </View>

      {ordersLoading ? (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>Loading your order history...</Text>
        </View>
      ) : orders.length > 0 ? (
        <View style={styles.historyCard}>
          {orders.map((ord) => {
            const itemsSummary =
              ord.order_items?.map((it: any) => `${it.quantity}x ${it.product_title}`).join(' • ') ||
              'Abeokuta Catfish Selection';
            const dateStr = ord.created_at
              ? new Date(ord.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'Recent Order';
            const isPaid = ord.status === 'paid' || ord.status === 'delivered';

            return (
              <View key={ord.id} style={styles.historyItem}>
                <View style={styles.historyHeader}>
                  <View>
                    <Text style={styles.historyOrderNum}>
                      Order #{ord.id.slice(0, 8).toUpperCase()}
                    </Text>
                    <Text style={styles.historyDate}>Placed on {dateStr}</Text>
                  </View>
                  <View
                    style={[
                      styles.historyPill,
                      { backgroundColor: isPaid ? '#E6F5ED' : '#FEF3C7' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.historyPillText,
                        { color: isPaid ? COLORS.primaryDark : '#92400E' },
                      ]}
                    >
                      {ord.status?.toUpperCase() || 'PENDING'} {isPaid ? '✓' : '⏳'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.historySummary}>{itemsSummary}</Text>
                <View style={styles.historyFooter}>
                  <Text style={styles.historyTotal}>
                    {ord.currency === 'USD' ? '$' : '₦'}
                    {Number(ord.total_amount).toLocaleString()}
                  </Text>
                  <TouchableOpacity
                    style={styles.reorderBtn}
                    onPress={async () => {
                      if (ord.order_items && ord.order_items.length > 0) {
                        for (const it of ord.order_items) {
                          await addToCart(
                            {
                              id: it.product_id,
                              title: it.product_title,
                              slug: 'dried-catfish',
                              base_price: it.unit_price,
                              image: 'https://shop.sawfywhite.com/images/catfish-round-curled.png',
                              is_digital: !!it.is_digital,
                            },
                            it.quantity || 1
                          );
                        }
                        Alert.alert('Reorder Added! ⚡', 'Items added to your cart.');
                      }
                    }}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.reorderBtnText}>⚡ Reorder</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.historyCard}>
          <View style={styles.historyItem}>
            <View style={styles.historyHeader}>
              <View>
                <Text style={styles.historyOrderNum}>Sample Order #SW-784019</Text>
                <Text style={styles.historyDate}>Delivered on Oct 02, 2026</Text>
              </View>
              <View style={styles.historyPill}>
                <Text style={styles.historyPillText}>Delivered ✓</Text>
              </View>
            </View>
            <Text style={styles.historySummary}>
              2x Whole Round-Curled Dried Catfish (Big) • 1x Cookbook PDF
            </Text>
            <View style={styles.historyFooter}>
              <Text style={styles.historyTotal}>₦22,500</Text>
              <TouchableOpacity
                style={styles.reorderBtn}
                onPress={async () => {
                  await addToCart(
                    {
                      id: '00000000-0000-0000-0000-000000000001',
                      title: 'Whole Round-Curled Dried Catfish (Big)',
                      slug: 'whole-round-curled-dried-catfish-big',
                      base_price: 9500,
                      image: 'https://shop.sawfywhite.com/images/catfish-round-curled.png',
                      is_digital: false,
                    },
                    2
                  );
                  Alert.alert('Reorder Added! ⚡', 'Items from Order #SW-784019 added to your cart.');
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.reorderBtnText}>⚡ Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
          <Text style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', marginTop: 10 }}>
            Orders placed on Web or Mobile with this account will automatically sync and show here in real time.
          </Text>
        </View>
      )}


      {/* 6. Lead Magnet Promotion Box */}
      <View style={styles.leadMagnetBox}>
        <View style={styles.leadMagnetBadge}>
          <Text style={styles.leadMagnetBadgeText}>FREE GIFT</Text>
        </View>
        <Text style={styles.leadMagnetTitle}>The 7 Hidden Health Benefits of Dried Catfish</Text>
        <Text style={styles.leadMagnetSubtitle}>
          Get our exclusive nutritional guide featuring protein density breakdowns, Omega-3 heart benefits, and traditional cooking secrets.
        </Text>
        <TouchableOpacity
          style={styles.leadMagnetBtn}
          onPress={() => setLeadMagnetOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.leadMagnetBtnText}>📥 Download Free Guide (PDF)</Text>
        </TouchableOpacity>
      </View>

      {/* 7. Information & Policies Links */}
      <View style={styles.policyLinksCard}>
        <Text style={styles.policyLinksHeading}>Sawfy White Heritage & Guarantees</Text>
        <View style={styles.policyLinksGrid}>
          <TouchableOpacity style={styles.policyLinkItem} onPress={() => handleOpenPolicy('about')}>
            <Text style={styles.policyLinkText}>🌾 About Our Abeokuta Ponds →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.policyLinkItem} onPress={() => handleOpenPolicy('shipping')}>
            <Text style={styles.policyLinkText}>📦 Shipping & Delivery Policy →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.policyLinkItem} onPress={() => handleOpenPolicy('terms')}>
            <Text style={styles.policyLinkText}>⚖️ Terms & Conditions →</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.policyLinkItem} onPress={() => handleOpenPolicy('privacy')}>
            <Text style={styles.policyLinkText}>🔒 Privacy Policy →</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 8. Sign Out CTA */}
      <TouchableOpacity style={styles.signOutBtn} onPress={signOut} activeOpacity={0.8}>
        <Text style={styles.signOutBtnText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Modals */}
      <LeadMagnetModal
        visible={leadMagnetOpen}
        onClose={() => setLeadMagnetOpen(false)}
        userEmail={user?.email || ''}
        userName={firstName}
      />

      <PolicyModal
        visible={policyModalOpen}
        initialTab={policyTab}
        onClose={() => setPolicyModalOpen(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  contentInner: {
    padding: 16,
    paddingBottom: 40,
  },
  profileHeaderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#008751',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    shadowColor: '#008751',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
  },
  profileDetails: {
    flex: 1,
  },
  welcomeGreeting: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFF8E7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E8C468',
    marginTop: 6,
  },
  tierBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#92400E',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#1F2937',
    letterSpacing: -0.2,
  },
  sectionBadge: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.primaryDark,
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trackingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 5,
    elevation: 2,
  },
  trackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  trackingIdLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#9CA3AF',
    letterSpacing: 0.8,
  },
  trackingId: {
    fontSize: 14,
    fontWeight: '900',
    color: '#1F2937',
  },
  statusPill: {
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B3E0C9',
  },
  statusPillText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingHorizontal: 6,
  },
  stepItem: {
    alignItems: 'center',
  },
  stepDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  stepDotDone: {
    backgroundColor: COLORS.primary,
  },
  stepDotActive: {
    backgroundColor: '#D4A843',
  },
  stepCheck: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  stepPulseDot: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  stepNumber: {
    color: '#9CA3AF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 4,
    marginBottom: 18,
  },
  stepLineDone: {
    backgroundColor: COLORS.primary,
  },
  stepLabel: {
    fontSize: 9,
    color: '#6B7280',
    fontWeight: '600',
    textAlign: 'center',
    maxWidth: 60,
  },
  stepLabelActive: {
    color: COLORS.primaryDark,
    fontWeight: '900',
  },
  trackingInfoBox: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  trackingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  trackingLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  trackingVal: {
    fontSize: 11,
    color: '#1F2937',
    fontWeight: '500',
  },
  trackingValBold: {
    fontSize: 11,
    color: COLORS.primaryDark,
    fontWeight: '900',
  },
  trackingValGreen: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '800',
  },
  dealCard: {
    backgroundColor: '#004729',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#004729',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  dealBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8C468',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 8,
  },
  dealBadgeText: {
    color: '#004729',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  dealTitle: {
    fontSize: 17,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: 'serif',
    marginBottom: 4,
  },
  dealDesc: {
    fontSize: 11,
    color: '#D1FAE5',
    lineHeight: 16,
    marginBottom: 12,
  },
  dealPricingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.15)',
    paddingTop: 10,
  },
  dealOriginalPrice: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    textDecorationLine: 'line-through',
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: '900',
    color: '#E8C468',
  },
  dealBtn: {
    backgroundColor: '#E8C468',
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
  },
  dealBtnText: {
    color: '#004729',
    fontSize: 12,
    fontWeight: '900',
  },
  upsellCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  upsellIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#E6F5ED',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  upsellIcon: {
    fontSize: 22,
  },
  upsellContent: {
    flex: 1,
  },
  upsellTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1F2937',
  },
  upsellDesc: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
    lineHeight: 15,
  },
  upsellActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  upsellPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  upsellBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  upsellBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  wishlistContainer: {
    marginBottom: 20,
    gap: 8,
  },
  wishlistItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wishlistLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  wishlistThumbBox: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: '#FAF8F5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#F0EDE8',
    overflow: 'hidden',
  },
  wishlistThumbImg: {
    width: '100%',
    height: '100%',
    borderRadius: 9,
  },
  wishlistInfo: {
    flex: 1,
  },
  wishlistTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  wishlistPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 1,
  },
  wishlistTag: {
    fontSize: 9,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  wishlistActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moveToCartBtn: {
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  moveToCartText: {
    color: COLORS.primaryDark,
    fontSize: 11,
    fontWeight: '800',
  },
  removeWishlistBtn: {
    padding: 6,
  },
  removeWishlistText: {
    color: '#9CA3AF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  historyItem: {},
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyOrderNum: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1F2937',
  },
  historyDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  historyPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  historyPillText: {
    color: '#059669',
    fontSize: 10,
    fontWeight: '800',
  },
  historySummary: {
    fontSize: 11,
    color: '#4B5563',
    lineHeight: 16,
    marginBottom: 8,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  historyTotal: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1F2937',
  },
  reorderBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reorderBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  leadMagnetBox: {
    backgroundColor: '#FAF5EA',
    borderWidth: 1.5,
    borderColor: '#E8C468',
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
  },
  leadMagnetBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8C468',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 6,
  },
  leadMagnetBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#78350F',
  },
  leadMagnetTitle: {
    fontSize: 15,
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
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  leadMagnetBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  policyLinksCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 20,
  },
  policyLinksHeading: {
    fontSize: 12,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 10,
  },
  policyLinksGrid: {
    gap: 8,
  },
  policyLinkItem: {
    paddingVertical: 6,
  },
  policyLinkText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.primaryDark,
  },
  signOutBtn: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  signOutBtnText: {
    color: '#4B5563',
    fontSize: 13,
    fontWeight: '800',
  },
});
