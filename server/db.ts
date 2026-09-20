import { DatabaseSync } from 'node:sqlite';
import path from 'path';
import fs from 'fs';

const dbPath = path.resolve(process.cwd(), 'customcraft.db');
const db = new DatabaseSync(dbPath);

// Initialize schema
db.exec(`
  CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    base_price INTEGER NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 50,
    rating REAL DEFAULT 4.8,
    reviews_count INTEGER DEFAULT 100,
    available_sizes TEXT NOT NULL,
    available_colors TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    total_amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'Confirmed',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL,
    product_id TEXT NOT NULL,
    product_name TEXT NOT NULL,
    product_image TEXT,
    quantity INTEGER NOT NULL,
    color TEXT NOT NULL,
    size TEXT NOT NULL,
    custom_text TEXT DEFAULT '',
    design TEXT DEFAULT '',
    print_type TEXT NOT NULL,
    price INTEGER NOT NULL,
    FOREIGN KEY(order_id) REFERENCES orders(id)
  );
`);

const initialProducts = [
  {
    id: 'classic-cotton-tee',
    name: 'Classic Cotton Tee',
    category: 'T-SHIRTS',
    base_price: 599,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    description: 'Soft everyday cotton T-shirt designed for comfortable casual wear and personalized prints.',
    stock: 45,
    rating: 4.8,
    reviews_count: 128,
    available_sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    available_colors: JSON.stringify(['Black', 'White', 'Navy Blue', 'Pink', 'Grey']),
  },
  {
    id: 'oversized-street-tee',
    name: 'Oversized Street Tee',
    category: 'T-SHIRTS',
    base_price: 699,
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    description: 'Heavy drop-shoulder relaxed cut crafted from breathable 240 GSM combed cotton for a modern streetwear silhouette.',
    stock: 32,
    rating: 4.9,
    reviews_count: 94,
    available_sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    available_colors: JSON.stringify(['Black', 'White', 'Navy Blue', 'Pink', 'Grey']),
  },
  {
    id: 'premium-graphic-tee',
    name: 'Premium Graphic Tee',
    category: 'T-SHIRTS',
    base_price: 749,
    image: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-soft ring-spun cotton with enhanced tensile strength, specifically engineered for vibrant long-lasting prints.',
    stock: 28,
    rating: 4.9,
    reviews_count: 156,
    available_sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    available_colors: JSON.stringify(['Black', 'White', 'Navy Blue', 'Pink', 'Grey']),
  },
  {
    id: 'essential-basic-tee',
    name: 'Essential Basic Tee',
    category: 'T-SHIRTS',
    base_price: 499,
    image: 'https://images.unsplash.com/photo-1527719327859-c6ce80353573?auto=format&fit=crop&w=800&q=80',
    description: 'Lightweight, breathable 180 GSM cotton staple cut with a tailored regular fit for seamless daily wear.',
    stock: 50,
    rating: 4.7,
    reviews_count: 82,
    available_sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    available_colors: JSON.stringify(['Black', 'White', 'Navy Blue', 'Pink', 'Grey']),
  },
  {
    id: 'minimal-print-tee',
    name: 'Minimal Print Tee',
    category: 'T-SHIRTS',
    base_price: 649,
    image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80',
    description: 'Contemporary boxy-fit tee featuring reinforced double-needle ribbed collar and smooth surface finish.',
    stock: 36,
    rating: 4.8,
    reviews_count: 110,
    available_sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    available_colors: JSON.stringify(['Black', 'White', 'Navy Blue', 'Pink', 'Grey']),
  },
  {
    id: 'signature-heavyweight-tee',
    name: 'Signature Heavyweight Tee',
    category: 'T-SHIRTS',
    base_price: 799,
    image: 'https://images.unsplash.com/photo-1562157873-818bc0726f68?auto=format&fit=crop&w=800&q=80',
    description: 'Luxury 280 GSM dense french terry jersey with structured drape and premium preshrunk finish.',
    stock: 22,
    rating: 5.0,
    reviews_count: 73,
    available_sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    available_colors: JSON.stringify(['Black', 'White', 'Navy Blue', 'Pink', 'Grey']),
  },
  {
    id: 'customcraft-heavyweight-hoodie',
    name: 'CustomCraft Heavyweight Hoodie',
    category: 'HOODIES',
    base_price: 1499,
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    description: 'Plush 400 GSM brushed fleece pullover with metal-tipped drawstrings and double-lined hood.',
    stock: 18,
    rating: 4.9,
    reviews_count: 42,
    available_sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    available_colors: JSON.stringify(['Black', 'Navy Blue', 'Grey']),
  },
  {
    id: 'acid-wash-oversized-hoodie',
    name: 'Acid Wash Oversized Hoodie',
    category: 'HOODIES',
    base_price: 1699,
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
    description: 'Vintage mineral-washed cotton fleece with relaxed kangaroo pocket and dropped shoulders.',
    stock: 15,
    rating: 4.8,
    reviews_count: 31,
    available_sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
    available_colors: JSON.stringify(['Black', 'Grey', 'Pink']),
  },
  {
    id: 'embroidered-canvas-tote',
    name: 'Embroidered Canvas Tote',
    category: 'ACCESSORIES',
    base_price: 399,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
    description: 'Heavyweight 100% organic cotton canvas tote bag with reinforced cross-stitched handles.',
    stock: 60,
    rating: 4.7,
    reviews_count: 65,
    available_sizes: JSON.stringify(['M']),
    available_colors: JSON.stringify(['White', 'Black']),
  },
  {
    id: 'vintage-corduroy-cap',
    name: 'Vintage Corduroy Cap',
    category: 'ACCESSORIES',
    base_price: 449,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80',
    description: '6-panel unstructured retro corduroy cap with antique brass buckle closure and curved brim.',
    stock: 40,
    rating: 4.6,
    reviews_count: 38,
    available_sizes: JSON.stringify(['M']),
    available_colors: JSON.stringify(['Black', 'Navy Blue', 'Pink']),
  }
];

