import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { COLORS, API_BASE_URL } from '../lib/constants';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

interface CheckoutModalProps {
  visible: boolean;
  onClose: () => void;
  onGoToDashboard: () => void;
  onGoToShop: () => void;
}

export function CheckoutModal({
  visible,
  onClose,
  onGoToDashboard,
  onGoToShop,
}: CheckoutModalProps) {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();

  const [fullName, setFullName] = useState(
    user?.user_metadata?.full_name || user?.user_metadata?.first_name || ''
  );
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.user_metadata?.phone || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Abeokuta');
  const [state, setState] = useState('Ogun State');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank_transfer' | 'apple_pay'>('card');

  const [loading, setLoading] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<any>(null);

  const shippingFee = 2500;
  const totalAmount = subtotal + shippingFee;

  const handleSubmitOrder = async () => {
    if (!fullName.trim() || !email.trim() || !address.trim() || !phone.trim()) {
      Alert.alert('Required Fields', 'Please fill in your name, email, phone, and delivery address.');
      return;
    }

    try {
      setLoading(true);

      const orderPayload = {
        userId: user?.id || null,
        guestEmail: email.trim(),
        guestName: fullName.trim(),
        shippingAddress: {
          firstName: fullName.split(' ')[0] || fullName,
          lastName: fullName.split(' ').slice(1).join(' ') || '',
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          country: 'Nigeria',
        },
        items: items.map((i) => ({
          productId: i.id,
          variantId: i.variantId || null,
          title: i.title,
          unitPrice: i.price || i.base_price,
          quantity: i.quantity,
          isDigital: !!i.is_digital,
        })),
        currency: 'NGN',
        paymentMethod: paymentMethod === 'card' ? 'visa' : paymentMethod === 'apple_pay' ? 'apple_pay' : 'bank_transfer',
      };

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit order');
      }

      // Order created successfully
      await clearCart();
      setConfirmedOrder({
        orderId: data.orderId || `ord-${Date.now().toString().slice(-6)}`,
        customerName: fullName.trim(),
        customerEmail: email.trim(),
        address: `${address.trim()}, ${city.trim()}, ${state.trim()}`,
        items: [...items],
        totalAmount,
      });
    } catch (err: any) {
      Alert.alert('Checkout Error', err?.message || 'Unable to place order. Please check network connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleFinishAndTrack = () => {
    setConfirmedOrder(null);
    onClose();
    onGoToDashboard();
  };

  const handleFinishAndShop = () => {
    setConfirmedOrder(null);
    onClose();
    onGoToShop();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => {
              if (confirmedOrder) {
                setConfirmedOrder(null);
              }
              onClose();
            }}
            style={styles.closeBtn}
            activeOpacity={0.7}
          >
            <Text style={styles.closeBtnText}>✕ Close</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {confirmedOrder ? 'Order Confirmed' : 'Checkout & Invoicing'}
          </Text>
          <View style={{ width: 60 }} />
        </View>

        {confirmedOrder ? (
          /* Confirmation & Invoice Receipt Screen */
          <ScrollView contentContainerStyle={styles.confirmationContent} showsVerticalScrollIndicator={false}>
            <View style={styles.successIconBox}>
              <Text style={styles.successIcon}>✓</Text>
            </View>

            <Text style={styles.successHeading}>Order Received & Confirmed!</Text>
            <Text style={styles.culturalGreeting}>
              Barka da zuwa • Félicitations • Ẹ kú oríire • Ekele
            </Text>
            <Text style={styles.successSubheading}>
              Thank you, {confirmedOrder.customerName}. Your Abeokuta dried catfish order is registered.
            </Text>

            {/* Invoice Breakdown Card */}
            <View style={styles.invoiceCard}>
              <View style={styles.invoiceHeaderRow}>
                <Text style={styles.invoiceTitle}>ORDER INVOICE</Text>
                <Text style={styles.invoiceBadge}>#{confirmedOrder.orderId.slice(0, 8)}</Text>
              </View>

              <View style={styles.invoiceDivider} />

              <View style={styles.invoiceDetailRow}>
                <Text style={styles.invoiceDetailLabel}>Customer</Text>
                <Text style={styles.invoiceDetailVal}>{confirmedOrder.customerName}</Text>
              </View>

              <View style={styles.invoiceDetailRow}>
                <Text style={styles.invoiceDetailLabel}>Email Sent To</Text>
                <Text style={styles.invoiceDetailVal}>{confirmedOrder.customerEmail}</Text>
              </View>

              <View style={styles.invoiceDetailRow}>
                <Text style={styles.invoiceDetailLabel}>Delivery Address</Text>
                <Text style={styles.invoiceDetailVal} numberOfLines={2}>
                  {confirmedOrder.address}
                </Text>
              </View>

              <View style={styles.invoiceDivider} />

              {/* Items List */}
              <Text style={styles.invoiceItemsHeading}>Purchased Items</Text>
              {confirmedOrder.items.map((item: any, idx: number) => (
                <View key={idx} style={styles.invoiceItemRow}>
                  <Text style={styles.invoiceItemName} numberOfLines={1}>
                    {item.quantity}x {item.title}
                  </Text>
                  <Text style={styles.invoiceItemPrice}>
                    ₦{((item.price || item.base_price) * item.quantity).toLocaleString()}
                  </Text>
                </View>
              ))}

              <View style={styles.invoiceDivider} />

              <View style={styles.invoiceDetailRow}>
                <Text style={styles.invoiceDetailLabel}>Shipping Fee (Ogun/Domestic)</Text>
                <Text style={styles.invoiceDetailVal}>₦2,500</Text>
              </View>

              <View style={styles.invoiceTotalRow}>
                <Text style={styles.invoiceTotalLabel}>Total Invoiced</Text>
                <Text style={styles.invoiceTotalVal}>₦{confirmedOrder.totalAmount.toLocaleString()}</Text>
              </View>
            </View>

            {/* Email Notification Notice */}
            <View style={styles.emailNoticeBox}>
              <Text style={styles.emailNoticeIcon}>📧</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.emailNoticeTitle}>Order Invoice Dispatched</Text>
                <Text style={styles.emailNoticeText}>
                  A full itemized invoice has been dispatched via Mailgun to {confirmedOrder.customerEmail}.
                </Text>
              </View>
            </View>

            {/* Dashboard Tracking Box */}
            <View style={styles.trackingBox}>
              <Text style={styles.trackingTitle}>Live Order Tracking Available</Text>
              <Text style={styles.trackingDesc}>
                You can track the preparation, smoke drying, and courier dispatch of this order in real time on your Customer Dashboard.
              </Text>
              <TouchableOpacity
                style={styles.trackDashboardBtn}
                onPress={handleFinishAndTrack}
                activeOpacity={0.85}
              >
                <Text style={styles.trackDashboardBtnText}>
                  📍 Track Order on My Dashboard &rarr;
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.shopMoreBtn} onPress={handleFinishAndShop} activeOpacity={0.8}>
              <Text style={styles.shopMoreBtnText}>Browse Catfish Catalog</Text>
            </TouchableOpacity>
          </ScrollView>
        ) : (
          /* Checkout Input Form */
          <ScrollView contentContainerStyle={styles.formContent} showsVerticalScrollIndicator={false}>
            {/* Origin & Trust Banner */}
            <View style={styles.bannerBox}>
              <Text style={styles.bannerBadge}>Abeokuta, Ogun State Delivery</Text>
              <Text style={styles.bannerTitle}>Fast Dispatch to Nigeria, UK & USA</Text>
              <Text style={styles.bannerDesc}>
                All orders are vacuum-sealed with zero grit and sand.
              </Text>
            </View>

            {/* Customer Information */}
            <Text style={styles.sectionTitle}>1. Contact & Delivery Details</Text>

            <Text style={styles.inputLabel}>Full Name *</Text>
            <TextInput
              style={styles.textInput}
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Olawale Johnson"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Email Address (For Invoice & Tracking) *</Text>
            <TextInput
              style={styles.textInput}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="e.g. olawale@example.com"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Phone Number *</Text>
            <TextInput
              style={styles.textInput}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="e.g. +234 803 123 4567"
              placeholderTextColor="#9CA3AF"
            />

            <Text style={styles.inputLabel}>Delivery Street Address *</Text>
            <TextInput
              style={styles.textInput}
              value={address}
              onChangeText={setAddress}
              placeholder="e.g. 14 Oke-Ilewo Crescent"
              placeholderTextColor="#9CA3AF"
            />

            <View style={styles.rowInputs}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.inputLabel}>City</Text>
                <TextInput
                  style={styles.textInput}
                  value={city}
                  onChangeText={setCity}
                  placeholder="Abeokuta"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>State</Text>
                <TextInput
                  style={styles.textInput}
                  value={state}
                  onChangeText={setState}
                  placeholder="Ogun State"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            </View>

            {/* Payment Method Selector */}
            <Text style={styles.sectionTitle}>2. Payment Method</Text>

            <TouchableOpacity
              style={[styles.paymentMethodCard, paymentMethod === 'card' && styles.paymentMethodCardSelected]}
              onPress={() => setPaymentMethod('card')}
              activeOpacity={0.8}
            >
              <Text style={styles.methodIcon}>💳</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.methodName}>Debit / Credit Card</Text>
                <Text style={styles.methodSub}>Visa, Mastercard, Verve</Text>
              </View>
              {paymentMethod === 'card' && <Text style={styles.selectedCheck}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentMethodCard, paymentMethod === 'bank_transfer' && styles.paymentMethodCardSelected]}
              onPress={() => setPaymentMethod('bank_transfer')}
              activeOpacity={0.8}
            >
              <Text style={styles.methodIcon}>🏦</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.methodName}>Bank Transfer / USSD</Text>
                <Text style={styles.methodSub}>Direct Nigerian Bank Transfer</Text>
              </View>
              {paymentMethod === 'bank_transfer' && <Text style={styles.selectedCheck}>✓</Text>}
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.paymentMethodCard, paymentMethod === 'apple_pay' && styles.paymentMethodCardSelected]}
              onPress={() => setPaymentMethod('apple_pay')}
              activeOpacity={0.8}
            >
              <Text style={styles.methodIcon}>🍎</Text>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.methodName}>Apple Pay / International</Text>
                <Text style={styles.methodSub}>UK, US & Global cards</Text>
              </View>
              {paymentMethod === 'apple_pay' && <Text style={styles.selectedCheck}>✓</Text>}
            </TouchableOpacity>

            {/* Order Price Summary */}
            <View style={styles.orderSummaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLineLabel}>Items ({items.length})</Text>
                <Text style={styles.summaryLineVal}>₦{subtotal.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryLine}>
                <Text style={styles.summaryLineLabel}>Standard Courier Shipping</Text>
                <Text style={styles.summaryLineVal}>₦{shippingFee.toLocaleString()}</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryTotalRow}>
                <Text style={styles.summaryTotalLabel}>Total Amount</Text>
                <Text style={styles.summaryTotalVal}>₦{totalAmount.toLocaleString()}</Text>
              </View>
            </View>

            {/* Submit Action */}
            <TouchableOpacity
              style={[styles.submitOrderBtn, loading && styles.submitOrderBtnDisabled]}
              onPress={handleSubmitOrder}
              disabled={loading}
              activeOpacity={0.85}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.submitOrderBtnText}>
                  Place Order & Receive Invoice &bull; ₦{totalAmount.toLocaleString()}
                </Text>
              )}
            </TouchableOpacity>

            <Text style={styles.footerNotice}>
              🔒 Secure 256-bit SSL encrypted checkout. Invoice and live tracking sent immediately.
            </Text>
          </ScrollView>
        )}
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
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  formContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerBox: {
    backgroundColor: '#E6F5ED',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#B3E0C9',
    marginBottom: 20,
  },
  bannerBadge: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginBottom: 2,
  },
  bannerDesc: {
    fontSize: 12,
    color: '#4B5563',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    marginTop: 10,
    marginBottom: 12,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.textDark,
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: 'row',
  },
  paymentMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  paymentMethodCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: '#FAFDFB',
  },
  methodIcon: {
    fontSize: 20,
  },
  methodName: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  methodSub: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  selectedCheck: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.primary,
  },
  orderSummaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
    marginBottom: 10,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLineLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  summaryLineVal: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  summaryTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.textDark,
  },
  summaryTotalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  submitOrderBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  submitOrderBtnDisabled: {
    opacity: 0.6,
  },
  submitOrderBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
  footerNotice: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 12,
  },
  confirmationContent: {
    padding: 20,
    alignItems: 'center',
    paddingBottom: 40,
  },
  successIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E6F5ED',
    borderWidth: 2,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  successIcon: {
    fontSize: 28,
    color: '#10B981',
    fontWeight: '900',
  },
  successHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.textDark,
    textAlign: 'center',
  },
  culturalGreeting: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.primary,
    marginTop: 4,
    textAlign: 'center',
  },
  successSubheading: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 16,
  },
  invoiceCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  invoiceHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  invoiceTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: 1,
  },
  invoiceBadge: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primaryDark,
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  invoiceDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 10,
  },
  invoiceDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  invoiceDetailLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  invoiceDetailVal: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textDark,
    maxWidth: '65%',
    textAlign: 'right',
  },
  invoiceItemsHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#374151',
    marginBottom: 6,
  },
  invoiceItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  invoiceItemName: {
    fontSize: 12,
    color: '#4B5563',
    maxWidth: '70%',
  },
  invoiceItemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
  invoiceTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 6,
  },
  invoiceTotalLabel: {
    fontSize: 14,
    fontWeight: '900',
    color: COLORS.textDark,
  },
  invoiceTotalVal: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  emailNoticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF8F5',
    borderWidth: 1,
    borderColor: '#E8C468',
    borderRadius: 14,
    padding: 12,
    marginTop: 16,
    width: '100%',
  },
  emailNoticeIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  emailNoticeTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B8922E',
  },
  emailNoticeText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  trackingBox: {
    backgroundColor: '#E6F5ED',
    borderWidth: 1,
    borderColor: '#B3E0C9',
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  trackingTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: COLORS.primaryDark,
  },
  trackingDesc: {
    fontSize: 11,
    color: '#374151',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  trackDashboardBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  trackDashboardBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  shopMoreBtn: {
    marginTop: 12,
    paddingVertical: 10,
  },
  shopMoreBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
  },
});
