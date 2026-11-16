import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Book } from '../types';
import { confirmDialog, useResponsive } from '../utils/responsive';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { role, addToCart, openBookDetail, openBookForm, deleteBook } =
    useApp();
  const [imageError, setImageError] = useState(false);
  const { bookCardWidth } = useResponsive();

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const discountPercent =
    book.originalPrice && book.originalPrice > book.price
      ? Math.round(((book.originalPrice - book.price) / book.originalPrice) * 100)
      : 0;

  const handleDelete = () => {
    confirmDialog(
      'Xóa sách',
      `Bạn có chắc chắn muốn xóa "${book.title}" khỏi danh mục?`,
      () => deleteBook(book.id),
      'Xóa ngay',
      true
    );
  };

  return (
    <Pressable
      style={[styles.card, { width: bookCardWidth }]}
      onPress={() => openBookDetail(book)}
      android_ripple={{ color: '#F1F5F9' }}
    >
      {/* Cover Image */}
      <View style={styles.imageWrapper}>
        <Image
          source={
            !imageError && book.coverImage
              ? { uri: book.coverImage }
              : require('../../assets/BookCover.jpg')
          }
          style={styles.coverImage}
          resizeMode="cover"
          onError={() => setImageError(true)}
        />

        {/* Category Pill */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{book.category}</Text>
        </View>

        {/* Discount or Stock Badge */}
        {book.stock <= 0 ? (
          <View style={[styles.stockBadge, styles.stockBadgeOut]}>
            <Text style={styles.stockTextOut}>Hết hàng</Text>
          </View>
        ) : book.stock <= 5 ? (
          <View style={[styles.stockBadge, styles.stockBadgeLow]}>
            <Text style={styles.stockTextLow}>Còn {book.stock}</Text>
          </View>
        ) : discountPercent > 0 ? (
          <View style={[styles.stockBadge, styles.discountBadge]}>
            <Text style={styles.stockTextOut}>-{discountPercent}%</Text>
          </View>
        ) : null}
      </View>

      {/* Info Container */}
      <View style={styles.infoWrapper}>
        <View>
          <Text style={styles.title} numberOfLines={2}>
            {book.title}
          </Text>

          <Text style={styles.author} numberOfLines={1}>
            {book.author}
          </Text>

          {/* Rating & Stock */}
          <View style={styles.metaRow}>
            <View style={styles.ratingBox}>
              <FontAwesome name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {book.rating ? book.rating.toFixed(1) : '5.0'}
              </Text>
            </View>
            <Text style={styles.stockLabel}>Kho: {book.stock}</Text>
          </View>
        </View>

        {/* Price & Action */}
        <View style={styles.priceRow}>
          <View style={styles.priceCol}>
            <Text style={styles.price}>{formatPrice(book.price)}</Text>
            {book.originalPrice && book.originalPrice > book.price ? (
              <Text style={styles.originalPrice}>
                {formatPrice(book.originalPrice)}
              </Text>
            ) : null}
          </View>

          {/* Action Button based on Role */}
          {role === 'customer' ? (
            <TouchableOpacity
              style={[
                styles.addCartBtn,
                book.stock <= 0 && styles.addCartBtnDisabled,
              ]}
              disabled={book.stock <= 0}
              onPress={(e) => {
                e.stopPropagation?.();
                addToCart(book, 1);
              }}
              hitSlop={6}
            >
              <Feather name="plus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.staffActionGroup}>
              <TouchableOpacity
                style={styles.staffEditBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  openBookForm(book);
                }}
                hitSlop={4}
              >
                <Feather name="edit-2" size={13} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.staffDeleteBtn}
                onPress={(e) => {
                  e.stopPropagation?.();
                  handleDelete();
                }}
                hitSlop={4}
              >
                <Ionicons name="trash-outline" size={14} color="#EF4444" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 16,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 0.8,
    backgroundColor: '#F1F5F9',
    position: 'relative',
    overflow: 'hidden',
  },
  coverImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.78)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  stockBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stockBadgeOut: {
    backgroundColor: '#EF4444',
  },
  stockBadgeLow: {
    backgroundColor: '#F59E0B',
  },
  discountBadge: {
    backgroundColor: '#DC2626',
  },
  stockTextOut: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  stockTextLow: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  infoWrapper: {
    padding: 12,
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
    minHeight: 38,
  },
  author: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  stockLabel: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  priceCol: {
    flex: 1,
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#DC2626',
  },
  originalPrice: {
    fontSize: 11,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  addCartBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addCartBtnDisabled: {
    backgroundColor: '#CBD5E1',
  },
  staffActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  staffEditBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffDeleteBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
