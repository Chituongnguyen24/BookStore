import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { BookCard } from '../../components/BookCard';
import { CategoryChips } from '../../components/CategoryChips';
import { useApp } from '../../context/AppContext';

export const CustomerHomeScreen: React.FC = () => {
  const {
    filteredBooks,
    books,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    openBookDetail,
    isLoading,
    refreshData,
  } = useApp();

  const sortOptions = [
    { key: 'default', label: 'Phổ biến' },
    { key: 'price-asc', label: 'Giá thấp' },
    { key: 'price-desc', label: 'Giá cao' },
    { key: 'rating', label: 'Đánh giá' },
  ];

  const featuredBooks = books.slice(0, 4);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const renderHeader = () => (
    <View>
      {/* Search Input Bar */}
      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Feather name="search" size={18} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm sách, tác giả..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Chips */}
      <CategoryChips />

      {/* Bestsellers Section (when not searching and on All categories) */}
      {!searchQuery && selectedCategory === 'Tất cả' && featuredBooks.length > 0 && (
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Sách nổi bật</Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
          >
            {featuredBooks.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.featuredCard}
                onPress={() => openBookDetail(item)}
                activeOpacity={0.8}
              >
                <Image
                  source={
                    item.coverImage
                      ? { uri: item.coverImage }
                      : require('../../../assets/BookCover.jpg')
                  }
                  style={styles.featuredCover}
                  resizeMode="cover"
                />
                <View style={styles.featuredBadge}>
                  <FontAwesome name="star" size={10} color="#F59E0B" />
                  <Text style={styles.featuredBadgeText}>
                    {item.rating || '5.0'}
                  </Text>
                </View>
                <Text style={styles.featuredTitle} numberOfLines={2}>
                  {item.title}
                </Text>
                <Text style={styles.featuredPrice}>
                  {formatPrice(item.price)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Main Catalog Header & Sort Options */}
      <View style={styles.catalogHeader}>
        <Text style={styles.sectionTitle}>
          {searchQuery
            ? `Kết quả (${filteredBooks.length})`
            : selectedCategory !== 'Tất cả'
            ? `${selectedCategory} (${filteredBooks.length})`
            : `Tất cả (${filteredBooks.length})`}
        </Text>

        <View style={styles.sortChips}>
          {sortOptions.map((opt) => (
            <TouchableOpacity
              key={opt.key}
              style={[
                styles.sortChip,
                sortBy === opt.key && styles.sortChipActive,
              ]}
              onPress={() => setSortBy(opt.key)}
            >
              <Text
                style={[
                  styles.sortChipText,
                  sortBy === opt.key && styles.sortChipTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2563EB" />
        </View>
      ) : filteredBooks.length === 0 ? (
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshData}
              colors={['#2563EB']}
            />
          }
        >
          {renderHeader()}
          <View style={styles.emptyContainer}>
            <Feather name="book" size={48} color="#CBD5E1" />
            <Text style={styles.emptyTitle}>Không tìm thấy sách</Text>
            <TouchableOpacity
              style={styles.resetFilterBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('Tất cả');
              }}
            >
              <Text style={styles.resetFilterText}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => <BookCard book={item} />}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={refreshData}
              colors={['#2563EB']}
            />
          }
          showsVerticalScrollIndicator={false}
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
  searchWrapper: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
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
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  featuredSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    marginTop: 6,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeaderRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  featuredList: {
    paddingHorizontal: 16,
    gap: 10,
  },
  featuredCard: {
    width: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    position: 'relative',
  },
  featuredCover: {
    width: '100%',
    height: 140,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  featuredTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 6,
    lineHeight: 15,
    height: 30,
  },
  featuredPrice: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 4,
  },
  catalogHeader: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#F8FAFC',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sortChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  sortChipText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  sortChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 100,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 10,
  },
  resetFilterBtn: {
    marginTop: 14,
    backgroundColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  resetFilterText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
