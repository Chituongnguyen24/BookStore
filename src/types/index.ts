export type UserRole = 'customer' | 'staff';

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  price: number;
  originalPrice?: number;
  stock: number;
  rating?: number;
  reviewsCount?: number;
  coverImage?: string;
  description?: string;
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export type OrderStatus =
  | 'Chờ xác nhận'
  | 'Đang xử lý'
  | 'Đang giao'
  | 'Hoàn thành'
  | 'Đã hủy';

export type PaymentMethod = 'COD' | 'Chuyển khoản' | 'Ví MoMo';

export interface OrderItem {
  bookId: string;
  title: string;
  author: string;
  price: number;
  quantity: number;
  coverImage?: string;
}

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export type CustomerTab = 'home' | 'orders' | 'account';
export type StaffTab = 'dashboard' | 'books' | 'orders';

