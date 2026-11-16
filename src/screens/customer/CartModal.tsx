import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../utils/responsive';

export const CartModal: React.FC = () => {
  const {
    cart,
    cartTotal,
    isCartOpen,
    closeCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    openCheckout,
  } = useApp();

  const { isWide } = useResponsive();

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const shippingFee = cartTotal > 0 ? (cartTotal >= 200000 ? 0 : 20000) : 0;
  const grandTotal = cartTotal + shippingFee;
  const amountToFreeShip = Math.max(0, 200000 - cartTotal);

  return (
    <Modal
      visible={isCartOpen}
      animationType={isWide ? 'fade' : 'slide'}
      transparent={isWide}
      onRequestClose={closeCart}
    >
      <View style={[styles.backdrop, isWide && styles.backdropWide]}>
        {isWide && (
          <Pressable style={StyleSheet.absoluteFill} onPress={closeCart} />
        )}

        <SafeAreaView style={[styles.safeArea, isWide && styles.dialogCard]}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={closeCart}
              hitSlop={8}
            >
              <Ionicons
                name={isWide ? 'close' : 'arrow-back'}
                size={22}
                color="#0F172A"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Giỏ hàng ({cart.length})</Text>
            {cart.length > 0 ? (
              <TouchableOpacity onPress={clearCart} hitSlop={8}>
                <Text style={styles.clearText}>Xóa hết</Text>
              </TouchableOpacity>
            ) : (
              <View style={{ width: 40 }} />
            )}
          </View>

          {cart.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="shopping-bag" size={56} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Giỏ hàng của bạn đang trống</Text>
              <Text style={styles.emptySubtitle}>
                Hãy khám phá và chọn những cuốn sách yêu thích nhé!
              </Text>
              <TouchableOpacity style={styles.continueBtn} onPress={closeCart}>
                <Text style={styles.continueBtnText}>Tiếp tục xem sách</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.container}>
              {/* Freeship Progress Notice */}
              <View style={styles.freeshipBanner}>
                <Feather
                  name={amountToFreeShip === 0 ? 'check-circle' : 'truck'}
                  size={15}
                  color={amountToFreeShip === 0 ? '#059669' : '#2563EB'}
                />
                <Text
                  style={[
                    styles.freeshipText,
                    amountToFreeShip === 0 && { color: '#059669' },
                  ]}
                >
                  {amountToFreeShip === 0
                    ? 'Đơn hàng của bạn đã được Miễn phí vận chuyển!'
                    : `Mua thêm ${formatPrice(amountToFreeShip)} để được Freeship`}
                </Text>
              </View>

              <FlatList
                data={cart}
                keyExtractor={(item) => item.book.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                  <View style={styles.cartCard}>
                    <Image
                      source={
                        item.book.coverImage
                          ? { uri: item.book.coverImage }
                          : require('../../../assets/BookCover.jpg')
                      }
                      style={styles.bookThumb}
                      resizeMode="cover"
                    />
                    <View style={styles.cardInfo}>
                      <View style={styles.titleRow}>
                        <Text style={styles.bookTitle} numberOfLines={2}>
                          {item.book.title}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeFromCart(item.book.id)}
                          hitSlop={6}
                        >
                          <Ionicons name="close" size={20} color="#94A3B8" />
                        </TouchableOpacity>
                      </View>

                      <Text style={styles.bookAuthor}>{item.book.author}</Text>
                      <Text style={styles.bookPrice}>
                        {formatPrice(item.book.price)}
                      </Text>

                      {/* Stepper */}
                      <View style={styles.stepperRow}>
                        <View style={styles.stepper}>
                          <TouchableOpacity
                            style={styles.stepBtn}
                            onPress={() =>
                              updateCartQuantity(
                                item.book.id,
                                item.quantity - 1
                              )
                            }
                          >
                            <Feather name="minus" size={14} color="#0F172A" />
                          </TouchableOpacity>

                          <Text style={styles.quantityText}>
                            {item.quantity}
                          </Text>

                          <TouchableOpacity
                            style={styles.stepBtn}
                            onPress={() =>
                              updateCartQuantity(
                                item.book.id,
                                item.quantity + 1
                              )
                            }
                            disabled={item.quantity >= item.book.stock}
                          >
                            <Feather
                              name="plus"
                              size={14}
                              color={
                                item.quantity >= item.book.stock
                                  ? '#CBD5E1'
                                  : '#0F172A'
                              }
                            />
                          </TouchableOpacity>
                        </View>

                        <Text style={styles.itemTotal}>
                          {formatPrice(item.book.price * item.quantity)}
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              />

              {/* Bottom Summary Bar */}
              <View style={styles.summaryBox}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Tạm tính:</Text>
                  <Text style={styles.summaryValue}>
                    {formatPrice(cartTotal)}
                  </Text>
                </View>

                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Phí vận chuyển:</Text>
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

                <TouchableOpacity
                  style={styles.checkoutBtn}
                  onPress={openCheckout}
                >
                  <Text style={styles.checkoutBtnText}>Tiến hành đặt hàng</Text>
                  <Feather name="arrow-right" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </SafeAreaView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backdropWide: {
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  dialogCard: {
    maxWidth: 580,
    maxHeight: '88%',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.25,
    shadowRadius: 24,
    elevation: 16,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  clearText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  freeshipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#DBEAFE',
  },
  freeshipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  cartCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  bookThumb: {
    width: 70,
    height: 95,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    paddingRight: 6,
    lineHeight: 19,
  },
  bookAuthor: {
    fontSize: 12,
    color: '#64748B',
  },
  bookPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 2,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  quantityText: {
    width: 32,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  summaryBox: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
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
    marginTop: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginBottom: 14,
  },
  grandTotalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  grandTotalValue: {
    fontSize: 19,
    fontWeight: '900',
    color: '#DC2626',
  },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    height: 48,
    borderRadius: 12,
    gap: 8,
  },
  checkoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  continueBtn: {
    marginTop: 20,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  continueBtnText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
});
