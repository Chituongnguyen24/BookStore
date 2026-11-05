import { MOCKAPI_BASE_URL } from '../config/api';
import { Book, Order } from '../types';

export const DEFAULT_MOCKAPI_URL = MOCKAPI_BASE_URL;

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Đắc Nhân Tâm (How to Win Friends and Influence People)',
    author: 'Dale Carnegie',
    category: 'Tâm lý',
    price: 86000,
    originalPrice: 110000,
    stock: 25,
    rating: 4.9,
    reviewsCount: 1420,
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
    description: 'Cuốn sách nổi tiếng nhất thế giới về nghệ thuật đối nhân xử thế, giúp bạn thu phục lòng người và đạt được thành công bền vững trong sự nghiệp và cuộc sống.',
  },
  {
    id: '2',
    title: 'Nhà Giả Kim (The Alchemist)',
    author: 'Paulo Coelho',
    category: 'Văn học',
    price: 79000,
    originalPrice: 99000,
    stock: 18,
    rating: 4.8,
    reviewsCount: 980,
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60',
    description: 'Một câu chuyện ngụ ngôn giàu chất thơ về cậu bé chăn cừu Santiago đi tìm kho báu và sứ mệnh cuộc đời, nhắc nhở chúng ta lắng nghe tiếng gọi trái tim.',
  },
  {
    id: '3',
    title: 'Cha Giàu Cha Nghèo (Rich Dad Poor Dad)',
    author: 'Robert T. Kiyosaki',
    category: 'Kinh tế',
    price: 115000,
    originalPrice: 145000,
    stock: 30,
    rating: 4.7,
    reviewsCount: 850,
    coverImage: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&auto=format&fit=crop&q=60',
    description: 'Cuốn sách tài chính cá nhân kinh điển thay đổi tư duy làm giàu, giúp bạn hiểu rõ sự khác biệt giữa tài sản và tiêu sản để đạt tự do tài chính.',
  },
  {
    id: '4',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin (Uncle Bob)',
    category: 'Công nghệ',
    price: 245000,
    originalPrice: 290000,
    stock: 12,
    rating: 4.9,
    reviewsCount: 420,
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=500&auto=format&fit=crop&q=60',
    description: 'Cẩm nang gối đầu giường cho mọi lập trình viên chuyên nghiệp. Hướng dẫn cách viết code sạch, dễ bảo trì, dễ kiểm thử và chuẩn mực kiến trúc.',
  },
  {
    id: '5',
    title: 'Hoàng Tử Bé (Le Petit Prince)',
    author: 'Antoine de Saint-Exupéry',
    category: 'Thiếu nhi',
    price: 65000,
    originalPrice: 85000,
    stock: 40,
    rating: 4.9,
    reviewsCount: 1200,
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60',
    description: 'Tác phẩm văn học thiếu nhi kinh điển toàn cầu về tình bạn, tình yêu và những giá trị thuần khiết mà người lớn thường vô tình lãng quên.',
  },
  {
    id: '6',
    title: 'Tư Duy Nhanh Và Chậm (Thinking, Fast and Slow)',
    author: 'Daniel Kahneman',
    category: 'Tâm lý',
    price: 168000,
    originalPrice: 210000,
    stock: 15,
    rating: 4.8,
    reviewsCount: 650,
    coverImage: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=500&auto=format&fit=crop&q=60',
    description: 'Khám phá hai hệ thống chi phối cách chúng ta suy nghĩ và đưa ra quyết định từ nhà tâm lý học từng đoạt giải Nobel Kinh tế.',
  },
  {
    id: '7',
    title: 'Tự Học 2000 Từ Vựng Tiếng Anh Giao Tiếp Thông Dụng',
    author: 'Nguyễn Thu Huyền',
    category: 'Ngoại ngữ',
    price: 95000,
    originalPrice: 120000,
    stock: 35,
    rating: 4.6,
    reviewsCount: 510,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=500&auto=format&fit=crop&q=60',
    description: 'Phương pháp ghi nhớ từ vựng tiếng Anh theo ngữ cảnh thực tế, kèm hình ảnh minh họa và phiên âm quốc tế chuẩn.',
  },
  {
    id: '8',
    title: 'Dế Mèn Phiêu Lưu Ký',
    author: 'Tô Hoài',
    category: 'Văn học',
    price: 52000,
    originalPrice: 65000,
    stock: 50,
    rating: 4.9,
    reviewsCount: 1600,
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=500&auto=format&fit=crop&q=60',
    description: 'Kiệt tác văn học thiếu nhi Việt Nam ghi lại cuộc phiêu lưu đầy thú vị cùng những bài học làm người sâu sắc của chú Dế Mèn.',
  },
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-1001',
    customerName: 'Nguyễn Văn An',
    phone: '0912345678',
    address: 'Số 12 Chùa Bộc, Đống Đa, Hà Nội',
    note: 'Giao giờ hành chính giúp em nhé',
    paymentMethod: 'COD',
    items: [
      {
        bookId: '1',
        title: 'Đắc Nhân Tâm',
        author: 'Dale Carnegie',
        price: 86000,
        quantity: 1,
        coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
      },
      {
        bookId: '2',
        title: 'Nhà Giả Kim',
        author: 'Paulo Coelho',
        price: 79000,
        quantity: 1,
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&auto=format&fit=crop&q=60',
      },
    ],
    totalAmount: 165000,
    status: 'Chờ xác nhận',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'ORD-1002',
    customerName: 'Trần Thị Mai',
    phone: '0987654321',
    address: '45 Lê Duẩn, Quận 1, TP. Hồ Chí Minh',
    note: 'Bọc sách cẩn thận',
    paymentMethod: 'Chuyển khoản',
    items: [
      {
        bookId: '4',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        price: 245000,
        quantity: 1,
        coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=500&auto=format&fit=crop&q=60',
      },
    ],
    totalAmount: 245000,
    status: 'Đang giao',
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: 'ORD-1003',
    customerName: 'Lê Hoàng Long',
    phone: '0903334444',
    address: '28 Trần Phú, Hải Châu, Đà Nẵng',
    paymentMethod: 'Ví MoMo',
    items: [
      {
        bookId: '3',
        title: 'Cha Giàu Cha Nghèo',
        author: 'Robert T. Kiyosaki',
        price: 115000,
        quantity: 2,
        coverImage: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=500&auto=format&fit=crop&q=60',
      },
    ],
    totalAmount: 230000,
    status: 'Hoàn thành',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export const CATEGORIES = [
  'Tất cả',
  'Văn học',
  'Kinh tế',
  'Tâm lý',
  'Công nghệ',
  'Thiếu nhi',
  'Ngoại ngữ',
];

