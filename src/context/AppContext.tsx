import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_MOCKAPI_URL, INITIAL_BOOKS, INITIAL_ORDERS, MockApiService } from '../services/mockapi';
import { Book, CartItem, CustomerTab, Order, OrderStatus, StaffTab, UserRole } from '../types';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  customerTab: CustomerTab;
  setCustomerTab: (tab: CustomerTab) => void;
  staffTab: StaffTab;
  setStaffTab: (tab: StaffTab) => void;

  // Books
  books: Book[];
  filteredBooks: Book[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  selectedBook: Book | null;
  openBookDetail: (book: Book) => void;
  closeBookDetail: () => void;
  addBook: (bookData: Omit<Book, 'id'>) => Promise<boolean>;
  updateBook: (id: string, bookData: Partial<Book>) => Promise<boolean>;
  deleteBook: (id: string) => Promise<boolean>;

  // Cart
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateCartQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  // Checkout & Orders
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;

  // Staff Book Modal
  isBookFormOpen: boolean;
  editingBook: Book | null;
  openBookForm: (book?: Book) => void;
  closeBookForm: () => void;

  // MockAPI & Sync
  mockApiUrl: string;
  setMockApiUrl: (url: string) => void;
  isOnline: boolean;
  isLoading: boolean;
  refreshData: () => Promise<void>;
  seedDataToApi: () => Promise<{ success: boolean; message: string }>;
  isMockApiModalOpen: boolean;
  openMockApiModal: () => void;
  closeMockApiModal: () => void;

  // Notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [customerTab, setCustomerTab] = useState<CustomerTab>('home');
  const [staffTab, setStaffTab] = useState<StaffTab>('dashboard');

  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('default');

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [mockApiUrl, setMockApiUrlState] = useState(DEFAULT_MOCKAPI_URL);
  const [isOnline, setIsOnline] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMockApiModalOpen, setIsMockApiModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  const openBookDetail = useCallback((book: Book) => setSelectedBook(book), []);
  const closeBookDetail = useCallback(() => setSelectedBook(null), []);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const openCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  const openBookForm = useCallback((book?: Book) => {
    setEditingBook(book || null);
    setIsBookFormOpen(true);
  }, []);
  const closeBookForm = useCallback(() => {
    setEditingBook(null);
    setIsBookFormOpen(false);
  }, []);

  const openMockApiModal = useCallback(() => setIsMockApiModalOpen(true), []);
  const closeMockApiModal = useCallback(() => setIsMockApiModalOpen(false), []);

  const setMockApiUrl = useCallback((url: string) => {
    setMockApiUrlState(url);
  }, []);

  // Fetch initial books and orders from MockAPI
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedBooks, fetchedOrders] = await Promise.all([
        MockApiService.getBooks(mockApiUrl),
        MockApiService.getOrders(mockApiUrl),
      ]);
      setBooks(fetchedBooks);
      setOrders(fetchedOrders);
      setIsOnline(true);
    } catch {
      setIsOnline(false);
    } finally {
      setIsLoading(false);
    }
  }, [mockApiUrl]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Cart operations
  const addToCart = useCallback((book: Book, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { book, quantity }];
    });
    showToast(`Đã thêm "${book.title.slice(0, 24)}..." vào giỏ`);
  }, [showToast]);

  const removeFromCart = useCallback((bookId: string) => {
    setCart((prev) => prev.filter((item) => item.book.id !== bookId));
    showToast('Đã xóa sách khỏi giỏ hàng');
  }, [showToast]);

  const updateCartQuantity = useCallback((bookId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.book.id !== bookId));
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.book.id === bookId ? { ...item, quantity } : item))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.book.price * item.quantity, 0),
    [cart]
  );

  // Orders
  const createOrder = useCallback(
    async (orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order> => {
      setIsLoading(true);
      try {
        const newOrder = await MockApiService.createOrder(mockApiUrl, orderData);
        setOrders((prev) => [newOrder, ...prev]);

        // Reduce local book stock
        setBooks((prev) =>
          prev.map((book) => {
            const purchased = orderData.items.find((item) => item.bookId === book.id);
            if (purchased) {
              const updatedStock = Math.max(0, book.stock - purchased.quantity);
              // Trigger update on MockAPI asynchronously
              MockApiService.updateBook(mockApiUrl, book.id, { stock: updatedStock }).catch(() => {});
              return { ...book, stock: updatedStock };
            }
            return book;
          })
        );

        clearCart();
        closeCheckout();
        showToast('Đặt hàng thành công! Mã đơn: ' + newOrder.id);
        return newOrder;
      } finally {
        setIsLoading(false);
      }
    },
    [mockApiUrl, clearCart, closeCheckout, showToast]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus): Promise<boolean> => {
      try {
        await MockApiService.updateOrderStatus(mockApiUrl, orderId, status);
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? { ...order, status } : order))
        );
        showToast(`Đã chuyển đơn ${orderId} sang "${status}"`);
        return true;
      } catch {
        showToast('Không thể cập nhật trạng thái đơn hàng');
        return false;
      }
    },
    [mockApiUrl, showToast]
  );

  // Books CRUD for Staff
  const addBook = useCallback(
    async (bookData: Omit<Book, 'id'>): Promise<boolean> => {
      setIsLoading(true);
      try {
        const created = await MockApiService.createBook(mockApiUrl, bookData);
        setBooks((prev) => [created, ...prev]);
        closeBookForm();
        showToast(`Đã thêm sách "${created.title.slice(0, 20)}..." thành công`);
        return true;
      } catch {
        showToast('Lỗi khi thêm sách mới');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [mockApiUrl, closeBookForm, showToast]
  );

  const updateBook = useCallback(
    async (id: string, bookData: Partial<Book>): Promise<boolean> => {
      setIsLoading(true);
      try {
        const updated = await MockApiService.updateBook(mockApiUrl, id, bookData);
        setBooks((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...updated } : b))
        );
        closeBookForm();
        showToast('Cập nhật thông tin sách thành công');
        return true;
      } catch {
        showToast('Lỗi khi cập nhật sách');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [mockApiUrl, closeBookForm, showToast]
  );

  const deleteBook = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      try {
        await MockApiService.deleteBook(mockApiUrl, id);
        setBooks((prev) => prev.filter((b) => b.id !== id));
        showToast('Đã xóa sách khỏi danh mục');
        return true;
      } catch {
        showToast('Không thể xóa sách');
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [mockApiUrl, showToast]
  );

  const seedDataToApi = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await MockApiService.seedBooksToMockApi(mockApiUrl);
      if (res.success) {
        await refreshData();
      }
      showToast(res.message);
      return res;
    } finally {
      setIsLoading(false);
    }
  }, [mockApiUrl, refreshData, showToast]);

  // Filtered & Sorted books for customer view
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Filter by category
    if (selectedCategory && selectedCategory !== 'Tất cả') {
      result = result.filter(
        (b) => b.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [books, selectedCategory, searchQuery, sortBy]);

  const value = {
    role,
    setRole,
    customerTab,
    setCustomerTab,
    staffTab,
    setStaffTab,
    books,
    filteredBooks,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    sortBy,
    setSortBy,
    selectedBook,
    openBookDetail,
    closeBookDetail,
    addBook,
    updateBook,
    deleteBook,
    cart,
    cartCount,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isCartOpen,
    openCart,
    closeCart,
    isCheckoutOpen,
    openCheckout,
    closeCheckout,
    orders,
    createOrder,
    updateOrderStatus,
    isBookFormOpen,
    editingBook,
    openBookForm,
    closeBookForm,
    mockApiUrl,
    setMockApiUrl,
    isOnline,
    isLoading,
    refreshData,
    seedDataToApi,
    isMockApiModalOpen,
    openMockApiModal,
    closeMockApiModal,
    toastMessage,
    showToast,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

