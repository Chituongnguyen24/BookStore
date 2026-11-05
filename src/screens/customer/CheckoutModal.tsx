import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { PaymentMethod } from '../../types';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartTotal,
    isCheckoutOpen,
    closeCheckout,
    createOrder,
    setCustomerTab,
    isLoading,
  } = useApp();

  const [customerName, setCustomerName] = useState('Nguyễn Văn Khách');
  const [phone, setPhone] = useState('0988776655');
  const [address, setAddress] = useState('123 Đường Cầu Giấy, Hà Nội');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('COD');

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const shippingFee = cartTotal >= 200000 ? 0 : 20000;
  const grandTotal = cartTotal + shippingFee;

  const handlePlaceOrder = async () => {
    if (!customerName.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ và tên người nhận.');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập số điện thoại liên hệ.');
      return;
    }
    if (!address.trim()) {
      Alert.alert('Thiếu thông tin', 'Vui lòng nhập địa chỉ nhận hàng.');
      return;
    }

    const orderItems = cart.map((item) => ({
      bookId: item.book.id,
      title: item.book.title,
      author: item.book.author,
      price: item.book.price,
      quantity: item.quantity,
      coverImage: item.book.coverImage,
    }));

    await createOrder({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      note: note.trim() || undefined,
      paymentMethod,
      items: orderItems,
      totalAmount: grandTotal,
      status: 'Chờ xác nhận',
    });

    // Switch to order history tab
    setCustomerTab('orders');
  };

  return (
    <Modal
      visible={isCheckoutOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={closeCheckout}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={closeCheckout}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Xác nhận thanh toán</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section 1: Customer & Delivery Info */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="map-pin" size={18} color="#2563EB" />
              <Text style={styles.sectionTitle}>Thông tin nhận hàng</Text>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Họ và tên người nhận *</Text>
              <TextInput
                style={styles.input}
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Ví dụ: Nguyễn Văn A"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Số điện thoại *</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="Ví dụ: 0912345678"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Địa chỉ nhận hàng *</Text>
              <TextInput
                style={[styles.input, styles.multilineInput]}
                value={address}
                onChangeText={setAddress}
                placeholder="Số nhà, tên đường, quận/huyện..."
                multiline
                numberOfLines={2}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Ghi chú</Text>
              <TextInput
                style={styles.input}
                value={note}
                onChangeText={setNote}
                placeholder="Ghi chú đơn hàng..."
              />
            </View>
          </View>

          {/* Section 2: Payment Method */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="credit-card" size={18} color="#2563EB" />
              <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
            </View>

            {[
              {
                id: 'COD' as PaymentMethod,
                title: 'Tiền mặt khi nhận hàng (COD)',
                icon: 'cash',
              },
              {
                id: 'Chuyển khoản' as PaymentMethod,
                title: 'Chuyển khoản ngân hàng',
                icon: 'bank',
              },
              {
                id: 'Ví MoMo' as PaymentMethod,
                title: 'Ví MoMo',
                icon: 'wallet',
              },
            ].map((pm) => {
              const isSelected = paymentMethod === pm.id;
              return (
                <TouchableOpacity
                  key={pm.id}
                  style={[
                    styles.paymentOption,
                    isSelected && styles.paymentOptionActive,
                  ]}
                  onPress={() => setPaymentMethod(pm.id)}
                  activeOpacity={0.7}
                >
                  <MaterialCommunityIcons
                    name={pm.icon as any}
                    size={22}
                    color={isSelected ? '#2563EB' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.paymentTitle,
                      isSelected && styles.paymentTitleActive,
                    ]}
                  >
                    {pm.title}
                  </Text>
                  <View
                    style={[
                      styles.radioCircle,
                      isSelected && styles.radioCircleActive,
                    ]}
                  >
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Section 3: Ordered Items Review */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Feather name="package" size={18} color="#2563EB" />
              <Text style={styles.sectionTitle}>
                Đơn hàng ({cart.length} sản phẩm)
              </Text>
            </View>

            {cart.map((item) => (
              <View key={item.book.id} style={styles.itemRow}>
                <Image
                  source={
                    item.book.coverImage
                      ? { uri: item.book.coverImage }
                      : require('../../../assets/BookCover.jpg')
                  }
                  style={styles.itemThumb}
                  resizeMode="cover"
                />
                <View style={styles.itemDetails}>
                  <Text style={styles.itemTitle} numberOfLines={1}>
                    {item.book.title}
                  </Text>
                  <Text style={styles.itemSub}>
                    {formatPrice(item.book.price)} x {item.quantity}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  {formatPrice(item.book.price * item.quantity)}
                </Text>
              </View>
            ))}
          </View>

          {/* Section 4: Cost Breakdown */}
          <View style={styles.summaryBox}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tiền sách:</Text>
              <Text style={styles.summaryValue}>{formatPrice(cartTotal)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Phí giao hàng:</Text>
              <Text
                style={[
                  styles.summaryValue,
                  shippingFee === 0 && styles.freeShipping,
                ]}
              >
                {shippingFee === 0 ? 'Miễn phí' : formatPrice(shippingFee)}
              </Text>
            </View>
            <View style={[styles.summaryRow, styles.grandTotalRow]}>
              <Text style={styles.grandTotalLabel}>Tổng thanh toán:</Text>
              <Text style={styles.grandTotalValue}>
                {formatPrice(grandTotal)}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer Place Order Button */}
        <View style={styles.footerBar}>
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            disabled={isLoading}
            onPress={handlePlaceOrder}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitBtnText}>Xác nhận đặt hàng</Text>
                <Feather name="check" size={20} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  scroll: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
    gap: 16,
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  formGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#0F172A',
  },
  multilineInput: {
    height: 60,
    textAlignVertical: 'top',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    marginBottom: 10,
    gap: 12,
  },
  paymentOptionActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  paymentInfo: {
    flex: 1,
  },
  paymentTitle: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
  },
  paymentTitleActive: {
    color: '#2563EB',
  },
  paymentDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: '#2563EB',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563EB',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 12,
  },
  itemThumb: {
    width: 44,
    height: 60,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  itemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  freeShipping: {
    color: '#10B981',
    fontWeight: '700',
  },
  grandTotalRow: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 0,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  grandTotalValue: {
    fontSize: 18,
    fontWeight: '900',
    color: '#DC2626',
  },
  footerBar: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 10,
    gap: 8,
  },
  submitBtnDisabled: {
    backgroundColor: '#93C5FD',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});

