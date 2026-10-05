import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { COLORS } from '../lib/constants';

export type PolicyTab = 'about' | 'shipping' | 'terms' | 'privacy';

interface PolicyModalProps {
  visible: boolean;
  initialTab?: PolicyTab;
  onClose: () => void;
}

export function PolicyModal({
  visible,
  initialTab = 'about',
  onClose,
}: PolicyModalProps) {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Sawfy White Heritage & Info</Text>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'about' && styles.tabItemActive]}
            onPress={() => setActiveTab('about')}
          >
            <Text style={[styles.tabLabel, activeTab === 'about' && styles.tabLabelActive]}>About Us</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'shipping' && styles.tabItemActive]}
            onPress={() => setActiveTab('shipping')}
          >
            <Text style={[styles.tabLabel, activeTab === 'shipping' && styles.tabLabelActive]}>Shipping</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'terms' && styles.tabItemActive]}
            onPress={() => setActiveTab('terms')}
          >
            <Text style={[styles.tabLabel, activeTab === 'terms' && styles.tabLabelActive]}>Terms</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabItem, activeTab === 'privacy' && styles.tabItemActive]}
            onPress={() => setActiveTab('privacy')}
          >
            <Text style={[styles.tabLabel, activeTab === 'privacy' && styles.tabLabelActive]}>Privacy</Text>
          </TouchableOpacity>
        </View>

        {/* Content Body */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          {activeTab === 'about' && (
            <View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>🇳🇬 ABEOKUTA, OGUN STATE</Text>
              </View>
              <Text style={styles.sectionTitle}>Rooted in Heritage, Raised with Care</Text>
              <Text style={styles.paragraph}>
                Sawfy White Enterprises is an authentic agribusiness based in the historic rock city of Abeokuta, Ogun State, Nigeria. We specialize in cultivating, hygienically processing, and export-packaging premium dried African catfish (<Text style={{ fontStyle: 'italic' }}>Clarias gariepinus</Text>).
              </Text>
              <Text style={styles.paragraph}>
                Our farm-raised fish live in pristine, clean freshwater ponds fed by natural aquifers. Every fish is hand-selected, meticulously gutted, thoroughly washed, and gently smoked in clean, modern kilns to lock in protein density and smoky aroma without bitter char or grit.
              </Text>

              <View style={styles.highlightCard}>
                <Text style={styles.highlightTitle}>The 100% Sand-Free Guarantee</Text>
                <Text style={styles.highlightText}>
                  Unlike roadside or open-air market fish, Sawfy White catfish is dried in sealed stainless steel chambers. No sand, no ash, no flies. Clean, crisp, and ready for your soup pot straight from the pack!
                </Text>
              </View>
            </View>
          )}

          {activeTab === 'shipping' && (
            <View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>📦 DOMESTIC & DIASPORA DISPATCH</Text>
              </View>
              <Text style={styles.sectionTitle}>Global Shipping & Packing Standards</Text>
              <Text style={styles.paragraph}>
                We ship to households across all 36 Nigerian states and deliver to the Nigerian diaspora in the United Kingdom, United States, and Canada.
              </Text>

              <Text style={styles.subheading}>🇳🇬 Nigerian Domestic Deliveries</Text>
              <Text style={styles.paragraph}>
                • Lagos & Ogun State: 24 to 48 hours via dedicated dispatch.{'\n'}
                • Abuja, Port Harcourt & Interstate: 2 to 4 business days via GIG Logistics.{'\n'}
                • Flat-rate shipping starting from ₦2,500.
              </Text>

              <Text style={styles.subheading}>✈️ Diaspora Express (UK & USA)</Text>
              <Text style={styles.paragraph}>
                • Shipped via DHL Express & African Cargo partners.{'\n'}
                • Average transit: 3 to 5 business days with live doorstep tracking.{'\n'}
                • Vacuum-sealed in commercial airtight food pouches with 6 months shelf stability at room temperature.
              </Text>
            </View>
          )}

          {activeTab === 'terms' && (
            <View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>⚖️ TERMS & CONDITIONS</Text>
              </View>
              <Text style={styles.sectionTitle}>Customer Satisfaction Guarantee</Text>
              <Text style={styles.paragraph}>
                By placing an order on Sawfy White Enterprises (via web or mobile), you are purchasing authentic farm-raised agricultural food products prepared under strict national hygiene standards.
              </Text>
              <Text style={styles.subheading}>Payments & Routing</Text>
              <Text style={styles.paragraph}>
                All domestic and international card payments are encrypted with end-to-end bank security via Paystack and Flutterwave. We never store credit card numbers on our servers.
              </Text>
              <Text style={styles.subheading}>Damaged or Tampered Shipments</Text>
              <Text style={styles.paragraph}>
                In the rare event that vacuum packaging is damaged in transit, notify us at orders@fish.sawfywhite.com within 48 hours of receipt for an immediate free replacement pack.
              </Text>
            </View>
          )}

          {activeTab === 'privacy' && (
            <View>
              <View style={styles.pill}>
                <Text style={styles.pillText}>🔒 PRIVACY & DATA POLICY</Text>
              </View>
              <Text style={styles.sectionTitle}>Your Privacy is Sacred</Text>
              <Text style={styles.paragraph}>
                Sawfy White Enterprises respects customer privacy. We collect only the information necessary to fulfill your orders, provide shipment updates, and synchronize your cart across devices.
              </Text>
              <Text style={styles.paragraph}>
                • We NEVER sell or share your personal data with third-party advertisers.{'\n'}
                • Authentication credentials are encrypted via Supabase security.{'\n'}
                • You can request account deletion at any time by contacting support.
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF8F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1F2937',
    fontFamily: 'serif',
  },
  closeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#E6F5ED',
  },
  closeText: {
    color: COLORS.primaryDark,
    fontWeight: '800',
    fontSize: 13,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tabItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: COLORS.primary,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  tabLabelActive: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  content: {
    flex: 1,
  },
  contentInner: {
    padding: 20,
    paddingBottom: 40,
  },
  pill: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  pillText: {
    color: COLORS.primaryDark,
    fontSize: 10,
    fontWeight: '800',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1F2937',
    marginBottom: 14,
    fontFamily: 'serif',
  },
  subheading: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
    marginTop: 14,
    marginBottom: 6,
  },
  paragraph: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  highlightCard: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: '#E8C468',
    borderRadius: 16,
    padding: 16,
    marginTop: 10,
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#92400E',
    marginBottom: 6,
  },
  highlightText: {
    fontSize: 12,
    color: '#78350F',
    lineHeight: 18,
  },
});
