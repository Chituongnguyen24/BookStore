import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../context/AppContext';

export const StaffDashboardScreen: React.FC = () => {
  const {
    books,
    orders,
    setStaffTab,
    openBookForm,
    openMockApiModal,
    updateOrderStatus,
    isLoading,
    refreshData,
  } = useApp();

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('vi-VN').format(val) + ' đ';
  };

  // KPIs - Doanh thu chỉ tính đơn Hoàn tất
  const totalRevenue = orders
    .filter((o) => o.status === 'Hoàn thành')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrders = orders.filter((o) => o.status === 'Chờ xác nhận');
  const lowStockBooks = books.filter((b) => b.stock <= 5);
  const totalStockCount = books.reduce((sum, b) => sum + b.stock, 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshData}
          colors={['#2563EB']}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Title */}
      <View style={styles.titleSection}>
        <Text style={styles.dashboardTitle}>Bảng điều khiển</Text>
      </View>

      {/* KPI Cards Grid */}
      <View style={styles.kpiGrid}>
        {/* Doanh thu */}
        <View style={[styles.kpiCard, { borderLeftColor: '#10B981' }]}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Ước tính doanh thu</Text>
            <View style={[styles.kpiIconBox, { backgroundColor: '#ECFDF5' }]}>
              <MaterialCommunityIcons
                name="currency-usd"
                size={20}
                color="#059669"
              />
            </View>
          </View>
          <Text style={styles.kpiValue}>{formatPrice(totalRevenue)}</Text>
        </View>

        {/* Đơn chờ duyệt */}
        <TouchableOpacity
          style={[styles.kpiCard, { borderLeftColor: '#F59E0B' }]}
          onPress={() => setStaffTab('orders')}
        >
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Đơn chờ xác nhận</Text>
            <View style={[styles.kpiIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Feather name="clock" size={18} color="#D97706" />
            </View>
          </View>
          <Text style={[styles.kpiValue, { color: '#D97706' }]}>
            {pendingOrders.length} đơn
          </Text>
        </TouchableOpacity>

        {/* Tổng đầu sách */}
        <TouchableOpacity
          style={[styles.kpiCard, { borderLeftColor: '#2563EB' }]}
          onPress={() => setStaffTab('books')}
        >
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Tổng đầu sách</Text>
            <View style={[styles.kpiIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="book" size={18} color="#2563EB" />
            </View>
          </View>
          <Text style={styles.kpiValue}>{books.length} sách</Text>
        </TouchableOpacity>

        {/* Cảnh báo kho */}
        <View style={[styles.kpiCard, { borderLeftColor: '#EF4444' }]}>
          <View style={styles.kpiHeader}>
            <Text style={styles.kpiLabel}>Sắp hết hàng</Text>
            <View style={[styles.kpiIconBox, { backgroundColor: '#FEF2F2' }]}>
              <Feather name="alert-triangle" size={18} color="#DC2626" />
            </View>
          </View>
          <Text style={[styles.kpiValue, { color: '#DC2626' }]}>
            {lowStockBooks.length} cuốn
          </Text>
        </View>
      </View>

      {/* Quick Action Buttons */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionHeader}>Thao tác nhanh</Text>
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => openBookForm()}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <Feather name="plus-circle" size={20} color="#2563EB" />
            </View>
            <Text style={styles.actionButtonText}>Thêm sách mới</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => setStaffTab('orders')}
          >
            <View style={[styles.actionIconBox, { backgroundColor: '#FEF3C7' }]}>
              <Feather name="clipboard" size={20} color="#D97706" />
            </View>
            <Text style={styles.actionButtonText}>Xử lý đơn hàng</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pending Orders Waiting for Approval */}
      <View style={styles.pendingOrdersSection}>
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionHeader}>
            Đơn hàng cần xử lý ({pendingOrders.length})
          </Text>
          <TouchableOpacity onPress={() => setStaffTab('orders')}>
            <Text style={styles.viewAllText}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        {pendingOrders.length === 0 ? (
          <View style={styles.emptyPendingBox}>
            <Feather name="check-circle" size={32} color="#10B981" />
            <Text style={styles.emptyPendingText}>
              Không có đơn hàng chờ xác nhận
            </Text>
          </View>
        ) : (
          pendingOrders.slice(0, 3).map((order) => (
            <View key={order.id} style={styles.pendingCard}>
              <View style={styles.pendingHeader}>
                <View>
                  <Text style={styles.orderId}>{order.id}</Text>
                  <Text style={styles.customerName}>
                    {order.customerName} - {order.phone}
                  </Text>
                </View>
                <Text style={styles.orderTotal}>
                  {formatPrice(order.totalAmount)}
                </Text>
              </View>

              <Text style={styles.pendingAddress} numberOfLines={1}>
                📍 {order.address}
              </Text>

              <View style={styles.pendingItemsPreview}>
                <Text style={styles.previewCount}>
                  {order.items.length} món sách:
                </Text>
                <Text style={styles.previewNames} numberOfLines={1}>
                  {order.items.map((i) => `${i.title} (${i.quantity})`).join(', ')}
                </Text>
              </View>

              <View style={styles.pendingActions}>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => updateOrderStatus(order.id, 'Đang giao')}
                >
                  <Feather name="truck" size={14} color="#FFFFFF" />
                  <Text style={styles.approveBtnText}>Duyệt & Giao</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => updateOrderStatus(order.id, 'Đã hủy')}
                >
                  <Text style={styles.rejectBtnText}>Hủy đơn</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Low Stock Warning List */}
      {lowStockBooks.length > 0 && (
        <View style={styles.lowStockSection}>
          <Text style={styles.sectionHeader}>
            Cảnh báo sắp hết hàng ({lowStockBooks.length})
          </Text>
          <FlatList
            horizontal
            data={lowStockBooks}
            keyExtractor={(item) => item.id}
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.lowStockList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.lowStockCard}
                onPress={() => openBookForm(item)}
              >
                <Text style={styles.lowStockTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.lowStockAuthor}>{item.author}</Text>
                <View style={styles.lowStockCountRow}>
                  <Text style={styles.lowStockAlert}>
                    Còn: {item.stock} cuốn
                  </Text>
                  <Text style={styles.restockPrompt}>Nhập thêm</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
    gap: 16,
  },
  titleSection: {
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  dashboardSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  kpiCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  kpiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  kpiLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
    flex: 1,
  },
  kpiIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kpiValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  kpiNote: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
  quickActionsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionHeader: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  viewAllText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  actionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  pendingOrdersSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  emptyPendingBox: {
    alignItems: 'center',
    padding: 20,
    gap: 8,
  },
  emptyPendingText: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '600',
    textAlign: 'center',
  },
  pendingCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  pendingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  customerName: {
    fontSize: 12,
    color: '#475569',
    marginTop: 1,
  },
  orderTotal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#DC2626',
  },
  pendingAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 6,
  },
  pendingItemsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    backgroundColor: '#FFFFFF',
    padding: 6,
    borderRadius: 6,
  },
  previewCount: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  previewNames: {
    fontSize: 11,
    color: '#64748B',
    flex: 1,
  },
  pendingActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 10,
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  approveBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  rejectBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FCA5A5',
    backgroundColor: '#FEF2F2',
  },
  rejectBtnText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '600',
  },
  lowStockSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lowStockList: {
    gap: 10,
  },
  lowStockCard: {
    width: 150,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 8,
    padding: 10,
  },
  lowStockTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  lowStockAuthor: {
    fontSize: 10,
    color: '#7F1D1D',
    marginTop: 2,
  },
  lowStockCountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  lowStockAlert: {
    fontSize: 11,
    fontWeight: '800',
    color: '#DC2626',
  },
  restockPrompt: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '700',
  },
});

