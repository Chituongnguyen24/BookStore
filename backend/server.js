const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Database file path
const dbPath = path.resolve(__dirname, 'bookstore.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to SQLite database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database: bookstore.db');
    initDatabase();
  }
});

// Helper for promise-based queries
const dbAll = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });

const dbGet = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });

const dbRun = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });

// Initialize Tables and Initial Data
async function initDatabase() {
  try {
    // 1. Table books
    await dbRun(`
      CREATE TABLE IF NOT EXISTS books (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        category TEXT NOT NULL,
        price INTEGER NOT NULL,
        originalPrice INTEGER,
        stock INTEGER NOT NULL DEFAULT 0,
        rating REAL DEFAULT 5.0,
        reviewsCount INTEGER DEFAULT 0,
        coverImage TEXT,
        description TEXT
      )
    `);

    // 2. Table orders
    await dbRun(`
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customerName TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        note TEXT,
        paymentMethod TEXT NOT NULL,
        items TEXT NOT NULL,
        totalAmount INTEGER NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL
      )
    `);

    // 3. Table customers
    await dbRun(`
      CREATE TABLE IF NOT EXISTS customers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        address TEXT NOT NULL,
        email TEXT,
        avatar TEXT,
        totalOrders INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL
      )
    `);

    // 4. Table employees
    await dbRun(`
      CREATE TABLE IF NOT EXISTS employees (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT,
        pin TEXT NOT NULL,
        role TEXT NOT NULL,
        status TEXT DEFAULT 'Active',
        avatar TEXT,
        createdAt TEXT NOT NULL
      )
    `);

    // Seed initial books if empty
    const bookCount = await dbGet('SELECT COUNT(*) as count FROM books');
    if (bookCount && bookCount.count === 0) {
      console.log('🌱 Seeding initial books...');
      const initialBooks = [
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
          description: 'Cuốn sách nổi tiếng thế giới về nghệ thuật đối nhân xử thế và thành công.',
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
          description: 'Câu chuyện ngụ ngôn giàu chất thơ về cậu bé chăn cừu đi tìm sứ mệnh cuộc đời.',
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
          description: 'Thay đổi tư duy tài chính, phân biệt tài sản và tiêu sản để đạt tự do tài chính.',
        },
        {
          id: '4',
          title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
          author: 'Robert C. Martin',
          category: 'Công nghệ',
          price: 245000,
          originalPrice: 290000,
          stock: 4,
          rating: 4.9,
          reviewsCount: 420,
          coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777f?w=500&auto=format&fit=crop&q=60',
          description: 'Cẩm nang viết code sạch, dễ bảo trì và chuẩn mực kiến trúc cho lập trình viên.',
        },
        {
          id: '5',
          title: 'Hoàng Tử Bé (Le Petit Prince)',
          author: 'Antoine de Saint-Exupéry',
          category: 'Thiếu nhi',
          price: 65000,
          originalPrice: 85000,
          stock: 3,
          rating: 4.9,
          reviewsCount: 1200,
          coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&auto=format&fit=crop&q=60',
          description: 'Tác phẩm văn học thiếu nhi kinh điển toàn cầu về tình bạn và lòng nhân ái.',
        },
      ];

      for (const b of initialBooks) {
        await dbRun(
          `INSERT INTO books (id, title, author, category, price, originalPrice, stock, rating, reviewsCount, coverImage, description)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [b.id, b.title, b.author, b.category, b.price, b.originalPrice, b.stock, b.rating, b.reviewsCount, b.coverImage, b.description]
        );
      }
    }

    // Seed initial orders if empty
    const orderCount = await dbGet('SELECT COUNT(*) as count FROM orders');
    if (orderCount && orderCount.count === 0) {
      console.log('🌱 Seeding initial orders...');
      const initialOrders = [
        {
          id: 'ORD-1001',
          customerName: 'Nguyễn Văn An',
          phone: '0912345678',
          address: 'Số 12 Chùa Bộc, Đống Đa, Hà Nội',
          note: 'Giao giờ hành chính giúp em nhé',
          paymentMethod: 'COD',
          items: JSON.stringify([
            {
              bookId: '1',
              title: 'Đắc Nhân Tâm',
              author: 'Dale Carnegie',
              price: 86000,
              quantity: 1,
              coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=60',
            },
          ]),
          totalAmount: 106000,
          status: 'Chờ xác nhận',
          createdAt: new Date().toISOString(),
        },
      ];

      for (const o of initialOrders) {
        await dbRun(
          `INSERT INTO orders (id, customerName, phone, address, note, paymentMethod, items, totalAmount, status, createdAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [o.id, o.customerName, o.phone, o.address, o.note, o.paymentMethod, o.items, o.totalAmount, o.status, o.createdAt]
        );
      }
    }

    // Seed default employee
    const empCount = await dbGet('SELECT COUNT(*) as count FROM employees');
    if (empCount && empCount.count === 0) {
      console.log('🌱 Seeding default employees...');
      await dbRun(
        `INSERT INTO employees (id, name, phone, email, pin, role, status, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        ['EMP-1', 'Nhân viên Quản lý', '0911223344', 'admin@bookstore.vn', '1234', 'Manager', 'Active', new Date().toISOString()]
      );
    }

    console.log('🚀 Database initialized successfully!');
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
  }
}

// ==========================================
// API ROUTES
// ==========================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', database: 'sqlite', time: new Date().toISOString() });
});

// ------------------------------------------
// BOOKS API
// ------------------------------------------
app.get('/api/books', async (req, res) => {
  try {
    const books = await dbAll('SELECT * FROM books ORDER BY CAST(id AS INTEGER) DESC');
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/books/:id', async (req, res) => {
  try {
    const book = await dbGet('SELECT * FROM books WHERE id = ?', [req.params.id]);
    if (!book) return res.status(404).json({ error: 'Book not found' });
    res.json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const { title, author, category, price, originalPrice, stock, coverImage, description } = req.body;
    const id = Date.now().toString();
    await dbRun(
      `INSERT INTO books (id, title, author, category, price, originalPrice, stock, rating, reviewsCount, coverImage, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, 5.0, 0, ?, ?)`,
      [id, title, author, category, Number(price), originalPrice ? Number(originalPrice) : null, Number(stock) || 0, coverImage, description]
    );
    const newBook = await dbGet('SELECT * FROM books WHERE id = ?', [id]);
    res.status(201).json(newBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/books/:id', async (req, res) => {
  try {
    const { title, author, category, price, originalPrice, stock, coverImage, description } = req.body;
    await dbRun(
      `UPDATE books SET 
        title = COALESCE(?, title),
        author = COALESCE(?, author),
        category = COALESCE(?, category),
        price = COALESCE(?, price),
        originalPrice = COALESCE(?, originalPrice),
        stock = COALESCE(?, stock),
        coverImage = COALESCE(?, coverImage),
        description = COALESCE(?, description)
       WHERE id = ?`,
      [title, author, category, price ? Number(price) : null, originalPrice ? Number(originalPrice) : null, stock !== undefined ? Number(stock) : null, coverImage, description, req.params.id]
    );
    const updatedBook = await dbGet('SELECT * FROM books WHERE id = ?', [req.params.id]);
    res.json(updatedBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/books/:id', async (req, res) => {
  try {
    await dbRun('DELETE FROM books WHERE id = ?', [req.params.id]);
    res.json({ message: 'Deleted successfully', id: req.params.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// ORDERS API
// ------------------------------------------
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await dbAll('SELECT * FROM orders ORDER BY createdAt DESC');
    const formatted = orders.map((o) => ({
      ...o,
      items: typeof o.items === 'string' ? JSON.parse(o.items) : o.items,
    }));
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, phone, address, note, paymentMethod, items, totalAmount, status } = req.body;
    const id = `ORD-${Date.now().toString().slice(-6)}`;
    const createdAt = new Date().toISOString();
    const itemsJson = JSON.stringify(items || []);

    // 1. Insert order
    await dbRun(
      `INSERT INTO orders (id, customerName, phone, address, note, paymentMethod, items, totalAmount, status, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, customerName, phone, address, note || '', paymentMethod, itemsJson, Number(totalAmount), status || 'Chờ xác nhận', createdAt]
    );

    // 2. Business rule: Deduct stock when order is placed
    if (Array.isArray(items)) {
      for (const item of items) {
        if (item.bookId && item.quantity) {
          await dbRun(
            'UPDATE books SET stock = MAX(0, stock - ?) WHERE id = ?',
            [Number(item.quantity), item.bookId]
          );
        }
      }
    }

    const createdOrder = await dbGet('SELECT * FROM orders WHERE id = ?', [id]);
    res.status(201).json({
      ...createdOrder,
      items: JSON.parse(createdOrder.items),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const order = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Business rule: If order is cancelled, return stock to books
    if (status === 'Đã hủy' && order.status !== 'Đã hủy') {
      const items = JSON.parse(order.items || '[]');
      for (const item of items) {
        if (item.bookId && item.quantity) {
          await dbRun(
            'UPDATE books SET stock = stock + ? WHERE id = ?',
            [Number(item.quantity), item.bookId]
          );
        }
      }
    }

    await dbRun('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    const updated = await dbGet('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    res.json({
      ...updated,
      items: JSON.parse(updated.items),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------------------------
// EMPLOYEES & AUTH API
// ------------------------------------------
app.post('/api/auth/staff-pin', async (req, res) => {
  try {
    const { pin } = req.body;
    const emp = await dbGet('SELECT * FROM employees WHERE pin = ? AND status = "Active"', [pin]);
    if (emp) {
      res.json({ success: true, employee: emp });
    } else {
      res.status(401).json({ success: false, message: 'Mã PIN không chính xác' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`=========================================`);
  console.log(`🚀 BookStore SQLite Backend Running!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`📚 Database file: ${dbPath}`);
  console.log(`=========================================`);
});
