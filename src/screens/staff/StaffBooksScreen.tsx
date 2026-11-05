import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { CategoryChips } from '../../components/CategoryChips';
import { useApp } from '../../context/AppContext';
import { Book } from '../../types';

export const StaffBooksScreen: React.FC = () => {
  const {
    filteredBooks,
    searchQuery,
    setSearchQuery,
    openBookForm,
    deleteBook,
    isLoading,
    refreshData,
  } = useApp();

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const handleDelete = (book: Book) => {
    Alert.alert(
      'Xóa sách khỏi kho',
      `Bạn có chắc chắn muốn xóa cuốn sách "${book.title}" khỏi hệ thống?`,
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
    <View style={styles.container}>
      {/* Search & Add New Row */}
      <View style={styles.topActions}>
        <View style={styles.searchBar}>
          <Feather name="search" size={16} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm theo tên, tác giả..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={6}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.addBookBtn}
          onPress={() => openBookForm()}
        >
          <Feather name="plus" size={18} color="#FFFFFF" />
          <Text style={styles.addBookBtnText}>Thêm sách</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Chips */}
      <CategoryChips />

      {/* Books List Header */}
      <View style={styles.listHeader}>
        <Text style={styles.listCount}>
          Kho sách ({filteredBooks.length})
        </Text>
      </View>

      {/* Inventory List */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : filteredBooks.length === 0 ? (
        <View style={styles.centerBox}>
          <Feather name="book-open" size={48} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>Không có sách</Text>
          <TouchableOpacity
            style={styles.emptyAddBtn}
            onPress={() => openBookForm()}
          >
            <Text style={styles.emptyAddBtnText}>Thêm sách</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshData}
              colors={['#2563EB']}
            />
          }
          renderItem={({ item }) => {
            const stockColor =
              item.stock <= 0 ? '#EF4444' : item.stock <= 5 ? '#F59E0B' : '#10B981';

            return (
              <View style={styles.bookRow}>
                {/* Thumbnail */}
                <Image
                  source={
                    item.coverImage
                      ? { uri: item.coverImage }
                      : require('../../../assets/BookCover.jpg')
                  }
                  style={styles.thumb}
                  resizeMode="cover"
                />

                {/* Details */}
                <View style={styles.info}>
                  <Text style={styles.title} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <Text style={styles.author}>{item.author}</Text>

                  <View style={styles.tagRow}>
                    <View style={styles.catBadge}>
                      <Text style={styles.catText}>{item.category}</Text>
                    </View>
                    <View
                      style={[
                        styles.stockBadge,
                        { backgroundColor: stockColor + '18' },
                      ]}
                    >
                      <Text style={[styles.stockText, { color: stockColor }]}>
                        {item.stock > 0 ? `Kho: ${item.stock}` : 'Hết hàng'}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.price}>{formatPrice(item.price)}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.editBtn}
                    onPress={() => openBookForm(item)}
                    hitSlop={6}
                  >
                    <Feather name="edit-2" size={16} color="#2563EB" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(item)}
                    hitSlop={6}
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  topActions: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
    gap: 10,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 40,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  addBookBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 8,
    gap: 4,
  },
  addBookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  listCount: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  listContent: {
    padding: 16,
    gap: 10,
    paddingBottom: 100,
  },
  bookRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 12,
  },
  thumb: {
    width: 60,
    height: 80,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 18,
  },
  author: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  catBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  catText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  stockBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 10,
    fontWeight: '700',
  },
  price: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 4,
  },
  actions: {
    gap: 8,
    alignItems: 'center',
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 13,
    color: '#64748B',
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
  },
  emptyAddBtn: {
    marginTop: 14,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

