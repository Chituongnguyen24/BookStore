import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { STAFF_ACCESS_PIN } from '../../config/api';
import { useApp } from '../../context/AppContext';
import { confirmDialog } from '../../utils/responsive';

export const AccountScreen: React.FC = () => {
  const { setRole, setCustomerTab, orders, clearCart, showToast } = useApp();

  // System Settings / Internal Auth Modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState('');

  const handleStaffLogin = () => {
    if (pinInput.trim() === STAFF_ACCESS_PIN) {
      setIsSettingsOpen(false);
      setPinInput('');
      setPinError('');
      setRole('staff');
      showToast('Đã chuyển sang chế độ quản lý');
    } else {
      setPinError('Mã xác thực không đúng');
    }
  };

  const handleLogout = () => {
    confirmDialog(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất khỏi tài khoản hiện tại?',
      () => {
        clearCart();
        setCustomerTab('home');
        showToast('Đã đăng xuất thành công');
      },
      'Đăng xuất',
      true
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.centeredWrapper}>
        {/* Profile Card with subtle Settings Gear Icon on top-right */}
        <View style={styles.profileCard}>
          <View style={styles.avatarBox}>
            <Ionicons name="person" size={30} color="#2563EB" />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>Nguyễn Văn Khách</Text>
            <Text style={styles.userPhone}>0988 776 655</Text>
            <View style={styles.memberBadge}>
              <Feather name="award" size={11} color="#059669" />
              <Text style={styles.memberBadgeText}>Khách hàng thân thiết</Text>
            </View>
          </View>

          {/* Subtle Gear Icon (⚙️) */}
          <TouchableOpacity
            style={styles.gearBtn}
            onPress={() => setIsSettingsOpen(true)}
            hitSlop={10}
          >
            <Feather name="settings" size={18} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Account Menu */}
        <View style={styles.sectionCard}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setCustomerTab('orders')}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="shopping-bag" size={17} color="#2563EB" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Đơn mua ({orders.length})</Text>
              <Text style={styles.menuSubtitle}>
                Xem lịch sử và trạng thái giao hàng
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#ECFDF5' }]}>
              <Feather name="map-pin" size={17} color="#059669" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Địa chỉ nhận hàng mặc định</Text>
              <Text style={styles.menuSubtitle}>
                123 Đường Cầu Giấy, Hà Nội
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </View>

          <View style={styles.divider} />

          <View style={styles.menuItem}>
            <View style={[styles.menuIcon, { backgroundColor: '#FEF3C7' }]}>
              <Feather name="truck" size={17} color="#D97706" />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Chính sách vận chuyển</Text>
              <Text style={styles.menuSubtitle}>
                Miễn phí giao hàng cho đơn từ 200.000đ
              </Text>
            </View>
            <Feather name="chevron-right" size={18} color="#94A3B8" />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
          activeOpacity={0.75}
        >
          <Feather name="log-out" size={18} color="#DC2626" />
          <Text style={styles.logoutBtnText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>

      {/* System Settings -> Internal Authentication Modal */}
      <Modal
        visible={isSettingsOpen}
        animationType="fade"
        transparent
        onRequestClose={() => setIsSettingsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setIsSettingsOpen(false)}
          />
          <View style={styles.pinCard}>
            <View style={styles.pinHeader}>
              <View style={styles.pinIconWrap}>
                <Feather name="sliders" size={24} color="#2563EB" />
              </View>
              <Text style={styles.pinTitle}>Cài đặt hệ thống</Text>
              <Text style={styles.pinSubtitle}>
                Xác thực nội bộ (Dành cho quản trị viên)
              </Text>
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
              onSubmitEditing={handleStaffLogin}
            />

            {pinError ? (
              <Text style={styles.pinErrorText}>{pinError}</Text>
            ) : null}

            <View style={styles.pinActions}>
              <TouchableOpacity
                style={styles.pinCancelBtn}
                onPress={() => {
                  setIsSettingsOpen(false);
                  setPinInput('');
                  setPinError('');
                }}
              >
                <Text style={styles.pinCancelText}>Đóng</Text>
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
    paddingTop: 24,
    paddingBottom: 100,
  },
  centeredWrapper: {
    width: '100%',
    maxWidth: 680,
    alignSelf: 'center',
    gap: 16,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
    gap: 3,
  },
  userName: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  userPhone: {
    fontSize: 13,
    color: '#64748B',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 4,
  },
  memberBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#059669',
  },
  gearBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  sectionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 14,
  },
  menuIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuContent: {
    flex: 1,
    gap: 2,
  },
  menuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  menuSubtitle: {
    fontSize: 12,
    color: '#64748B',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 6,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 14,
    paddingVertical: 14,
    gap: 8,
  },
  logoutBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#DC2626',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  pinCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
  },
  pinHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  pinIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  pinTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  pinSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
  },
  pinInput: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 4,
  },
  pinErrorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 8,
  },
  pinActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
    width: '100%',
  },
  pinCancelBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  pinCancelText: {
    color: '#475569',
    fontSize: 14,
    fontWeight: '700',
  },
  pinSubmitBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },
  pinSubmitText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
