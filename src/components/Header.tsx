import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { CustomerTab, StaffTab } from '../types';
import { MAX_CONTENT_WIDTH, useResponsive } from '../utils/responsive';

export const Header: React.FC = () => {
  const {
    role,
    setRole,
    customerTab,
    setCustomerTab,
    staffTab,
    setStaffTab,
    cartCount,
    openCart,
    openBookForm,
    orders,
    showToast,
  } = useApp();

  const { isWide, isDesktop } = useResponsive();

  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Chờ xác nhận'
  ).length;
  const activeOrdersCount = orders.filter(
    (o) =>
      o.status === 'Chờ xác nhận' ||
      o.status === 'Đang xử lý' ||
      o.status === 'Đang giao'
  ).length;

  const handleStaffLogout = () => {
    setRole('customer');
    showToast('Đã chuyển về giao diện Khách hàng');
  };

  if (role === 'staff') {
    const staffNavItems: {
      key: StaffTab;
      label: string;
      icon: string;
      badge?: number;
    }[] = [
      { key: 'dashboard', label: 'Tổng quan', icon: 'grid' },
      { key: 'books', label: 'Kho sách', icon: 'book-open' },
      {
        key: 'orders',
        label: 'Đơn hàng',
        icon: 'clipboard',
        badge: pendingOrdersCount,
      },
    ];

    return (
      <View style={[styles.container, styles.staffContainer]}>
        <View
          style={[
            styles.innerContainer,
            { paddingHorizontal: isDesktop ? 24 : 16 },
          ]}
        >
          {/* Left: Brand */}
          <Pressable
            style={styles.brandContainer}
            onPress={() => setStaffTab('dashboard')}
          >
            <View style={styles.staffIconBox}>
              <MaterialCommunityIcons
                name="shield-account"
                size={22}
                color="#FFFFFF"
              />
            </View>
            <View>
              <Text style={styles.staffTitle}>BookStore Admin</Text>
              <Text style={styles.staffSubtitle}>Hệ thống quản lý</Text>
            </View>
          </Pressable>

          {/* Center: Desktop Navigation */}
          {isWide && (
            <View style={styles.desktopNav}>
              {staffNavItems.map((item) => {
                const isActive = staffTab === item.key;
                return (
                  <Pressable
                    key={item.key}
                    style={[
                      styles.staffNavItem,
                      isActive && styles.staffNavItemActive,
                    ]}
                    onPress={() => setStaffTab(item.key)}
                  >
                    <Feather
                      name={item.icon as any}
                      size={16}
                      color={isActive ? '#FFFFFF' : '#94A3B8'}
                    />
                    <Text
                      style={[
                        styles.staffNavText,
                        isActive && styles.staffNavTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.badge && item.badge > 0 ? (
                      <View style={styles.navBadge}>
                        <Text style={styles.navBadgeText}>{item.badge}</Text>
                      </View>
                    ) : null}
                  </Pressable>
                );
              })}
            </View>
          )}

          {/* Right Actions */}
          <View style={styles.actionsContainer}>
            <Pressable
              style={styles.staffAddButton}
              onPress={() => openBookForm()}
              hitSlop={8}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />
              <Text style={styles.staffAddText}>Thêm sách</Text>
            </Pressable>

            <Pressable
              style={styles.staffLogoutButton}
              onPress={handleStaffLogout}
              hitSlop={8}
            >
              <Feather name="log-out" size={15} color="#FCA5A5" />
              <Text style={styles.staffLogoutText}>Đăng xuất</Text>
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // CUSTOMER HEADER
  const customerNavItems: {
    key: CustomerTab;
    label: string;
    icon: string;
    badge?: number;
  }[] = [
    { key: 'home', label: 'Khám phá', icon: 'compass' },
    {
      key: 'orders',
      label: 'Đơn mua',
      icon: 'package',
      badge: activeOrdersCount,
    },
    { key: 'account', label: 'Tài khoản', icon: 'user' },
  ];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.innerContainer,
          { paddingHorizontal: isDesktop ? 24 : 16 },
        ]}
      >
        {/* Brand Logo and Title */}
        <Pressable
          style={styles.brandContainer}
          onPress={() => setCustomerTab('home')}
        >
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <View>
            <Text style={styles.appName}>BookStore</Text>
            <Text style={styles.appTagline}>Nhà sách trực tuyến</Text>
          </View>
        </Pressable>

        {/* Desktop Top Navigation */}
        {isWide && (
          <View style={styles.desktopNav}>
            {customerNavItems.map((item) => {
              const isActive = customerTab === item.key;
              return (
                <Pressable
                  key={item.key}
                  style={[
                    styles.customerNavItem,
                    isActive && styles.customerNavItemActive,
                  ]}
                  onPress={() => setCustomerTab(item.key)}
                >
                  <Feather
                    name={item.icon as any}
                    size={16}
                    color={isActive ? '#2563EB' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.customerNavText,
                      isActive && styles.customerNavTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  {item.badge && item.badge > 0 ? (
                    <View style={styles.navBadge}>
                      <Text style={styles.navBadgeText}>{item.badge}</Text>
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        )}

        {/* Right Action: Cart */}
        <View style={styles.actionsContainer}>
          <Pressable
            style={[styles.cartButton, isWide && styles.cartButtonWide]}
            onPress={openCart}
            hitSlop={8}
          >
            <Feather name="shopping-bag" size={20} color="#1E293B" />
            {isWide && <Text style={styles.cartButtonText}>Giỏ hàng</Text>}
            {cartCount > 0 && (
              <View style={isWide ? styles.badgeInline : styles.badge}>
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
    borderBottomColor: '#E2E8F0',
    paddingTop: Platform.OS === 'android' ? 36 : 12,
    paddingBottom: 12,
    zIndex: 100,
  },
  staffContainer: {
    backgroundColor: '#0F172A',
    borderBottomColor: '#1E293B',
  },
  innerContainer: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
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
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  appName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.4,
  },
  appTagline: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  desktopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customerNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  customerNavItemActive: {
    backgroundColor: '#EFF6FF',
  },
  customerNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  customerNavTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  staffNavItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  staffNavItemActive: {
    backgroundColor: '#1E293B',
  },
  staffNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  staffNavTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  navBadge: {
    backgroundColor: '#EF4444',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  navBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
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
  cartButtonWide: {
    width: 'auto',
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
  },
  cartButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#EF4444',
    minWidth: 19,
    height: 19,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeInline: {
    backgroundColor: '#2563EB',
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  staffIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  staffSubtitle: {
    fontSize: 11,
    color: '#94A3B8',
  },
  staffAddButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 5,
  },
  staffAddText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  staffLogoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    gap: 6,
  },
  staffLogoutText: {
    color: '#FCA5A5',
    fontSize: 13,
    fontWeight: '700',
  },
});
