import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native';
import { BottomTabBar } from './src/components/BottomTabBar';
import { FloatingCartButton } from './src/components/FloatingCartButton';
import { Header } from './src/components/Header';
import { MockApiSettingsModal } from './src/components/MockApiSettingsModal';
import { Toast } from './src/components/Toast';
import { AppProvider, useApp } from './src/context/AppContext';
import { AccountScreen } from './src/screens/customer/AccountScreen';
import { BookDetailModal } from './src/screens/customer/BookDetailModal';
import { CartModal } from './src/screens/customer/CartModal';
import { CheckoutModal } from './src/screens/customer/CheckoutModal';
import { CustomerHomeScreen } from './src/screens/customer/CustomerHomeScreen';
import { OrderHistoryScreen } from './src/screens/customer/OrderHistoryScreen';
import { BookFormModal } from './src/screens/staff/BookFormModal';
import { StaffBooksScreen } from './src/screens/staff/StaffBooksScreen';
import { StaffDashboardScreen } from './src/screens/staff/StaffDashboardScreen';
import { StaffOrdersScreen } from './src/screens/staff/StaffOrdersScreen';

const MainScreen: React.FC = () => {
  const { role, customerTab, staffTab } = useApp();

  const renderContent = () => {
    if (role === 'customer') {
      switch (customerTab) {
        case 'home':
          return <CustomerHomeScreen />;
        case 'orders':
          return <OrderHistoryScreen />;
        case 'account':
          return <AccountScreen />;
        default:
          return <CustomerHomeScreen />;
      }
    } else {
      switch (staffTab) {
        case 'dashboard':
          return <StaffDashboardScreen />;
        case 'books':
          return <StaffBooksScreen />;
        case 'orders':
          return <StaffOrdersScreen />;
        default:
          return <StaffDashboardScreen />;
      }
    }
  };

  return (
    <View style={styles.webWrapper}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />

        {/* Global Store Header */}
        <Header />

        {/* Dynamic Screen Content */}
        <View style={styles.body}>{renderContent()}</View>

        {/* Customer Floating Cart FAB */}
        <FloatingCartButton />

        {/* Bottom Navigation */}
        <BottomTabBar />

        {/* Modals */}
        <BookDetailModal />
        <CartModal />
        <CheckoutModal />
        <BookFormModal />
        <MockApiSettingsModal />

        {/* In-app Toast feedback */}
        <Toast />
      </SafeAreaView>
    </View>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainScreen />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  webWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    height: '100%',
  },
  body: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
