import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { getAllProducts, getProductById, createOrder, getOrderById } from './server/db.js';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // GET /api/products
  app.get('/api/products', (req, res) => {
    try {
      const category = req.query.category as string | undefined;
      const search = req.query.search as string | undefined;
      const sort = req.query.sort as string | undefined;
      const products = getAllProducts(category, search, sort);
      res.json(products);
    } catch (err: any) {
      console.error('Error fetching products:', err);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });

  // GET /api/products/:id
  app.get('/api/products/:id', (req, res) => {
    try {
      const product = getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
      res.json(product);
    } catch (err: any) {
      console.error('Error fetching product:', err);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });

  // POST /api/orders
  app.post('/api/orders', (req, res) => {
    try {
      const {
        customer_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        payment_method,
        items
      } = req.body;

      // Validation
      if (!customer_name || !customer_name.trim()) {
        return res.status(400).json({ error: 'Customer name is required' });
      }
      if (!email || !email.includes('@')) {
        return res.status(400).json({ error: 'Valid email is required' });
      }
      if (!phone || phone.trim().length < 8) {
        return res.status(400).json({ error: 'Valid phone number is required' });
      }
      if (!address || !address.trim()) {
        return res.status(400).json({ error: 'Shipping address is required' });
      }
      if (!city || !city.trim()) {
        return res.status(400).json({ error: 'City is required' });
      }
      if (!state || !state.trim()) {
        return res.status(400).json({ error: 'State is required' });
      }
      if (!pincode || !pincode.trim()) {
        return res.status(400).json({ error: 'PIN code is required' });
      }
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }

      // Create order
      const order = createOrder({
        customer_name: customer_name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim(),
        payment_method: payment_method || 'UPI',
        items,
      });

      res.status(201).json({ success: true, order });
    } catch (err: any) {
      console.error('Error creating order:', err);
      res.status(500).json({ error: err.message || 'Failed to create order' });
    }
  });

  // GET /api/orders/:id
  app.get('/api/orders/:id', (req, res) => {
    try {
      const order = getOrderById(req.params.id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json(order);
    } catch (err: any) {
      console.error('Error fetching order:', err);
      res.status(500).json({ error: 'Failed to fetch order' });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CustomCraft server running on http://localhost:${PORT}`);
  });
}

startServer();