// Seed products if not seeded
const countStmt = db.prepare('SELECT COUNT(*) as count FROM products');
const countRow = countStmt.get() as { count: number };
if (countRow.count === 0) {
  const insertProductStmt = db.prepare(`
    INSERT INTO products (id, name, category, base_price, image, description, stock, rating, reviews_count, available_sizes, available_colors)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const p of initialProducts) {
    insertProductStmt.run(
      p.id,
      p.name,
      p.category,
      p.base_price,
      p.image,
      p.description,
      p.stock,
      p.rating,
      p.reviews_count,
      p.available_sizes,
      p.available_colors
    );
  }
}

// Seed a sample order CC1024 so it can be previewed or tested directly if desired!
const orderCountStmt = db.prepare('SELECT COUNT(*) as count FROM orders');
const orderCountRow = orderCountStmt.get() as { count: number };
if (orderCountRow.count === 0) {
  const insertOrderStmt = db.prepare(`
    INSERT INTO orders (id, customer_name, email, phone, address, city, state, pincode, total_amount, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const insertItemStmt = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, color, size, custom_text, design, print_type, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertOrderStmt.run(
    'CC1024',
    'Yuktha Sharma',
    'yuktha@example.com',
    '+91 98765 43210',
    '104, Horizon Heights, MG Road',
    'Bengaluru',
    'Karnataka',
    '560001',
    849,
    'Confirmed',
    new Date(Date.now() - 3600000 * 4).toISOString()
  );

  insertItemStmt.run(
    'CC1024',
    'classic-cotton-tee',
    'Classic Cotton Tee',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80',
    1,
    'Pink',
    'M',
    'YUKTHA',
    'Minimal Star',
    'Premium Print',
    849
  );
}

export function getAllProducts(category?: string, search?: string, sort?: string) {
  let query = 'SELECT * FROM products WHERE 1=1';
  const params: (string | number)[] = [];

  if (category && category !== 'ALL') {
    query += ' AND category = ?';
    params.push(category);
  }

  if (search && search.trim()) {
    query += ' AND (name LIKE ? OR description LIKE ?)';
    const term = `%${search.trim()}%`;
    params.push(term, term);
  }

  if (sort === 'low-to-high') {
    query += ' ORDER BY base_price ASC';
  } else if (sort === 'high-to-low') {
    query += ' ORDER BY base_price DESC';
  } else {
    query += ' ORDER BY rowid ASC';
  }

  const stmt = db.prepare(query);
  const rows = stmt.all(...params) as any[];

  return rows.map(r => ({
    ...r,
    available_sizes: JSON.parse(r.available_sizes || '[]'),
    available_colors: JSON.parse(r.available_colors || '[]'),
  }));
}

export function getProductById(id: string) {
  const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
  const row = stmt.get(id) as any;
  if (!row) return null;
  return {
    ...row,
    available_sizes: JSON.parse(row.available_sizes || '[]'),
    available_colors: JSON.parse(row.available_colors || '[]'),
  };
}

let orderCounter = 1025;

export function generateOrderId(): string {
  // Ensure uniqueness against DB
  let candidate = `CC${orderCounter++}`;
  const checkStmt = db.prepare('SELECT id FROM orders WHERE id = ?');
  while (checkStmt.get(candidate)) {
    candidate = `CC${orderCounter++}`;
  }
  return candidate;
}

export interface CreateOrderPayload {
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payment_method?: string;
  items: Array<{
    product_id: string;
    product_name: string;
    product_image?: string;
    quantity: number;
    color: string;
    size: string;
    custom_text: string;
    design: string;
    print_type: string;
    unit_price: number;
  }>;
}

export function createOrder(payload: CreateOrderPayload) {
  const orderId = generateOrderId();
  
  // Calculate total from items
  const totalAmount = payload.items.reduce((acc, item) => acc + (item.unit_price * item.quantity), 0);

  const insertOrderStmt = db.prepare(`
    INSERT INTO orders (id, customer_name, email, phone, address, city, state, pincode, total_amount, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  insertOrderStmt.run(
    orderId,
    payload.customer_name,
    payload.email,
    payload.phone,
    payload.address,
    payload.city,
    payload.state,
    payload.pincode,
    totalAmount,
    'Confirmed',
    new Date().toISOString()
  );

  const insertItemStmt = db.prepare(`
    INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, color, size, custom_text, design, print_type, price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const item of payload.items) {
    insertItemStmt.run(
      orderId,
      item.product_id,
      item.product_name,
      item.product_image || '',
      item.quantity,
      item.color,
      item.size,
      item.custom_text || '',
      item.design || '',
      item.print_type,
      item.unit_price
    );
  }

  return getOrderById(orderId);
}

export function getOrderById(id: string) {
  const orderStmt = db.prepare('SELECT * FROM orders WHERE id = ?');
  const order = orderStmt.get(id) as any;
  if (!order) return null;

  const itemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
  const items = itemsStmt.all(id) as any[];

  return {
    ...order,
    items,
  };
}
