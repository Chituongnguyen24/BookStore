import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { useResponsive } from '../../utils/responsive';

export const BookDetailModal: React.FC = () => {
  const { selectedBook, closeBookDetail, addToCart, openCheckout } = useApp();
  const { isWide } = useResponsive();

  const [quantity, setQuantity] = useState(1);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setQuantity(1);
    setImgError(false);
  }, [selectedBook?.id]);

  if (!selectedBook) return null;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const discountPercent =
    selectedBook.originalPrice &&
    selectedBook.originalPrice > selectedBook.price
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
      animationType={isWide ? 'fade' : 'slide'}
      transparent={isWide}
      onRequestClose={closeBookDetail}
    >
      <View style={[styles.backdrop, isWide && styles.backdropWide]}>
        {isWide && (
          <Pressable style={StyleSheet.absoluteFill} onPress={closeBookDetail} />
        )}

        <SafeAreaView style={[styles.safeArea, isWide && styles.dialogCard]}>
          {/* Top Header Bar */}
          <View style={styles.headerBar}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={closeBookDetail}
              hitSlop={8}
            >
              <Ionicons
                name={isWide ? 'close' : 'arrow-back'}
                size={22}
                color="#0F172A"
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle} numberOfLines={1}>
              Thông tin chi tiết sách
            </Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={isWide ? styles.wideBodyRow : undefined}>
              {/* Left / Top: Cover Image */}
              <View
                style={[
                  styles.imageContainer,
                  isWide && styles.imageContainerWide,
                ]}
              >
                <Image
                  source={
                    !imgError && selectedBook.coverImage
                      ? { uri: selectedBook.coverImage }
                      : require('../../../assets/BookCover.jpg')
                  }
                  style={[styles.coverImage, isWide && styles.coverImageWide]}
                  resizeMode="cover"
                  onError={() => setImgError(true)}
                />
              </View>

              {/* Right / Bottom: Book Info Section */}
              <View
                style={[
                  styles.contentSection,
                  isWide && styles.contentSectionWide,
                ]}
              >
                <View style={styles.badgeRow}>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>
                      {selectedBook.category}
                    </Text>
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
                        size={15}
                        color="#F59E0B"
                        style={{ marginRight: 2 }}
                      />
                    ))}
                  </View>
                  <Text style={styles.ratingScore}>
                    {selectedBook.rating
                      ? selectedBook.rating.toFixed(1)
                      : '5.0'}
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
                        <Text style={styles.discountText}>
                          -{discountPercent}%
                        </Text>
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
                          setQuantity((q) =>
                            Math.min(selectedBook.stock, q + 1)
                          )
                        }
                        disabled={quantity >= selectedBook.stock}
                      >
                        <Feather
                          name="plus"
                          size={16}
                          color={
                            quantity >= selectedBook.stock
                              ? '#CBD5E1'
                              : '#0F172A'
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {/* Description */}
                <View style={styles.descSection}>
                  <Text style={styles.descHeader}>Giới thiệu nội dung</Text>
                  <Text style={styles.descText}>
                    {selectedBook.description ||
                      'Chưa có thông tin mô tả cho cuốn sách này.'}
                  </Text>
                </View>
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
    flex: 0,
    maxWidth: 860,
    maxHeight: '90%',
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
  scroll: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  wideBodyRow: {
    flexDirection: 'row',
    padding: 24,
    gap: 28,
    alignItems: 'flex-start',
  },
  imageContainer: {
    width: '100%',
    height: 310,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageContainerWide: {
    width: 280,
    height: 370,
    borderRadius: 16,
    padding: 16,
  },
  coverImage: {
    width: 210,
    height: 280,
    borderRadius: 10,
  },
  coverImageWide: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  contentSection: {
    padding: 20,
  },
  contentSectionWide: {
    flex: 1,
    padding: 0,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
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
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    lineHeight: 30,
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
    borderRadius: 12,
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
    marginTop: 18,
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
    marginTop: 20,
  },
  descHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
  footerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
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
    borderRadius: 12,
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
    borderRadius: 12,
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
