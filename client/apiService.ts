
import { Order, Product, OrderStatus, Category, AuditLog, Expense, Purchase } from './types';

const API_BASE = 'http://localhost:3001/api';

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'Unknown server error' }));
    throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
  }
  return res.json();
}

export const apiService = {
  async checkHealth(): Promise<boolean> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 3000); 
    try {
      const res = await fetch(`${API_BASE}/health`, { 
        method: 'GET',
        headers: { 'Accept': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(id);
      return res.ok;
    } catch (err) {
      clearTimeout(id);
      return false;
    }
  },

  async downloadBackup(): Promise<void> {
    const res = await fetch(`${API_BASE}/backup`);
    if (!res.ok) throw new Error("Backup failed");
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `omniorder_backup_${new Date().toISOString().split('T')[0]}.sql`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },

  async getPurchases(): Promise<Purchase[]> {
    const res = await fetch(`${API_BASE}/purchases`);
    return handleResponse(res);
  },

  async createPurchase(purchase: Purchase): Promise<void> {
    const res = await fetch(`${API_BASE}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchase),
    });
    return handleResponse(res);
  },

  async getExpenses(): Promise<Expense[]> {
    const res = await fetch(`${API_BASE}/expenses`);
    return handleResponse(res);
  },

  async createExpense(expense: Expense): Promise<void> {
    const res = await fetch(`${API_BASE}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expense),
    });
    return handleResponse(res);
  },

  async deleteExpense(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/expenses/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse(res);
  },

  async createCategory(category: Category): Promise<void> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(category),
    });
    return handleResponse(res);
  },

  async updateCategory(id: string, name: string): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
    return handleResponse(res);
  },

  async deleteCategory(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  async getProducts(): Promise<Product[]> {
    const res = await fetch(`${API_BASE}/products`);
    return handleResponse(res);
  },

  async createProduct(product: Product): Promise<void> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return handleResponse(res);
  },

  async updateProduct(product: Product): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${product.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    return handleResponse(res);
  },

  async deleteProduct(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    return handleResponse(res);
  },

  async getOrders(): Promise<Order[]> {
    const res = await fetch(`${API_BASE}/orders`);
    return handleResponse(res);
  },

  async createOrder(order: Order): Promise<void> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return handleResponse(res);
  },

  async updateOrderStatus(id: string, status: OrderStatus, changedBy: string): Promise<void> {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, changedBy }),
    });
    return handleResponse(res);
  },

  async recordPayment(orderId: string, paymentData: { amount: number, method: string, transactionId: string, receivedBy: string }): Promise<void> {
    const res = await fetch(`${API_BASE}/orders/${orderId}/payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData),
    });
    return handleResponse(res);
  },

  async getAuditLogs(): Promise<AuditLog[]> {
    const res = await fetch(`${API_BASE}/audit-logs`);
    return handleResponse(res);
  }
};
