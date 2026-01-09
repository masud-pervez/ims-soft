
import { Product, User, UserRole, DeliveryType, Category } from './types';

export const CATEGORIES: Category[] = [
  { id: 'CAT01', name: 'Electronics' },
  { id: 'CAT02', name: 'Fashion' },
  { id: 'CAT03', name: 'Home & Living' },
  { id: 'CAT04', name: 'Personal Care' }
];

export const INITIAL_PRODUCTS: Product[] = [
  { id: 'P001', name: 'Smart Watch X1', categoryId: 'CAT01', costPrice: 2000, sellingPrice: 3500, openingStock: 100, currentStock: 85, image: 'https://picsum.photos/seed/p1/400/400' },
  { id: 'P002', name: 'Wireless Buds Pro', categoryId: 'CAT01', costPrice: 1200, sellingPrice: 2200, openingStock: 200, currentStock: 150, image: 'https://picsum.photos/seed/p2/400/400' },
  { id: 'P003', name: 'Leather Wallet', categoryId: 'CAT02', costPrice: 500, sellingPrice: 950, openingStock: 50, currentStock: 12, image: 'https://picsum.photos/seed/p3/400/400' },
];

export const INITIAL_USERS: User[] = [
  { id: 'U001', name: 'Admin User', role: UserRole.ADMIN },
  { id: 'U002', name: 'Kabir Hossein', role: UserRole.ORDER_RECEIVER },
  { id: 'U003', name: 'Mitu Akter', role: UserRole.DELIVERY_MANAGER },
];

export const DELIVERY_CHARGES: Record<DeliveryType, number> = {
  [DeliveryType.INSIDE]: 60,
  [DeliveryType.OUTSIDE]: 120,
  [DeliveryType.URGENT]: 200,
};

export const DISTRICTS = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh', 'Comilla', 'Gazipur'
];

export const PAYMENT_METHODS = [
  'Cash on Delivery (COD)',
  'Cash (Direct)', 
  'bKash', 
  'Nagad', 
  'Rocket', 
  'Bank Transfer'
];