// Helper to sanitize base URL
const cleanUrl = (url: string) =>
  url.trim().replace(/\/+$/, '').replace(/\/(books|orders)$/i, '');

// Fetch timeout wrapper
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs = 7000): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, credentials: 'omit', signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    throw err;
  }
};

export const MockApiService = {
  // Check if MockAPI is reachable
  async testConnection(baseUrl: string): Promise<{ success: boolean; message: string }> {
    try {
      const url = `${cleanUrl(baseUrl)}/books`;
      const res = await fetchWithTimeout(url, { method: 'GET' }, 5000);
      if (res.ok) {
        return { success: true, message: 'Kết nối MockAPI thành công!' };
      }
      return { success: false, message: `Máy chủ MockAPI phản hồi mã lỗi: ${res.status}` };
    } catch (err: any) {
      return {
        success: false,
        message: err.name === 'AbortError' ? 'Quá thời gian kết nối (Timeout)' : 'Không thể kết nối tới URL MockAPI.',
      };
    }
  },

  // Books CRUD
  async getBooks(baseUrl?: string): Promise<Book[]> {
    if (!baseUrl) return INITIAL_BOOKS;
    try {
      const res = await fetchWithTimeout(`${cleanUrl(baseUrl)}/books`, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: any) => ({
          ...item,
          price: Number(item.price) || 0,
          originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
          stock: Number(item.stock) || 0,
          rating: Number(item.rating) || 4.5,
        }));
      }
      return INITIAL_BOOKS;
    } catch (error) {
      console.warn('MockAPI getBooks failed, using fallback local books:', error);
      return INITIAL_BOOKS;
    }
  },

  async createBook(baseUrl: string | undefined, book: Omit<Book, 'id'>): Promise<Book> {
    const newBook: Book = {
      ...book,
      id: Date.now().toString(),
      rating: book.rating || 5.0,
      reviewsCount: book.reviewsCount || 0,
    };

    if (!baseUrl) return newBook;

    try {
      const res = await fetchWithTimeout(`${cleanUrl(baseUrl)}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBook),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('MockAPI createBook failed, returning local object:', error);
      return newBook;
    }
  },

  async updateBook(baseUrl: string | undefined, id: string, book: Partial<Book>): Promise<Book> {
    if (!baseUrl) {
      return { id, ...book } as Book;
    }

    try {
      const res = await fetchWithTimeout(`${cleanUrl(baseUrl)}/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('MockAPI updateBook failed:', error);
      return { id, ...book } as Book;
    }
  },

  async deleteBook(baseUrl: string | undefined, id: string): Promise<boolean> {
    if (!baseUrl) return true;

    try {
      const res = await fetchWithTimeout(`${cleanUrl(baseUrl)}/books/${id}`, {
        method: 'DELETE',
      });
      return res.ok;
    } catch (error) {
      console.warn('MockAPI deleteBook failed:', error);
      return true;
    }
  },

  // Orders CRUD
  async getOrders(baseUrl?: string): Promise<Order[]> {
    if (!baseUrl) return INITIAL_ORDERS;
    try {
      const res = await fetchWithTimeout(`${cleanUrl(baseUrl)}/orders`, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
      return INITIAL_ORDERS;
    } catch (error) {
      console.warn('MockAPI getOrders failed, using fallback orders:', error);
      return INITIAL_ORDERS;
    }
  },

  async createOrder(baseUrl: string | undefined, orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };

    if (!baseUrl) return newOrder;

    try {
      const res = await fetchWithTimeout(`${cleanUrl(baseUrl)}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (error) {
      console.warn('MockAPI createOrder failed, returning local order:', error);
      return newOrder;
    }
  },

  async updateOrderStatus(baseUrl: string | undefined, id: string, status: Order['status']): Promise<boolean> {
    if (!baseUrl) return true;

    try {
      const res = await fetchWithTimeout(`${cleanUrl(baseUrl)}/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      return res.ok;
    } catch (error) {
      console.warn('MockAPI updateOrderStatus failed:', error);
      return true;
    }
  },

  // Seed sample books to a fresh MockAPI endpoint
  async seedBooksToMockApi(baseUrl: string, onProgress?: (current: number, total: number) => void): Promise<{ success: boolean; count: number; message: string }> {
    if (!baseUrl) {
      return { success: false, count: 0, message: 'Chưa cấu hình URL MockAPI' };
    }

    try {
      let created = 0;
      for (let i = 0; i < INITIAL_BOOKS.length; i++) {
        const book = INITIAL_BOOKS[i];
        const res = await fetchWithTimeout(`${cleanUrl(baseUrl)}/books`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: book.title,
            author: book.author,
            category: book.category,
            price: book.price,
            originalPrice: book.originalPrice,
            stock: book.stock,
            rating: book.rating,
            reviewsCount: book.reviewsCount,
            coverImage: book.coverImage,
            description: book.description,
          }),
        });
        if (res.ok) created++;
        if (onProgress) onProgress(i + 1, INITIAL_BOOKS.length);
      }

      return {
        success: true,
        count: created,
        message: `Đã nạp thành công ${created}/${INITIAL_BOOKS.length} sách lên MockAPI!`,
      };
    } catch (err: any) {
      return {
        success: false,
        count: 0,
        message: `Lỗi nạp dữ liệu: ${err.message || 'Không thể gửi dữ liệu'}`,
      };
    }
  },
};

