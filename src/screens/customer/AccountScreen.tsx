import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { STAFF_ACCESS_PIN } from '../../config/api';
import { useApp } from '../../context/AppContext';

export const AccountScreen: React.FC = () => {
  const {
    setRole,
    setCustomerTab,
    orders,
    showToast,
  } = useApp();

  // Staff Login Modal state
  const [isStaffLoginOpen, setIsStaffLoginOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handleStaffLogin = () => {
    if (pinInput.trim() === STAFF_ACCESS_PIN) {
      setIsStaffLoginOpen(false);
      setPinInput('');
      setPinError('');
      setRole('staff');
      showToast('Đã chuyển sang chế độ quản lý');
    } else {
      setPinError('Mã PIN không đúng');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Card */}
      <View style={styles.profileCard}>
        <View style={styles.avatarBox}>
          <Ionicons name="person" size={28} color="#2563EB" />
        </View>
        <View style={styles.profileInfo}>
          <Text style={styles.userName}>Nguyễn Văn Khách</Text>
          <Text style={styles.userPhone}>0988 776 655</Text>
        </View>
      </View>

      {/* Account Menu */}
      <View style={styles.sectionCard}>
        <TouchableOpacity
          style={styles.menuItem}
          onPress={() => setCustomerTab('orders')}
        >
          <View style={[styles.menuIcon, { backgroundColor: '#EFF6FF' }]}>
            <Feather name="shopping-bag" size={16} color="#2563EB" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Đơn mua ({orders.length})</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#94A3B8" />
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#ECFDF5' }]}>
            <Feather name="map-pin" size={16} color="#059669" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Địa chỉ nhận hàng</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#94A3B8" />
        </View>

        <View style={styles.divider} />

        <View style={styles.menuItem}>
          <View style={[styles.menuIcon, { backgroundColor: '#F8FAFC' }]}>
            <Feather name="bell" size={16} color="#64748B" />
          </View>
          <View style={styles.menuContent}>
            <Text style={styles.menuTitle}>Thông báo</Text>
          </View>
          <Feather name="chevron-right" size={16} color="#94A3B8" />
        </View>
      </View>

      {/* Discreet Staff Management Link */}
      <View style={styles.discreetStaffArea}>
        <TouchableOpacity
          style={styles.discreetStaffBtn}
          onPress={() => setIsStaffLoginOpen(true)}
          hitSlop={6}
        >
          <Feather name="shield" size={12} color="#94A3B8" />
          <Text style={styles.discreetStaffText}>Chế độ quản lý</Text>
        </TouchableOpacity>
      </View>

      {/* Staff Login PIN Modal */}
      <Modal
        visible={isStaffLoginOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsStaffLoginOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.pinCard}>
            <View style={styles.pinHeader}>
              <MaterialCommunityIcons
                name="shield-lock"
                size={32}
                color="#2563EB"
              />
              <Text style={styles.pinTitle}>Đăng nhập quản lý</Text>
            </View>

            <TextInput
              style={styles.pinInput}
              value={pinInput}
              onChangeText={(t) => {
                setPinInput(t);
                setPinError('');
              }}
              placeholder="Nhập mã PIN"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              secureTextEntry
              autoFocus
            />

            {pinError ? (
              <Text style={styles.pinErrorText}>{pinError}</Text>
            ) : null}

            <View style={styles.pinActions}>
              <TouchableOpacity
                style={styles.pinCancelBtn}
                onPress={() => {
                  setIsStaffLoginOpen(false);
                  setPinInput('');
                  setPinError('');
                }}
              >
                <Text style={styles.pinCancelText}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.pinSubmitBtn}
                onPress={handleStaffLogin}
              >
                <Text style={styles.pinSubmitText}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    gap: 12,
    paddingBottom: 100,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  avatarBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  userPhone: {
    fontSize: 12,
    color: '#64748B',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 10,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  discreetStaffArea: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  discreetStaffBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  discreetStaffText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pinCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  pinHeader: {
    alignItems: 'center',
    marginBottom: 14,
  },
  pinTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 6,
  },
  pinInput: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 3,
  },
  pinErrorText: {
    color: '#DC2626',
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
  },
  pinActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
    width: '100%',
  },
  pinCancelBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
  },
  pinCancelText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
  pinSubmitBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 8,
  },
  pinSubmitText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
