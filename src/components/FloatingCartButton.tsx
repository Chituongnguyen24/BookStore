import { Feather } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';

export const FloatingCartButton: React.FC = () => {
  const { role, cartCount, openCart } = useApp();

  if (role !== 'customer' || cartCount === 0) return null;

  return (
    <Pressable
      style={styles.fab}
      onPress={openCart}
      android_ripple={{ color: '#1D4ED8' }}
    >
      <Feather name="shopping-bag" size={24} color="#FFFFFF" />
      <View style={styles.badge}>
        <Text style={styles.badgeText}>
          {cartCount > 99 ? '99+' : cartCount}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 75,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 999,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#EF4444',
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

