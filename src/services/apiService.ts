import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { Book, Order, OrderStatus } from '../types';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const CATEGORIES = [
  'Tất cả',
  'Văn học',
  'Kinh tế',
  'Tâm lý',
  'Công nghệ',
  'Thiếu nhi',
  'Ngoại ngữ',
];

export const BookApiService = {
  // 1. Lấy danh sách sách
  getBooks: async (): Promise<Book[]> => {
    const res = await apiClient.get<Book[]>('/books');
    return res.data;
  },

  // 2. Thêm sách mới
  createBook: async (bookData: Omit<Book, 'id'>): Promise<Book> => {
    const res = await apiClient.post<Book>('/books', bookData);
    return res.data;
  },

  // 3. Sửa thông tin sách
  updateBook: async (id: string, bookData: Partial<Book>): Promise<Book> => {
    const res = await apiClient.put<Book>(`/books/${id}`, bookData);
    return res.data;
  },

  // 4. Xóa sách
  deleteBook: async (id: string): Promise<void> => {
    await apiClient.delete(`/books/${id}`);
  },

  // 5. Lấy danh sách đơn hàng
  getOrders: async (): Promise<Order[]> => {
    const res = await apiClient.get<Order[]>('/orders');
    return res.data;
  },

  // 6. Tạo đơn hàng mới (tự trừ kho trong SQLite)
  createOrder: async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
    const res = await apiClient.post<Order>('/orders', orderData);
    return res.data;
  },

  // 7. Cập nhật trạng thái đơn (nếu Hủy thì tự hoàn kho)
  updateOrderStatus: async (orderId: string, status: OrderStatus): Promise<Order> => {
    const res = await apiClient.put<Order>(`/orders/${orderId}/status`, { status });
    return res.data;
  },

  // 8. Xác thực mã PIN nhân viên
  verifyStaffPin: async (pin: string): Promise<boolean> => {
    try {
      const res = await apiClient.post('/auth/staff-pin', { pin });
      return res.data && res.data.success;
    } catch {
      return false;
    }
  },

  // 9. Kiểm tra kết nối Backend SQLite
  checkHealth: async (): Promise<boolean> => {
    try {
      const res = await apiClient.get('/health');
      return res.status === 200;
    } catch {
      return false;
    }
  },
};
