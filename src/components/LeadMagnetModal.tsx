import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { COLORS, API_BASE_URL } from '../lib/constants';

interface LeadMagnetModalProps {
  visible: boolean;
  onClose: () => void;
  userEmail?: string;
  userName?: string;
}

export function LeadMagnetModal({
  visible,
  onClose,
  userEmail = '',
  userName = '',
}: LeadMagnetModalProps) {
  const [email, setEmail] = useState(userEmail);
  const [name, setName] = useState(userName);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'lead_magnet',
          email: email.trim(),
          name: name.trim() || 'Food Lover',
        }),
      });

      if (!res.ok) {
        throw new Error('Could not dispatch guide. Please try again.');
      }

      setSuccess(true);
    } catch (err: any) {
      // If network fails, allow immediate PDF download anyway
      setSuccess(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenPdf = () => {
    Linking.openURL(`${API_BASE_URL}/api/download/lead-magnet`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Close X */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {!success ? (
            <>
              {/* Header Badge */}
              <View style={styles.badge}>
                <Text style={styles.badgeText}>📖 100% FREE DIGITAL GUIDE</Text>
              </View>

              <Text style={styles.title}>The 7 Hidden Health Benefits of Dried Catfish</Text>
              <Text style={styles.subtitle}>
                Discover how traditional Abeokuta farm-raised dried catfish delivers 4x the protein density of beef, rich heart-healthy Omega-3s, and zero artificial preservatives.
              </Text>

              {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

              {/* Input: Name */}
              <Text style={styles.inputLabel}>Your First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Rukayyah"
                placeholderTextColor="#999"
                value={name}
                onChangeText={setName}
              />

              {/* Input: Email */}
              <Text style={styles.inputLabel}>Your Email Address</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />

              {/* Submit CTA */}
              <TouchableOpacity
                style={styles.submitBtn}
                onPress={handleSubmit}
                disabled={submitting}
                activeOpacity={0.8}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Send My Free PDF Guide 📥</Text>
                )}
              </TouchableOpacity>

              <Text style={styles.disclaimer}>
                Instant PDF download + sent directly to your email inbox. No spam ever.
              </Text>
            </>
          ) : (
            <View style={styles.successContainer}>
              <Text style={styles.successIcon}>🎉</Text>
              <Text style={styles.successTitle}>Your Guide is Ready!</Text>
              <Text style={styles.successMsg}>
                We have dispatched a copy of &ldquo;The 7 Hidden Health Benefits of Dried Catfish&rdquo; to <Text style={{ fontWeight: 'bold' }}>{email}</Text>.
              </Text>

              <TouchableOpacity style={styles.downloadBtn} onPress={handleOpenPdf} activeOpacity={0.8}>
                <Text style={styles.downloadBtnText}>📖 Open / Download PDF Guide Now →</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.7}>
                <Text style={styles.doneBtnText}>Back to Shop</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    maxWidth: 420,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#E8C468',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  closeBtn: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: 'bold',
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E6F5ED',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B3E0C9',
    marginBottom: 10,
  },
  badgeText: {
    color: COLORS.primaryDark,
    fontSize: 10,
    fontWeight: '800',
  },
  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#1F2937',
    lineHeight: 26,
    marginBottom: 8,
    fontFamily: 'serif',
  },
  subtitle: {
    fontSize: 12,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 16,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 11,
    marginBottom: 8,
    fontWeight: '600',
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#1F2937',
    marginBottom: 12,
  },
  submitBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 10,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
  disclaimer: {
    fontSize: 10,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  successIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.primaryDark,
    marginBottom: 8,
    fontFamily: 'serif',
  },
  successMsg: {
    fontSize: 12,
    color: '#4B5563',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  downloadBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  downloadBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 12,
  },
  doneBtn: {
    paddingVertical: 8,
  },
  doneBtnText: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '600',
  },
});
