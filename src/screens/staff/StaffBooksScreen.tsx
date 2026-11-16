import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
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
import {
  confirmDialog,
  MAX_CONTENT_WIDTH,
  useResponsive,
} from '../../utils/responsive';

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

  const { isDesktop, horizontalPadding, contentWidth } = useResponsive();
  const numColumns = isDesktop ? 2 : 1;
  const cardGap = 14;
  const rowWidth =
    numColumns === 2
      ? (contentWidth - horizontalPadding * 2 - cardGap) / 2
      : undefined;

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const handleDelete = (book: Book) => {
    confirmDialog(
      'Xóa sách khỏi kho',
      `Bạn có chắc chắn muốn xóa cuốn sách "${book.title}" khỏi hệ thống?`,
      () => deleteBook(book.id),
      'Xóa ngay',
      true
    );
  };

  return (
    <View style={styles.container}>
      {/* Search & Add New Row */}
      <View style={styles.topActionsWrapper}>
        <View
          style={[
            styles.topActions,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          <View style={styles.searchBar}>
            <Feather name="search" size={16} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm sách trong kho theo tên, tác giả..."
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
            <Text style={styles.addBookBtnText}>Thêm sách mới</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter Chips */}
      <CategoryChips />

      {/* Books List Header */}
      <View style={styles.listHeaderWrapper}>
        <View
          style={[
            styles.listHeader,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          <Text style={styles.listCount}>
            Danh mục kho sách ({filteredBooks.length} đầu sách)
          </Text>
        </View>
      </View>

      {/* Inventory List */}
      {isLoading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : filteredBooks.length === 0 ? (
        <View style={styles.centerBox}>
          <Feather name="book-open" size={48} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>Không tìm thấy sách trong kho</Text>
          <TouchableOpacity
            style={styles.emptyAddBtn}
            onPress={() => openBookForm()}
          >
            <Text style={styles.emptyAddBtnText}>Thêm sách mới</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={`staff-books-${numColumns}`}
          columnWrapperStyle={
            numColumns > 1
              ? {
                  gap: cardGap,
                  paddingHorizontal: horizontalPadding,
                  maxWidth: MAX_CONTENT_WIDTH,
                  width: '100%',
                  alignSelf: 'center',
                }
              : undefined
          }
          contentContainerStyle={[
            styles.listContent,
            numColumns === 1 && { paddingHorizontal: horizontalPadding },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshData}
              colors={['#2563EB']}
            />
          }
          renderItem={({ item }) => {
            const stockColor =
              item.stock <= 0
                ? '#EF4444'
                : item.stock <= 5
                ? '#F59E0B'
                : '#10B981';

            return (
              <View
                style={[
                  styles.bookRow,
                  rowWidth ? { width: rowWidth } : undefined,
                ]}
              >
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
                        {item.stock > 0 ? `Tồn kho: ${item.stock}` : 'Hết hàng'}
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
  topActionsWrapper: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 6,
  },
  topActions: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
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
    paddingHorizontal: 14,
    height: 42,
    borderRadius: 10,
    gap: 6,
  },
  addBookBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  listHeaderWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  listHeader: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  listCount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  listContent: {
    paddingTop: 16,
    gap: 12,
    paddingBottom: 100,
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  bookRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 14,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 1,
  },
  thumb: {
    width: 66,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  info: {
    flex: 1,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    lineHeight: 19,
  },
  author: {
    fontSize: 12,
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  catText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  stockText: {
    fontSize: 11,
    fontWeight: '700',
  },
  price: {
    fontSize: 15,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 6,
  },
  actions: {
    gap: 8,
    alignItems: 'center',
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
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
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
    marginTop: 12,
  },
  emptyAddBtn: {
    marginTop: 14,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  emptyAddBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
