import pool from "../config/db.js";
import { logAudit } from "../services/auditService.js";

export const getOrders = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM orders ORDER BY orderDate DESC"
    );
    res.json(
      rows.map((row) => ({
        ...row,
        refNumbers:
          typeof row.refNumbers === "string"
            ? JSON.parse(row.refNumbers || "{}")
            : row.refNumbers,
        customer:
          typeof row.customer === "string"
            ? JSON.parse(row.customer || "{}")
            : row.customer,
        discount:
          typeof row.discount === "string"
            ? JSON.parse(row.discount || "{}")
            : row.discount,
        delivery:
          typeof row.delivery === "string"
            ? JSON.parse(row.delivery || "{}")
            : row.delivery,
        payment:
          typeof row.payment === "string"
            ? JSON.parse(row.payment || "{}")
            : row.payment,
        financials:
          typeof row.financials === "string"
            ? JSON.parse(row.financials || "{}")
            : row.financials,
        meta:
          typeof row.meta === "string"
            ? JSON.parse(row.meta || "{}")
            : row.meta,
      }))
    );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrder = async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const order = req.body;
    const [p] = await conn.query(
      "SELECT currentStock FROM products WHERE id = ?",
      [order.productId]
    );
    if (!p[0] || p[0].currentStock < order.quantity)
      throw new Error("Insufficient Stock");

    await conn.query(
      "INSERT INTO orders (id, productId, productName, quantity, unitPrice, subtotal, refNumbers, customer, discount, delivery, payment, financials, meta, orderDate) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        order.id,
        order.productId,
        order.productName,
        order.quantity,
        order.unitPrice,
        order.subtotal,
        JSON.stringify(order.refNumbers),
        JSON.stringify(order.customer),
        JSON.stringify(order.discount),
        JSON.stringify(order.delivery),
        JSON.stringify(order.payment),
        JSON.stringify(order.financials),
        JSON.stringify(order.meta),
        order.meta.orderDate,
      ]
    );

    await conn.query(
      "UPDATE products SET currentStock = currentStock - ? WHERE id = ?",
      [order.quantity, order.productId]
    );
    await logAudit(
      conn,
      order.id,
      "Order",
      "CREATE",
      null,
      order,
      order.meta.receivedBy
    );
    await conn.commit();
    res.status(201).json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, changedBy } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [orders] = await conn.query(
      "SELECT delivery, quantity, productId FROM orders WHERE id = ?",
      [id]
    );
    if (orders.length === 0) throw new Error("Order not found");

    const delivery =
      typeof orders[0].delivery === "string"
        ? JSON.parse(orders[0].delivery)
        : orders[0].delivery;
    const oldStatus = delivery.status;
    const qty = orders[0].quantity;
    const pid = orders[0].productId;

    const isNonActive = (s) => s === "Cancelled" || s === "Returned";

    if (isNonActive(status) && !isNonActive(oldStatus)) {
      await conn.query(
        "UPDATE products SET currentStock = currentStock + ? WHERE id = ?",
        [qty, pid]
      );
    } else if (!isNonActive(status) && isNonActive(oldStatus)) {
      const [p] = await conn.query(
        "SELECT currentStock FROM products WHERE id = ?",
        [pid]
      );
      if (!p[0] || p[0].currentStock < qty)
        throw new Error("Insufficient stock for re-activation");
      await conn.query(
        "UPDATE products SET currentStock = currentStock - ? WHERE id = ?",
        [qty, pid]
      );
    }

    delivery.status = status;
    await conn.query("UPDATE orders SET delivery = ? WHERE id = ?", [
      JSON.stringify(delivery),
      id,
    ]);
    await logAudit(
      conn,
      id,
      "Order",
      "STATUS_CHANGE",
      { status: oldStatus },
      { status: status },
      changedBy
    );
    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};

export const updateOrderPayment = async (req, res) => {
  const { id } = req.params;
  const { amount, method, transactionId, receivedBy } = req.body;
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const [orders] = await conn.query(
      "SELECT payment, financials FROM orders WHERE id = ?",
      [id]
    );
    const payment =
      typeof orders[0].payment === "string"
        ? JSON.parse(orders[0].payment)
        : orders[0].payment;
    const financials =
      typeof orders[0].financials === "string"
        ? JSON.parse(orders[0].financials)
        : orders[0].financials;

    const oldState = { ...payment };
    const newPaidAmount = Number(payment.paidAmount) + Number(amount);
    const netPayable = Number(financials.netPayable);
    const newDueAmount = netPayable - newPaidAmount;

    if (!payment.history) payment.history = [];
    payment.history.push({
      id: `PAY-${Date.now()}`,
      amount: Number(amount),
      method,
      transactionId,
      date: new Date().toISOString(),
      receivedBy,
    });
    payment.paidAmount = newPaidAmount;
    payment.dueAmount = newDueAmount;
    payment.status = newDueAmount <= 0 ? "Paid" : "Partial Paid";

    await conn.query("UPDATE orders SET payment = ? WHERE id = ?", [
      JSON.stringify(payment),
      id,
    ]);
    await logAudit(
      conn,
      id,
      "Financial",
      "PAYMENT",
      oldState,
      payment,
      receivedBy
    );
    await conn.commit();
    res.json({ success: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
};
