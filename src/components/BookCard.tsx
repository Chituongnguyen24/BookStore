import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const { role, addToCart, openBookDetail, openBookForm, deleteBook } = useApp();
  const [imageError, setImageError] = useState(false);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const handleDelete = () => {
    Alert.alert(
      'Xóa sách',
      `Bạn có chắc chắn muốn xóa "${book.title}" khỏi danh mục?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa ngay',
          style: 'destructive',
          onPress: () => deleteBook(book.id),
        },
      ]
    );
  };

  return (
    <Pressable
      style={styles.card}
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

        {/* Low stock or Out of stock badge */}
        {book.stock <= 0 ? (
          <View style={[styles.stockBadge, styles.stockBadgeOut]}>
            <Text style={styles.stockTextOut}>Hết hàng</Text>
          </View>
        ) : book.stock <= 5 ? (
          <View style={[styles.stockBadge, styles.stockBadgeLow]}>
            <Text style={styles.stockTextLow}>Chỉ còn {book.stock}</Text>
          </View>
        ) : null}
      </View>

      {/* Info Container */}
      <View style={styles.infoWrapper}>
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

        {/* Price & Action */}
        <View style={styles.priceRow}>
          <View>
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
              onPress={() => addToCart(book, 1)}
              hitSlop={6}
            >
              <Feather name="plus" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.staffActionGroup}>
              <TouchableOpacity
                style={styles.staffEditBtn}
                onPress={() => openBookForm(book)}
                hitSlop={4}
              >
                <Feather name="edit-2" size={13} color="#2563EB" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.staffDeleteBtn}
                onPress={handleDelete}
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
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  imageWrapper: {
    width: '100%',
    aspectRatio: 0.85,
    backgroundColor: '#F1F5F9',
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  categoryBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  stockBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockBadgeOut: {
    backgroundColor: '#EF4444',
  },
  stockBadgeLow: {
    backgroundColor: '#F59E0B',
  },
  stockTextOut: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  stockTextLow: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  infoWrapper: {
    padding: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 18,
    minHeight: 36,
  },
  author: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  stockLabel: {
    fontSize: 10,
    color: '#94A3B8',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F8FAFC',
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
  },
  originalPrice: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
    marginTop: 1,
  },
  addCartBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    gap: 4,
  },
  staffEditBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  staffDeleteBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

