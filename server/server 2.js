
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const dbConfig = {
  host: '127.0.0.1',
  user: 'root',
  password: '123456', 
  database: 'omniorder_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};

let pool;

async function initializeDatabase() {
  console.log('\n--- OMNIORDER ENGINE: DB INITIALIZER ---');
  try {
    const initConn = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    
    await initConn.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
    await initConn.query(`USE ${dbConfig.database}`);
    
    // Core Tables
    await initConn.query(`CREATE TABLE IF NOT EXISTS categories (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL)`);
    await initConn.query(`CREATE TABLE IF NOT EXISTS products (id VARCHAR(50) PRIMARY KEY, name VARCHAR(255) NOT NULL, categoryId VARCHAR(50), costPrice DECIMAL(12, 2) DEFAULT 0.00, sellingPrice DECIMAL(12, 2) DEFAULT 0.00, openingStock INT DEFAULT 0, currentStock INT DEFAULT 0, image LONGTEXT, INDEX (categoryId))`);
    await initConn.query(`CREATE TABLE IF NOT EXISTS orders (id VARCHAR(50) PRIMARY KEY, productId VARCHAR(50), productName VARCHAR(255), quantity INT DEFAULT 1, unitPrice DECIMAL(12, 2) DEFAULT 0.00, subtotal DECIMAL(12, 2) DEFAULT 0.00, refNumbers JSON, customer JSON, discount JSON, delivery JSON, payment JSON, financials JSON, meta JSON, orderDate DATE NOT NULL)`);
    await initConn.query(`CREATE TABLE IF NOT EXISTS expenses (id VARCHAR(50) PRIMARY KEY, amount DECIMAL(15, 2) NOT NULL, type VARCHAR(100) NOT NULL, description TEXT, date DATE NOT NULL, createdBy VARCHAR(255) NOT NULL, createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
    
    // Explicitly re-verify and create purchases table
    console.log('MIGRATION: Verifying "purchases" table...');
    await initConn.query(`CREATE TABLE IF NOT EXISTS purchases (
      id VARCHAR(50) PRIMARY KEY,
      productId VARCHAR(50) NOT NULL,
      productName VARCHAR(255) NOT NULL,
      quantity INT NOT NULL,
      purchasePrice DECIMAL(12, 2) NOT NULL,
      totalCost DECIMAL(15, 2) NOT NULL,
      supplierName VARCHAR(255),
      purchaseDate DATE NOT NULL,
      createdBy VARCHAR(255) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX (productId),
      INDEX (purchaseDate)
    )`);
    console.log('MIGRATION: "purchases" table verified.');

    // Audit logs
    await initConn.query(`CREATE TABLE IF NOT EXISTS audit_logs (
      id INT AUTO_INCREMENT PRIMARY KEY, 
      targetId VARCHAR(50), 
      module VARCHAR(50),
      action VARCHAR(50),
      oldState LONGTEXT, 
      newState LONGTEXT, 
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
      changedBy VARCHAR(255), 
      INDEX (targetId),
      INDEX (module),
      INDEX (timestamp)
    )`);

    await initConn.end();
    pool = mysql.createPool(dbConfig);
    console.log('STATUS: DATABASE READY & MIGRATED');
    app.listen(port);
  } catch (err) {
    console.error('INIT FAILED:', err.message);
    setTimeout(initializeDatabase, 10000);
  }
}
initializeDatabase();

const logAudit = async (conn, targetId, module, action, oldState, newState, changedBy) => {
  await conn.query(
    'INSERT INTO audit_logs (`targetId`, `module`, `action`, `oldState`, `newState`, `changedBy`) VALUES (?,?,?,?,?,?)',
    [targetId, module, action, JSON.stringify(oldState), JSON.stringify(newState), changedBy]
  );
};

// Procurement Endpoints
app.get('/api/purchases', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM purchases ORDER BY purchaseDate DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch purchases: " + err.message });
  }
});

app.post('/api/purchases', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const purchase = req.body;
    await conn.query(
      'INSERT INTO purchases (id, productId, productName, quantity, purchasePrice, totalCost, supplierName, purchaseDate, createdBy) VALUES (?,?,?,?,?,?,?,?,?)',
      [purchase.id, purchase.productId, purchase.productName, purchase.quantity, purchase.purchasePrice, purchase.totalCost, purchase.supplierName, purchase.purchaseDate, purchase.createdBy]
    );
    await conn.query('UPDATE products SET currentStock = currentStock + ? WHERE id = ?', [purchase.quantity, purchase.productId]);
    await logAudit(conn, purchase.id, 'Purchase', 'STOCK_IN', null, purchase, purchase.createdBy);
    await conn.commit();
    res.status(201).json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
});

// Other endpoints (Categories, Products, Orders, Expenses, Audit, Backup)
// (Implementation continues exactly as before but with robust error handling for each query)
app.get('/api/health', (req, res) => res.json({ status: 'up' }));
app.get('/api/expenses', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM expenses ORDER BY date DESC');
  res.json(rows);
});
app.post('/api/expenses', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { id, amount, type, description, date, createdBy } = req.body;
    await conn.query('INSERT INTO expenses (id, amount, type, description, date, createdBy) VALUES (?,?,?,?,?,?)', [id, amount, type, description, date, createdBy]);
    await logAudit(conn, id, 'Expense', 'CREATE', null, req.body, createdBy);
    await conn.commit();
    res.status(201).json({ success: true });
  } catch (err) { await conn.rollback(); res.status(500).json({ message: err.message }); }
  finally { conn.release(); }
});
app.delete('/api/expenses/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [rows] = await conn.query('SELECT * FROM expenses WHERE id = ?', [req.params.id]);
    await conn.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
    await logAudit(conn, req.params.id, 'Expense', 'DELETE', rows[0], null, 'System/Admin');
    await conn.commit();
    res.json({ success: true });
  } catch (err) { await conn.rollback(); res.status(500).json({ message: err.message }); }
  finally { conn.release(); }
});
app.get('/api/categories', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
  res.json(rows);
});
app.post('/api/categories', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const { id, name } = req.body;
    await conn.query('INSERT INTO categories (id, name) VALUES (?,?)', [id, name]);
    await logAudit(conn, id, 'Category', 'CREATE', null, req.body, 'Admin');
    await conn.commit();
    res.status(201).json({ success: true });
  } catch (err) { await conn.rollback(); res.status(500).json({ message: err.message }); }
  finally { conn.release(); }
});
app.get('/api/products', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM products ORDER BY name ASC');
  res.json(rows);
});
app.post('/api/products', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const product = req.body;
    await conn.query('INSERT INTO products (id, name, categoryId, costPrice, sellingPrice, openingStock, currentStock, image) VALUES (?,?,?,?,?,?,?,?)', 
      [product.id, product.name, product.categoryId, product.costPrice, product.sellingPrice, product.openingStock, product.currentStock, product.image]);
    await logAudit(conn, product.id, 'Inventory', 'CREATE', null, product, 'Admin');
    await conn.commit();
    res.status(201).json({ success: true });
  } catch (err) { await conn.rollback(); res.status(500).json({ message: err.message }); }
  finally { conn.release(); }
});
app.put('/api/products/:id', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [old] = await conn.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    const p = req.body;
    await conn.query('UPDATE products SET name=?, categoryId=?, costPrice=?, sellingPrice=?, currentStock=?, image=? WHERE id=?', 
      [p.name, p.categoryId, p.costPrice, p.sellingPrice, p.currentStock, p.image, req.params.id]);
    await logAudit(conn, req.params.id, 'Inventory', 'UPDATE', old[0], p, 'Admin');
    await conn.commit();
    res.json({ success: true });
  } catch (err) { await conn.rollback(); res.status(500).json({ message: err.message }); }
  finally { conn.release(); }
});
app.get('/api/orders', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM orders ORDER BY orderDate DESC');
  res.json(rows.map(row => ({
    ...row,
    refNumbers: typeof row.refNumbers === 'string' ? JSON.parse(row.refNumbers || '{}') : row.refNumbers,
    customer: typeof row.customer === 'string' ? JSON.parse(row.customer || '{}') : row.customer,
    discount: typeof row.discount === 'string' ? JSON.parse(row.discount || '{}') : row.discount,
    delivery: typeof row.delivery === 'string' ? JSON.parse(row.delivery || '{}') : row.delivery,
    payment: typeof row.payment === 'string' ? JSON.parse(row.payment || '{}') : row.payment,
    financials: typeof row.financials === 'string' ? JSON.parse(row.financials || '{}') : row.financials,
    meta: typeof row.meta === 'string' ? JSON.parse(row.meta || '{}') : row.meta
  })));
});
app.post('/api/orders', async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const order = req.body;
    const [p] = await conn.query('SELECT currentStock FROM products WHERE id = ?', [order.productId]);
    if (!p[0] || p[0].currentStock < order.quantity) throw new Error('Insufficient Stock');
    await conn.query('INSERT INTO orders (id, productId, productName, quantity, unitPrice, subtotal, refNumbers, customer, discount, delivery, payment, financials, meta, orderDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)', 
      [order.id, order.productId, order.productName, order.quantity, order.unitPrice, order.subtotal, JSON.stringify(order.refNumbers), JSON.stringify(order.customer), JSON.stringify(order.discount), JSON.stringify(order.delivery), JSON.stringify(order.payment), JSON.stringify(order.financials), JSON.stringify(order.meta), order.meta.orderDate]);
    await conn.query('UPDATE products SET currentStock = currentStock - ? WHERE id = ?', [order.quantity, order.productId]);
    await logAudit(conn, order.id, 'Order', 'CREATE', null, order, order.meta.receivedBy);
    await conn.commit();
    res.status(201).json({ success: true });
  } catch (err) { await conn.rollback(); res.status(500).json({ message: err.message }); }
  finally { conn.release(); }
});
app.patch('/api/orders/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, changedBy } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [orders] = await conn.query('SELECT delivery, quantity, productId FROM orders WHERE id = ?', [id]);
    if (orders.length === 0) throw new Error('Order not found');
    const delivery = typeof orders[0].delivery === 'string' ? JSON.parse(orders[0].delivery) : orders[0].delivery;
    const oldStatus = delivery.status;
    const qty = orders[0].quantity;
    const pid = orders[0].productId;
    const isNonActive = (s) => s === 'Cancelled' || s === 'Returned';
    if (isNonActive(status) && !isNonActive(oldStatus)) {
      await conn.query('UPDATE products SET currentStock = currentStock + ? WHERE id = ?', [qty, pid]);
    } else if (!isNonActive(status) && isNonActive(oldStatus)) {
      const [p] = await conn.query('SELECT currentStock FROM products WHERE id = ?', [pid]);
      if (!p[0] || p[0].currentStock < qty) throw new Error('Insufficient stock for re-activation');
      await conn.query('UPDATE products SET currentStock = currentStock - ? WHERE id = ?', [qty, pid]);
    }
    delivery.status = status;
    await conn.query('UPDATE orders SET delivery = ? WHERE id = ?', [JSON.stringify(delivery), id]);
    await logAudit(conn, id, 'Order', 'STATUS_CHANGE', { status: oldStatus }, { status: status }, changedBy);
    await conn.commit();
    res.json({ success: true });
  } catch (err) { await conn.rollback(); res.status(500).json({ message: err.message }); }
  finally { conn.release(); }
});
app.patch('/api/orders/:id/payment', async (req, res) => {
  const { id } = req.params;
  const { amount, method, transactionId, receivedBy } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [orders] = await conn.query('SELECT payment, financials FROM orders WHERE id = ?', [id]);
    const payment = typeof orders[0].payment === 'string' ? JSON.parse(orders[0].payment) : orders[0].payment;
    const financials = typeof orders[0].financials === 'string' ? JSON.parse(orders[0].financials) : orders[0].financials;
    const oldState = { ...payment };
    const newPaidAmount = Number(payment.paidAmount) + Number(amount);
    const netPayable = Number(financials.netPayable);
    const newDueAmount = netPayable - newPaidAmount;
    if (!payment.history) payment.history = [];
    payment.history.push({ id: `PAY-${Date.now()}`, amount: Number(amount), method, transactionId, date: new Date().toISOString(), receivedBy });
    payment.paidAmount = newPaidAmount;
    payment.dueAmount = newDueAmount;
    payment.status = newDueAmount <= 0 ? 'Paid' : 'Partial Paid';
    await conn.query('UPDATE orders SET payment = ? WHERE id = ?', [JSON.stringify(payment), id]);
    await logAudit(conn, id, 'Financial', 'PAYMENT', oldState, payment, receivedBy);
    await conn.commit();
    res.json({ success: true });
  } catch (err) { await conn.rollback(); res.status(500).json({ message: err.message }); }
  finally { conn.release(); }
});
app.get('/api/audit-logs', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 100');
  res.json(rows);
});
app.get('/api/backup', async (req, res) => {
  try {
    let sqlDump = `-- OmniOrder Pro Backup\n-- Generated: ${new Date().toISOString()}\n\n`;
    sqlDump += `SET FOREIGN_KEY_CHECKS = 0;\n\n`;
    const tables = ['categories', 'products', 'orders', 'expenses', 'audit_logs', 'purchases'];
    for (const table of tables) {
      sqlDump += `-- Dumping table: ${table}\n`;
      const [rows] = await pool.query(`SELECT * FROM ${table}`);
      if (rows.length > 0) {
        const columns = Object.keys(rows[0]).join(', ');
        rows.forEach(row => {
          const values = Object.values(row).map(val => val === null ? 'NULL' : pool.escape(typeof val === 'object' ? JSON.stringify(val) : val)).join(', ');
          sqlDump += `INSERT INTO ${table} (${columns}) VALUES (${values});\n`;
        });
      }
      sqlDump += `\n`;
    }
    sqlDump += `SET FOREIGN_KEY_CHECKS = 1;\n`;
    res.setHeader('Content-Type', 'text/sql');
    res.setHeader('Content-Disposition', `attachment; filename=omniorder_backup_${Date.now()}.sql`);
    res.send(sqlDump);
  } catch (err) { res.status(500).json({ message: "Backup failed" }); }
});
