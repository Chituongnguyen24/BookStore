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
import { MAX_CONTENT_WIDTH, useResponsive } from '../../utils/responsive';

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

  const {
    isWide,
    isDesktop,
    bookGridColumns,
    horizontalPadding,
    gridGap,
  } = useResponsive();

  const sortOptions = [
    { key: 'default', label: 'Phổ biến' },
    { key: 'price-asc', label: 'Giá thấp' },
    { key: 'price-desc', label: 'Giá cao' },
    { key: 'rating', label: 'Đánh giá' },
  ];

  const featuredBooks = books.slice(0, 6);

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const renderHeader = () => (
    <View>
      {/* Top Search & Hero Section */}
      <View style={styles.heroBackground}>
        <View
          style={[
            styles.centeredBlock,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          {/* Promo Banner on Wide Screen or Clean Banner on Mobile */}
          <View style={[styles.promoBanner, isWide && styles.promoBannerWide]}>
            <View style={styles.promoTextCol}>
              <View style={styles.promoTag}>
                <Feather name="zap" size={12} color="#2563EB" />
                <Text style={styles.promoTagText}>ƯU ĐÃI ĐẶC BIỆT</Text>
              </View>
              <Text
                style={[styles.promoTitle, isDesktop && styles.promoTitleLarge]}
              >
                Khám phá kho tàng tri thức chọn lọc
              </Text>
              <Text style={styles.promoSubtitle}>
                Miễn phí vận chuyển toàn quốc cho mọi đơn hàng từ 200.000đ
              </Text>
            </View>

            {/* Search Input Bar */}
            <View style={[styles.searchBar, isWide && styles.searchBarWide]}>
              <Feather name="search" size={18} color="#64748B" />
              <TextInput
                style={styles.searchInput}
                placeholder="Tìm kiếm tựa sách, tác giả..."
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
        </View>
      </View>

      {/* Category Chips */}
      <CategoryChips />

      {/* Bestsellers Section */}
      {!searchQuery &&
        selectedCategory === 'Tất cả' &&
        featuredBooks.length > 0 && (
          <View style={styles.featuredSection}>
            <View
              style={[
                styles.centeredBlock,
                { paddingHorizontal: horizontalPadding },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <View style={styles.sectionTitleGroup}>
                  <View style={styles.sectionAccent} />
                  <Text style={styles.sectionTitle}>Sách nổi bật</Text>
                </View>
                <Text style={styles.sectionHint}>Được yêu thích nhất</Text>
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.featuredList}
              >
                {featuredBooks.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.featuredCard,
                      isWide && styles.featuredCardWide,
                    ]}
                    onPress={() => openBookDetail(item)}
                    activeOpacity={0.85}
                  >
                    <View style={styles.featuredCoverBox}>
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
                          {item.rating ? item.rating.toFixed(1) : '5.0'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.featuredTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <Text style={styles.featuredAuthor} numberOfLines={1}>
                      {item.author}
                    </Text>
                    <Text style={styles.featuredPrice}>
                      {formatPrice(item.price)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}

      {/* Main Catalog Header & Sort Options */}
      <View
        style={[
          styles.centeredBlock,
          styles.catalogHeader,
          { paddingHorizontal: horizontalPadding },
        ]}
      >
        <View style={styles.sectionTitleGroup}>
          <View style={styles.sectionAccent} />
          <Text style={styles.sectionTitle}>
            {searchQuery
              ? `Kết quả (${filteredBooks.length})`
              : selectedCategory !== 'Tất cả'
              ? `${selectedCategory} (${filteredBooks.length})`
              : `Tất cả sách (${filteredBooks.length})`}
          </Text>
        </View>

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
            <Text style={styles.emptyTitle}>
              Không tìm thấy cuốn sách phù hợp
            </Text>
            <TouchableOpacity
              style={styles.resetFilterBtn}
              onPress={() => {
                setSearchQuery('');
                setSelectedCategory('Tất cả');
              }}
            >
              <Text style={styles.resetFilterText}>Xem tất cả sách</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : (
        <FlatList
          data={filteredBooks}
          keyExtractor={(item) => item.id}
          numColumns={bookGridColumns}
          key={`grid-${bookGridColumns}`}
          columnWrapperStyle={
            bookGridColumns > 1
              ? {
                  gap: gridGap,
                  paddingHorizontal: horizontalPadding,
                  maxWidth: MAX_CONTENT_WIDTH,
                  width: '100%',
                  alignSelf: 'center',
                }
              : undefined
          }
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
  centeredBlock: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  heroBackground: {
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 8,
  },
  promoBanner: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DBEAFE',
    gap: 12,
  },
  promoBannerWide: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 22,
    gap: 24,
  },
  promoTextCol: {
    flex: 1,
    gap: 4,
  },
  promoTag: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
    marginBottom: 2,
  },
  promoTagText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  promoTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  promoTitleLarge: {
    fontSize: 22,
  },
  promoSubtitle: {
    fontSize: 13,
    color: '#475569',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 46,
    gap: 10,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  searchBarWide: {
    width: 380,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionAccent: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: '#2563EB',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionHint: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  featuredSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  featuredList: {
    gap: 12,
    paddingRight: 8,
  },
  featuredCard: {
    width: 140,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featuredCardWide: {
    width: 175,
    padding: 12,
  },
  featuredCoverBox: {
    width: '100%',
    aspectRatio: 0.8,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    position: 'relative',
  },
  featuredCover: {
    width: '100%',
    height: '100%',
  },
  featuredBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  featuredBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  featuredTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
    lineHeight: 17,
    minHeight: 34,
  },
  featuredAuthor: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  featuredPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
    marginTop: 6,
  },
  catalogHeader: {
    paddingTop: 18,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  sortChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortChip: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sortChipActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#2563EB',
  },
  sortChipText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  sortChipTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  listContent: {
    paddingBottom: 100,
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
    padding: 48,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 12,
  },
  resetFilterBtn: {
    marginTop: 14,
    backgroundColor: '#2563EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetFilterText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
