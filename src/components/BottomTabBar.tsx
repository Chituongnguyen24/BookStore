import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { CustomerTab, StaffTab } from '../types';

export const BottomTabBar: React.FC = () => {
  const {
    role,
    customerTab,
    setCustomerTab,
    staffTab,
    setStaffTab,
    orders,
  } = useApp();

  const pendingOrdersCount = orders.filter((o) => o.status === 'Chờ xác nhận').length;
  const activeOrdersCount = orders.filter(
    (o) => o.status === 'Chờ xác nhận' || o.status === 'Đang xử lý' || o.status === 'Đang giao'
  ).length;

  if (role === 'customer') {
    const tabs: {
      key: CustomerTab;
      label: string;
      icon: string;
      badge?: number;
    }[] = [
      { key: 'home', label: 'Trang chủ', icon: 'home' },
      { key: 'orders', label: 'Đơn mua', icon: 'shopping-bag', badge: activeOrdersCount },
      { key: 'account', label: 'Tài khoản', icon: 'user' },
    ];

    return (
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const isActive = customerTab === tab.key;
          return (
            <Pressable
              key={tab.key}
              style={styles.tabItem}
              onPress={() => setCustomerTab(tab.key)}
            >
              <View style={styles.iconContainer}>
                <Feather
                  name={tab.icon as any}
                  size={22}
                  color={isActive ? '#2563EB' : '#94A3B8'}
                />
                {tab.badge && tab.badge > 0 ? (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                  </View>
                ) : null}
              </View>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.tabLabelActive : styles.tabLabelInactive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    );
  }

  // Staff Navigation
  const staffTabs: {
    key: StaffTab;
    label: string;
    icon: any;
    isIonicons?: boolean;
    badge?: number;
  }[] = [
    { key: 'dashboard', label: 'Tổng quan', icon: 'view-dashboard-outline' },
    { key: 'books', label: 'Kho sách', icon: 'book-outline', isIonicons: true },
    {
      key: 'orders',
      label: 'Đơn hàng',
      icon: 'receipt-outline',
      isIonicons: true,
      badge: pendingOrdersCount,
    },
  ];

  return (
    <View style={styles.tabBar}>
      {staffTabs.map((tab) => {
        const isActive = staffTab === tab.key;
        const color = isActive ? '#2563EB' : '#94A3B8';

        return (
          <Pressable
            key={tab.key}
            style={styles.tabItem}
            onPress={() => setStaffTab(tab.key)}
          >
            <View style={styles.iconContainer}>
              {tab.isIonicons ? (
                <Ionicons name={tab.icon} size={21} color={color} />
              ) : (
                <MaterialCommunityIcons name={tab.icon} size={21} color={color} />
              )}
              {tab.badge && tab.badge > 0 ? (
                <View style={styles.tabBadge}>
                  <Text style={styles.tabBadgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text
              style={[
                styles.tabLabel,
                isActive ? styles.tabLabelActive : styles.tabLabelInactive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    height: 62,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  iconContainer: {
    position: 'relative',
  },
  tabLabel: {
    fontSize: 11,
    marginTop: 3,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#2563EB',
  },
  tabLabelInactive: {
    color: '#94A3B8',
  },
  tabBadge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#EF4444',
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  tabBadgeText: {
    fontSize: 9,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
