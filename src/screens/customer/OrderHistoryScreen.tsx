import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { Order, OrderStatus } from '../../types';
import {
  confirmDialog,
  MAX_CONTENT_WIDTH,
  useResponsive,
} from '../../utils/responsive';

export const OrderHistoryScreen: React.FC = () => {
  const {
    orders,
    updateOrderStatus,
    isLoading,
    refreshData,
    setCustomerTab,
  } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<string>('Tất cả');
  const { isDesktop, horizontalPadding, contentWidth } = useResponsive();

  const numColumns = isDesktop ? 2 : 1;
  const cardGap = 16;
  const cardWidth =
    numColumns === 2
      ? (contentWidth - horizontalPadding * 2 - cardGap) / 2
      : undefined;

  const filterTabs = [
    'Tất cả',
    'Chờ xác nhận',
    'Đang giao',
    'Hoàn thành',
    'Đã hủy',
  ];

  const filteredOrders = orders.filter((order) => {
    if (selectedStatus === 'Tất cả') return true;
    return order.status === selectedStatus;
  });

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Chờ xác nhận':
        return { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' };
      case 'Đang xử lý':
        return { bg: '#EFF6FF', text: '#1D4ED8', border: '#BFDBFE' };
      case 'Đang giao':
        return { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' };
      case 'Hoàn thành':
        return { bg: '#ECFDF5', text: '#047857', border: '#A7F3D0' };
      case 'Đã hủy':
        return { bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' };
      default:
        return { bg: '#F1F5F9', text: '#475569', border: '#E2E8F0' };
    }
  };

  const handleCancelOrder = (order: Order) => {
    confirmDialog(
      'Hủy đơn hàng',
      `Bạn có chắc chắn muốn hủy đơn hàng ${order.id}?`,
      () => updateOrderStatus(order.id, 'Đã hủy'),
      'Hủy đơn',
      true
    );
  };

  return (
    <View style={styles.container}>
      {/* Title & Filter Tabs */}
      <View style={styles.topSection}>
        <View
          style={[
            styles.centeredBlock,
            { paddingHorizontal: horizontalPadding },
          ]}
        >
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Lịch sử đơn mua</Text>
            <Text style={styles.headerSubtitle}>
              Theo dõi trạng thái và lịch sử các đơn hàng của bạn
            </Text>
          </View>

          <FlatList
            horizontal
            data={filterTabs}
            keyExtractor={(item) => item}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterList}
            renderItem={({ item }) => {
              const isActive = selectedStatus === item;
              const count =
                item === 'Tất cả'
                  ? orders.length
                  : orders.filter((o) => o.status === item).length;

              return (
                <TouchableOpacity
                  style={[
                    styles.filterTab,
                    isActive && styles.filterTabActive,
                  ]}
                  onPress={() => setSelectedStatus(item)}
                >
                  <Text
                    style={[
                      styles.filterTabText,
                      isActive && styles.filterTabTextActive,
                    ]}
                  >
                    {item} ({count})
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="inbox" size={48} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>Chưa có đơn hàng nào</Text>
          <TouchableOpacity
            style={styles.shopNowBtn}
            onPress={() => setCustomerTab('home')}
          >
            <Text style={styles.shopNowText}>Khám phá sách ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          key={`orders-cols-${numColumns}`}
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
            styles.ordersList,
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
            const statusStyle = getStatusColor(item.status);
            return (
              <View
                style={[
                  styles.orderCard,
                  cardWidth ? { width: cardWidth } : undefined,
                ]}
              >
                {/* Order Header */}
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderId}>{item.id}</Text>
                    <Text style={styles.orderDate}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: statusStyle.bg,
                        borderColor: statusStyle.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        { color: statusStyle.text },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* Items in Order */}
                <View style={styles.itemsWrapper}>
                  {item.items.map((prod, idx) => (
                    <View key={idx} style={styles.itemRow}>
                      <Image
                        source={
                          prod.coverImage
                            ? { uri: prod.coverImage }
                            : require('../../../assets/BookCover.jpg')
                        }
                        style={styles.itemThumb}
                        resizeMode="cover"
                      />
                      <View style={styles.itemInfo}>
                        <Text style={styles.itemTitle} numberOfLines={1}>
                          {prod.title}
                        </Text>
                        <Text style={styles.itemAuthor}>{prod.author}</Text>
                        <Text style={styles.itemQtyPrice}>
                          SL: {prod.quantity} x {formatPrice(prod.price)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>

                {/* Recipient Details */}
                <View style={styles.recipientBox}>
                  <View style={styles.recipientRow}>
                    <Feather name="user" size={13} color="#64748B" />
                    <Text style={styles.recipientText}>
                      {item.customerName} - {item.phone}
                    </Text>
                  </View>
                  <View style={styles.recipientRow}>
                    <Feather name="map-pin" size={13} color="#64748B" />
                    <Text style={styles.recipientText} numberOfLines={1}>
                      {item.address}
                    </Text>
                  </View>
                  <View style={styles.recipientRow}>
                    <Ionicons name="card-outline" size={13} color="#64748B" />
                    <Text style={styles.recipientText}>
                      Thanh toán: {item.paymentMethod}
                    </Text>
                  </View>
                </View>

                {/* Footer Total & Actions */}
                <View style={styles.orderFooter}>
                  <View>
                    <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
                    <Text style={styles.totalValue}>
                      {formatPrice(item.totalAmount)}
                    </Text>
                  </View>

                  {item.status === 'Chờ xác nhận' && (
                    <TouchableOpacity
                      style={styles.cancelBtn}
                      onPress={() => handleCancelOrder(item)}
                    >
                      <Text style={styles.cancelBtnText}>Hủy đơn</Text>
                    </TouchableOpacity>
                  )}
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
  topSection: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 12,
  },
  centeredBlock: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  filterList: {
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  ordersList: {
    paddingTop: 16,
    gap: 16,
    paddingBottom: 100,
    maxWidth: MAX_CONTENT_WIDTH,
    width: '100%',
    alignSelf: 'center',
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 16,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    justifyContent: 'space-between',
  },
  orderCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 10,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  orderDate: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
  itemsWrapper: {
    paddingVertical: 12,
    gap: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemThumb: {
    width: 40,
    height: 54,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E293B',
  },
  itemAuthor: {
    fontSize: 11,
    color: '#64748B',
  },
  itemQtyPrice: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
    marginTop: 2,
  },
  recipientBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    gap: 5,
    marginVertical: 4,
  },
  recipientRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  recipientText: {
    fontSize: 12,
    color: '#475569',
    flex: 1,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '900',
    color: '#DC2626',
  },
  cancelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 16,
  },
  shopNowBtn: {
    marginTop: 20,
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  shopNowText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
