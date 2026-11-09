import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
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

export const StaffOrdersScreen: React.FC = () => {
  const { orders, updateOrderStatus, isLoading, refreshData } = useApp();
  const [activeStatus, setActiveStatus] = useState<string>('Tất cả');

  const statusTabs = [
    'Tất cả',
    'Chờ xác nhận',
    'Đang giao',
    'Hoàn thành',
    'Đã hủy',
  ];

  const filteredOrders = orders.filter((o) => {
    if (activeStatus === 'Tất cả') return true;
    return o.status === activeStatus;
  });

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusStyle = (status: OrderStatus) => {
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

  const handleUpdateStatus = (order: Order, newStatus: OrderStatus) => {
    Alert.alert(
      'Cập nhật trạng thái đơn',
      `Chuyển đơn hàng ${order.id} sang trạng thái "${newStatus}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: () => updateOrderStatus(order.id, newStatus),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quản lý đơn hàng</Text>
      </View>

      {/* Status Filter Scroll */}
      <View style={styles.filterWrapper}>
        <FlatList
          horizontal
          data={statusTabs}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({ item }) => {
            const isActive = activeStatus === item;
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
                onPress={() => setActiveStatus(item)}
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

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="clipboard" size={48} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>Không có đơn hàng nào</Text>
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
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
            const stStyle = getStatusStyle(item.status);

            return (
              <View style={styles.card}>
                {/* Header */}
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.orderId}>{item.id}</Text>
                    <Text style={styles.orderDate}>
                      {formatDate(item.createdAt)}
                    </Text>
                  </View>

                  <View
                    style={[
                      styles.statusPill,
                      {
                        backgroundColor: stStyle.bg,
                        borderColor: stStyle.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusPillText,
                        { color: stStyle.text },
                      ]}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                {/* Customer Information */}
                <View style={styles.customerBox}>
                  <View style={styles.customerRow}>
                    <Feather name="user" size={13} color="#2563EB" />
                    <Text style={styles.customerName}>
                      {item.customerName}
                    </Text>
                    <Text style={styles.customerPhone}>({item.phone})</Text>
                  </View>

                  <View style={styles.customerRow}>
                    <Feather name="map-pin" size={13} color="#64748B" />
                    <Text style={styles.customerAddress} numberOfLines={2}>
                      {item.address}
                    </Text>
                  </View>

                  {item.note ? (
                    <View style={styles.customerRow}>
                      <Feather name="message-square" size={13} color="#F59E0B" />
                      <Text style={styles.customerNote}>
                        Ghi chú: {item.note}
                      </Text>
                    </View>
                  ) : null}

                  <View style={styles.customerRow}>
                    <Ionicons name="card-outline" size={13} color="#64748B" />
                    <Text style={styles.paymentMethod}>
                      Hình thức: {item.paymentMethod}
                    </Text>
                  </View>
                </View>

                {/* Ordered Items Preview */}
                <View style={styles.itemsBox}>
                  <Text style={styles.itemsBoxHeader}>Sản phẩm:</Text>
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
                        <Text style={styles.itemQty}>
                          Số lượng: {prod.quantity} cuốn
                        </Text>
                      </View>
                      <Text style={styles.itemPrice}>
                        {formatPrice(prod.price * prod.quantity)}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Total and Pipeline Buttons */}
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.totalLabel}>Tổng tiền:</Text>
                    <Text style={styles.totalValue}>
                      {formatPrice(item.totalAmount)}
                    </Text>
                  </View>

                  {/* Actions according to status */}
                  <View style={styles.actionButtonGroup}>
                    {item.status === 'Chờ xác nhận' && (
                      <>
                        <TouchableOpacity
                          style={styles.actionApprove}
                          onPress={() =>
                            handleUpdateStatus(item, 'Đang giao')
                          }
                        >
                          <Feather name="truck" size={14} color="#FFFFFF" />
                          <Text style={styles.actionApproveText}>Duyệt & Giao</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.actionReject}
                          onPress={() =>
                            handleUpdateStatus(item, 'Đã hủy')
                          }
                        >
                          <Text style={styles.actionRejectText}>Hủy đơn</Text>
                        </TouchableOpacity>
                      </>
                    )}

                    {item.status === 'Đang xử lý' && (
                      <TouchableOpacity
                        style={styles.actionShipping}
                        onPress={() =>
                          handleUpdateStatus(item, 'Đang giao')
                        }
                      >
                        <Feather name="truck" size={14} color="#FFFFFF" />
                        <Text style={styles.actionShippingText}>Giao hàng</Text>
                      </TouchableOpacity>
                    )}

                    {item.status === 'Đang giao' && (
                      <TouchableOpacity
                        style={styles.actionComplete}
                        onPress={() =>
                          handleUpdateStatus(item, 'Hoàn thành')
                        }
                      >
                        <Feather name="check-circle" size={14} color="#FFFFFF" />
                        <Text style={styles.actionCompleteText}>
                          Hoàn tất
                        </Text>
                      </TouchableOpacity>
                    )}

                    {item.status === 'Hoàn thành' && (
                      <View style={styles.completeTag}>
                        <Feather name="check" size={14} color="#059669" />
                        <Text style={styles.completeTagText}>Đã hoàn tất</Text>
                      </View>
                    )}

                    {item.status === 'Đã hủy' && (
                      <View style={styles.cancelledTag}>
                        <Feather name="x-circle" size={14} color="#DC2626" />
                        <Text style={styles.cancelledTagText}>Đơn đã hủy</Text>
                      </View>
                    )}
                  </View>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  filterWrapper: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
  },
  filterList: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterTabActive: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#3B82F6',
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  filterTabTextActive: {
    color: '#2563EB',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    gap: 14,
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
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
  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '700',
  },
  customerBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    gap: 5,
  },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  customerName: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  customerPhone: {
    fontSize: 12,
    color: '#64748B',
  },
  customerAddress: {
    fontSize: 11,
    color: '#475569',
    flex: 1,
  },
  customerNote: {
    fontSize: 11,
    color: '#D97706',
    fontStyle: 'italic',
    flex: 1,
  },
  paymentMethod: {
    fontSize: 11,
    color: '#64748B',
  },
  itemsBox: {
    marginTop: 10,
    gap: 8,
  },
  itemsBoxHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  itemThumb: {
    width: 32,
    height: 44,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
  },
  itemQty: {
    fontSize: 10,
    color: '#64748B',
  },
  itemPrice: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '900',
    color: '#DC2626',
  },
  actionButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionApprove: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 4,
  },
  actionApproveText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionReject: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
    backgroundColor: '#FEF2F2',
  },
  actionRejectText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  actionShipping: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 4,
  },
  actionShippingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  actionComplete: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#047857',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
    gap: 4,
  },
  actionCompleteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  completeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  completeTagText: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '700',
  },
  cancelledTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  cancelledTagText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 12,
  },
});

