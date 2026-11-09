import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../context/AppContext';

export const BookDetailModal: React.FC = () => {
  const {
    selectedBook,
    closeBookDetail,
    addToCart,
    openCheckout,
  } = useApp();

  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  if (!selectedBook) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const discountPercent =
    selectedBook.originalPrice && selectedBook.originalPrice > selectedBook.price
      ? Math.round(
          ((selectedBook.originalPrice - selectedBook.price) /
            selectedBook.originalPrice) *
            100
        )
      : 0;

  const handleAddToCart = () => {
    addToCart(selectedBook, quantity);
    closeBookDetail();
  };

  const handleBuyNow = () => {
    addToCart(selectedBook, quantity);
    closeBookDetail();
    openCheckout();
  };

  return (
    <Modal
      visible={!!selectedBook}
      animationType="slide"
      transparent={false}
      onRequestClose={closeBookDetail}
    >
      <SafeAreaView style={styles.safeArea}>
        {/* Top Header Bar */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={closeBookDetail}
            hitSlop={8}
          >
            <Ionicons name="arrow-back" size={24} color="#0F172A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle} numberOfLines={1}>
            Chi tiết sách
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Big Cover Image */}
          <View style={styles.imageContainer}>
            <Image
              source={
                !imgError && selectedBook.coverImage
                  ? { uri: selectedBook.coverImage }
                  : require('../../../assets/BookCover.jpg')
              }
              style={styles.coverImage}
              resizeMode="cover"
              onError={() => setImgError(true)}
            />
          </View>

          {/* Book Info Section */}
          <View style={styles.contentSection}>
            <View style={styles.badgeRow}>
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{selectedBook.category}</Text>
              </View>

              <View
                style={[
                  styles.stockBadge,
                  selectedBook.stock <= 0
                    ? styles.stockBadgeOut
                    : styles.stockBadgeIn,
                ]}
              >
                <Text
                  style={[
                    styles.stockBadgeText,
                    selectedBook.stock <= 0
                      ? styles.stockBadgeTextOut
                      : styles.stockBadgeTextIn,
                  ]}
                >
                  {selectedBook.stock > 0
                    ? `Còn lại ${selectedBook.stock} cuốn`
                    : 'Hết hàng'}
                </Text>
              </View>
            </View>

            <Text style={styles.title}>{selectedBook.title}</Text>
            <Text style={styles.author}>Tác giả: {selectedBook.author}</Text>

            {/* Rating row */}
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesome
                    key={star}
                    name="star"
                    size={16}
                    color="#F59E0B"
                    style={{ marginRight: 2 }}
                  />
                ))}
              </View>
              <Text style={styles.ratingScore}>
                {selectedBook.rating ? selectedBook.rating.toFixed(1) : '5.0'}
              </Text>
              <Text style={styles.reviewsCount}>
                ({selectedBook.reviewsCount || 120} đánh giá)
              </Text>
            </View>

            {/* Price Box */}
            <View style={styles.priceContainer}>
              <Text style={styles.currentPrice}>
                {formatPrice(selectedBook.price)}
              </Text>
              {selectedBook.originalPrice &&
              selectedBook.originalPrice > selectedBook.price ? (
                <>
                  <Text style={styles.originalPrice}>
                    {formatPrice(selectedBook.originalPrice)}
                  </Text>
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>-{discountPercent}%</Text>
                  </View>
                </>
              ) : null}
            </View>

            {/* Quantity Stepper */}
            {selectedBook.stock > 0 && (
              <View style={styles.quantityRow}>
                <Text style={styles.quantityLabel}>Số lượng mua:</Text>
                <View style={styles.stepper}>
                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                  >
                    <Feather
                      name="minus"
                      size={16}
                      color={quantity <= 1 ? '#CBD5E1' : '#0F172A'}
                    />
                  </TouchableOpacity>

                  <Text style={styles.quantityNumber}>{quantity}</Text>

                  <TouchableOpacity
                    style={styles.stepBtn}
                    onPress={() =>
                      setQuantity((q) => Math.min(selectedBook.stock, q + 1))
                    }
                    disabled={quantity >= selectedBook.stock}
                  >
                    <Feather
                      name="plus"
                      size={16}
                      color={
                        quantity >= selectedBook.stock ? '#CBD5E1' : '#0F172A'
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Description */}
            <View style={styles.descSection}>
              <Text style={styles.descHeader}>Mô tả</Text>
              <Text style={styles.descText}>
                {selectedBook.description || 'Chưa có thông tin mô tả cho cuốn sách này.'}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Action Footer */}
        <View style={styles.footerBar}>
          <TouchableOpacity
            style={[
              styles.cartBtn,
              selectedBook.stock <= 0 && styles.disabledBtn,
            ]}
            disabled={selectedBook.stock <= 0}
            onPress={handleAddToCart}
          >
            <Feather name="shopping-bag" size={18} color="#2563EB" />
            <Text style={styles.cartBtnText}>Thêm vào giỏ</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buyBtn,
              selectedBook.stock <= 0 && styles.disabledBtn,
            ]}
            disabled={selectedBook.stock <= 0}
            onPress={handleBuyNow}
          >
            <Text style={styles.buyBtnText}>
              {selectedBook.stock > 0 ? 'Mua ngay' : 'Tạm hết hàng'}
            </Text>
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
  },
  scrollContent: {
    paddingBottom: 24,
  },
  imageContainer: {
    width: '100%',
    height: 320,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverImage: {
    width: 220,
    height: 300,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  contentSection: {
    padding: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  categoryBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  stockBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  stockBadgeIn: {
    backgroundColor: '#ECFDF5',
  },
  stockBadgeOut: {
    backgroundColor: '#FEF2F2',
  },
  stockBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  stockBadgeTextIn: {
    color: '#059669',
  },
  stockBadgeTextOut: {
    color: '#DC2626',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 28,
  },
  author: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 6,
  },
  stars: {
    flexDirection: 'row',
  },
  ratingScore: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  reviewsCount: {
    fontSize: 12,
    color: '#64748B',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    gap: 10,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: '900',
    color: '#DC2626',
  },
  originalPrice: {
    fontSize: 14,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  quantityLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    overflow: 'hidden',
  },
  stepBtn: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
  },
  quantityNumber: {
    width: 44,
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  descSection: {
    marginTop: 24,
  },
  descHeader: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  policyBox: {
    marginTop: 24,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 10,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  policyText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  cartBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
    gap: 8,
  },
  cartBtnText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '700',
  },
  buyBtn: {
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 10,
    backgroundColor: '#2563EB',
  },
  buyBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  disabledBtn: {
    backgroundColor: '#E2E8F0',
    borderColor: '#CBD5E1',
  },
});

