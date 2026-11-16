import { Feather } from '@expo/vector-icons';
import React from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import {
  confirmDialog,
  MAX_CONTENT_WIDTH,
  useResponsive,
} from '../../utils/responsive';

const formatPrice = (val: number) =>
  new Intl.NumberFormat('vi-VN').format(val) + ' đ';

export const StaffDashboardScreen: React.FC = () => {
  const {
    books,
    orders,
    setStaffTab,
    openBookForm,
    updateOrderStatus,
    isLoading,
    refreshData,
  } = useApp();
  const { isDesktop, horizontalPadding } = useResponsive();

  // Business rules: doanh thu chỉ tính đơn Hoàn thành, sắp hết = tồn ≤ 5
  const completedOrders = orders.filter((o) => o.status === 'Hoàn thành');
  const revenue = completedOrders.reduce((sum, o) => sum + o.totalAmount, 0);
  const pendingOrders = orders.filter((o) => o.status === 'Chờ xác nhận');
  const lowStockBooks = books
    .filter((b) => b.stock <= 5)
    .sort((a, b) => a.stock - b.stock);

  const stats = [
    {
      label: 'Doanh thu',
      value: formatPrice(revenue),
      icon: 'dollar-sign',
      color: '#059669',
      bg: '#ECFDF5',
      onPress: undefined,
    },
    {
      label: 'Đơn chờ xác nhận',
      value: String(pendingOrders.length),
      icon: 'clock',
      color: '#D97706',
      bg: '#FEF3C7',
      onPress: () => setStaffTab('orders'),
    },
    {
      label: 'Tổng đầu sách',
      value: String(books.length),
      icon: 'book',
      color: '#2563EB',
      bg: '#EFF6FF',
      onPress: () => setStaffTab('books'),
    },
    {
      label: 'Sách sắp hết',
      value: String(lowStockBooks.length),
      icon: 'alert-triangle',
      color: '#DC2626',
      bg: '#FEF2F2',
      onPress: () => setStaffTab('books'),
    },
  ];

  const handleApprove = (id: string) =>
    confirmDialog('Duyệt đơn', `Chuyển đơn ${id} sang "Đang giao"?`, () =>
      updateOrderStatus(id, 'Đang giao')
    );

  const handleCancel = (id: string) =>
    confirmDialog(
      'Hủy đơn',
      `Hủy đơn ${id}? Sách sẽ được hoàn lại kho.`,
      () => updateOrderStatus(id, 'Đã hủy'),
      'Hủy đơn',
      true
    );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        { paddingHorizontal: horizontalPadding },
      ]}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={refreshData}
          colors={['#2563EB']}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.wrapper}>
        <Text style={styles.pageTitle}>Tổng quan</Text>

        {/* 4 chỉ số chính */}
        <View style={styles.statsGrid}>
          {stats.map((s) => (
            <TouchableOpacity
              key={s.label}
              style={[styles.statCard, { width: isDesktop ? '23.5%' : '48.5%' }]}
              onPress={s.onPress}
              disabled={!s.onPress}
              activeOpacity={0.7}
            >
              <View style={[styles.statIcon, { backgroundColor: s.bg }]}>
                <Feather name={s.icon as any} size={18} color={s.color} />
              </View>
              <Text style={styles.statValue} numberOfLines={1}>
                {s.value}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={isDesktop ? styles.twoCols : styles.oneCol}>
          {/* Đơn chờ xác nhận */}
          <View style={[styles.panel, isDesktop && { flex: 1 }]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Đơn chờ xác nhận</Text>
              <TouchableOpacity onPress={() => setStaffTab('orders')}>
                <Text style={styles.link}>Xem tất cả</Text>
              </TouchableOpacity>
            </View>

            {pendingOrders.length === 0 ? (
              <Text style={styles.empty}>Không có đơn nào cần xử lý</Text>
            ) : (
              pendingOrders.slice(0, 5).map((order, idx) => (
                <View
                  key={order.id}
                  style={[styles.row, idx > 0 && styles.rowBorder]}
                >
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {order.customerName}
                    </Text>
                    <Text style={styles.rowSub}>
                      {order.items.length} sản phẩm ·{' '}
                      {formatPrice(order.totalAmount)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={() => handleApprove(order.id)}
                  >
                    <Text style={styles.btnPrimaryText}>Duyệt</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnGhost}
                    onPress={() => handleCancel(order.id)}
                  >
                    <Text style={styles.btnGhostText}>Hủy</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Sách sắp hết */}
          <View style={[styles.panel, isDesktop && { flex: 1 }]}>
            <View style={styles.panelHeader}>
              <Text style={styles.panelTitle}>Sách sắp hết hàng</Text>
              <TouchableOpacity onPress={() => setStaffTab('books')}>
                <Text style={styles.link}>Kho sách</Text>
              </TouchableOpacity>
            </View>

            {lowStockBooks.length === 0 ? (
              <Text style={styles.empty}>Tồn kho đang ổn định</Text>
            ) : (
              lowStockBooks.slice(0, 5).map((book, idx) => (
                <TouchableOpacity
                  key={book.id}
                  style={[styles.row, idx > 0 && styles.rowBorder]}
                  onPress={() => openBookForm(book)}
                >
                  <View style={styles.rowMain}>
                    <Text style={styles.rowTitle} numberOfLines={1}>
                      {book.title}
                    </Text>
                    <Text style={styles.rowSub} numberOfLines={1}>
                      {book.author}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.stockPill,
                      book.stock <= 0 && styles.stockPillOut,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stockPillText,
                        book.stock <= 0 && styles.stockPillTextOut,
                      ]}
                    >
                      {book.stock <= 0 ? 'Hết hàng' : `Còn ${book.stock}`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    paddingTop: 20,
    paddingBottom: 100,
  },
  wrapper: {
    width: '100%',
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: 'center',
    gap: 16,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 12,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  twoCols: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'flex-start',
  },
  oneCol: {
    gap: 16,
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingBottom: 4,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  panelTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  link: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2563EB',
  },
  empty: {
    fontSize: 13,
    color: '#94A3B8',
    textAlign: 'center',
    paddingVertical: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  rowMain: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
  },
  rowSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  btnPrimary: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  btnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  btnGhost: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  btnGhostText: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
  },
  stockPill: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  stockPillOut: {
    backgroundColor: '#FEF2F2',
  },
  stockPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  stockPillTextOut: {
    color: '#DC2626',
  },
});
