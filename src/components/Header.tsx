import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    cartCount,
    openCart,
    openBookForm,
    isOnline,
    showToast,
  } = useApp();

  const handleStaffLogout = () => {
    setRole('customer');
    showToast('Đã chuyển về giao diện Khách hàng');
  };

  if (role === 'staff') {
    return (
      <View style={[styles.container, styles.staffContainer]}>
        <View style={styles.topRow}>
          <View style={styles.brandContainer}>
            <View style={styles.staffIconBox}>
              <MaterialCommunityIcons name="shield-account" size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.staffTitle}>Quản trị kho sách</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            {/* Quick Add Book */}
            <Pressable
              style={styles.staffAddButton}
              onPress={() => openBookForm()}
              hitSlop={8}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.staffAddText}>Thêm sách</Text>
            </Pressable>

            {/* Logout to Customer Mode */}
            <Pressable
              style={styles.staffLogoutButton}
              onPress={handleStaffLogout}
              hitSlop={8}
            >
              <Feather name="log-out" size={16} color="#DC2626" />
              <Text style={styles.staffLogoutText}>Thoát</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // CUSTOMER HEADER: Pure, clean, welcoming, NO staff switch button!
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Brand Logo and Title */}
        <View style={styles.brandContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.appName}>BookStore</Text>
          </View>
        </View>

        {/* Right Action: Cart */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={styles.cartButton}
            onPress={openCart}
            hitSlop={8}
            android_ripple={{ color: '#EFF6FF', borderless: true }}
          >
            <Feather name="shopping-bag" size={22} color="#1E293B" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingTop: Platform.OS === 'android' ? 36 : 14,
    paddingBottom: 10,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  staffContainer: {
    backgroundColor: '#0F172A',
    borderBottomColor: '#1E293B',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 38,
    height: 38,
    borderRadius: 10,
  },
  appName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  sloganRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  sloganText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cartButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: 'bold',
  },
  staffIconBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  staffSub: {
    fontSize: 11,
    color: '#94A3B8',
  },
  staffAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  staffAddText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  staffLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  staffLogoutText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
  },
});
