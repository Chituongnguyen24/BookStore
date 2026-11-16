import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { BookApiService } from '../services/apiService';
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

  // Status & Sync
  isOnline: boolean;
  isLoading: boolean;
  refreshData: () => Promise<void>;

  // Notifications
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('customer');
  const [customerTab, setCustomerTab] = useState<CustomerTab>('home');
  const [staffTab, setStaffTab] = useState<StaffTab>('dashboard');

  const [books, setBooks] = useState<Book[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [sortBy, setSortBy] = useState('default');

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [isBookFormOpen, setIsBookFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [isOnline, setIsOnline] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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

  // Fetch initial books and orders from SQLite Backend via Axios
  const refreshData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedBooks, fetchedOrders] = await Promise.all([
        BookApiService.getBooks(),
        BookApiService.getOrders(),
      ]);
      setBooks(fetchedBooks);
      setOrders(fetchedOrders);
      setIsOnline(true);
    } catch (error) {
      console.warn('Backend SQLite connection error:', error);
      setIsOnline(false);
      showToast('Không thể kết nối đến Backend SQLite');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Cart operations
  const addToCart = useCallback((book: Book, quantity = 1) => {
    if (book.stock <= 0) {
      showToast('Sách đã hết hàng, không thể thêm vào giỏ');
      return;
    }
    setCart((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        const targetQty = existing.quantity + quantity;
        if (targetQty > book.stock) {
          showToast(`Chỉ còn ${book.stock} cuốn trong kho`);
          return prev.map((item) =>
            item.book.id === book.id ? { ...item, quantity: book.stock } : item
          );
        }
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: targetQty } : item
        );
      }
      const initialQty = Math.min(quantity, book.stock);
      return [...prev, { book, quantity: initialQty }];
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
      prev.map((item) => {
        if (item.book.id === bookId) {
          const clampedQty = Math.min(quantity, item.book.stock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
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
        const newOrder = await BookApiService.createOrder(orderData);
        setOrders((prev) => [newOrder, ...prev]);

        // Refresh lại danh sách sách để cập nhật tồn kho đã bị trừ trong SQLite
        const updatedBooks = await BookApiService.getBooks();
        setBooks(updatedBooks);

        clearCart();
        closeCheckout();
        showToast('Đặt hàng thành công! Mã đơn: ' + newOrder.id);
        return newOrder;
      } catch (err: any) {
        showToast('Lỗi khi tạo đơn hàng: ' + (err.message || ''));
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [clearCart, closeCheckout, showToast]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus): Promise<boolean> => {
      try {
        const updatedOrder = await BookApiService.updateOrderStatus(orderId, status);
        setOrders((prev) =>
          prev.map((order) => (order.id === orderId ? updatedOrder : order))
        );

        // Hủy đơn thì kho được hoàn lại trong SQLite, load lại sách
        if (status === 'Đã hủy') {
          const updatedBooks = await BookApiService.getBooks();
          setBooks(updatedBooks);
        }

        showToast(`Đã chuyển đơn ${orderId} sang "${status}"`);
        return true;
      } catch {
        showToast('Không thể cập nhật trạng thái đơn hàng');
        return false;
      }
    },
    [showToast]
  );

  // Books CRUD for Staff
  const addBook = useCallback(
    async (bookData: Omit<Book, 'id'>): Promise<boolean> => {
      setIsLoading(true);
      try {
        const created = await BookApiService.createBook(bookData);
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
    [closeBookForm, showToast]
  );

  const updateBook = useCallback(
    async (id: string, bookData: Partial<Book>): Promise<boolean> => {
      setIsLoading(true);
      try {
        const updated = await BookApiService.updateBook(id, bookData);
        setBooks((prev) =>
          prev.map((b) => (b.id === id ? updated : b))
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
    [closeBookForm, showToast]
  );

  const deleteBook = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      try {
        await BookApiService.deleteBook(id);
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
    [showToast]
  );

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
    isOnline,
    isLoading,
    refreshData,
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
