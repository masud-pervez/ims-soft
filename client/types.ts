
export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  DELIVERED = 'Delivered',
  CANCELLED = 'Cancelled',
  RETURNED = 'Returned'
}

export enum PaymentStatus {
  UNPAID = 'Unpaid',
  PARTIAL = 'Partial Paid',
  PAID = 'Paid'
}

export enum DeliveryType {
  INSIDE = 'Inside Area',
  OUTSIDE = 'Outside Area',
  URGENT = 'Urgent Delivery'
}

export enum UserRole {
  ADMIN = 'Admin',
  ORDER_RECEIVER = 'Order Receiver',
  DELIVERY_MANAGER = 'Delivery Manager'
}

export enum ExpenseType {
  ADS = 'FB / Google Ad Cost',
  INFLUENCER = 'Influencer / Promotion Cost',
  MODERATOR = 'Moderator / Call Center Cost',
  COURIER_DELIVERY = 'Courier Delivery Cost',
  COURIER_RETURN = 'Return Courier Cost',
  PACKAGING = 'Packaging Cost',
  PRODUCT_PURCHASE = 'Product Purchase Cost',
  SALARY = 'Salary / Commission',
  SOFTWARE = 'Software / Tool Cost',
  UTILITY = 'Internet / Utility',
  RENT = 'Office Rent',
  MISC = 'Misc / Other'
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  costPrice: number;
  sellingPrice: number;
  openingStock: number;
  currentStock: number;
  image?: string;
}

export interface Purchase {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  purchasePrice: number;
  totalCost: number;
  supplierName: string;
  purchaseDate: string;
  createdBy: string;
}

export interface PaymentEntry {
  id: string;
  amount: number;
  method: string;
  transactionId?: string;
  date: string;
  receivedBy: string;
}

export interface Expense {
  id: string;
  amount: number;
  type: ExpenseType;
  description: string;
  date: string;
  createdBy: string;
}

export interface Order {
  id: string;
  refNumbers: {
    anjoli?: string;
    papiya?: string;
    mahabub?: string;
  };
  facebookLink?: string;
  customer: {
    name: string;
    phone: string;
    platform: 'Facebook' | 'WhatsApp';
    profileName: string;
    address: {
      village: string;
      union: string;
      thana: string;
      district: string;
    };
  };
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  discount: {
    type: 'fixed' | 'percentage';
    value: number;
    amount: number;
    reason: string;
  };
  delivery: {
    type: DeliveryType;
    charge: number;
    courierName?: string;
    trackingNumber?: string;
    status: OrderStatus;
    confirmationDate?: string;
  };
  payment: {
    status: PaymentStatus;
    method: string;
    paidAmount: number;
    dueAmount: number;
    receivedDate?: string;
    transactionId?: string;
    history?: PaymentEntry[];
  };
  financials: {
    netPayable: number;
    profit: number;
  };
  meta: {
    orderDate: string;
    proposedDeliveryDate: string;
    customerRequiredDate: string;
    receivedBy: string;
    notes: string;
    month: number;
    year: number;
  };
}

export interface AuditLog {
  id: string;
  targetId: string;
  module: 'Order' | 'Inventory' | 'Expense' | 'Category' | 'System' | 'Purchase';
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'PAYMENT' | 'STOCK_IN';
  oldState: string;
  newState: string;
  timestamp: string;
  changedBy: string;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  lastLogin?: string;
}
