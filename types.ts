
export type Category = string;

export interface Product {
  sku: string;
  name: string;
  price: number;
  category: Category;
  image_url: string;
  active: boolean;
  description?: string;
}

export interface CartItem {
  sku: string;
  name: string;
  price: number;
  qty: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'completed' | 'pending';
}

export type UserRole = 'CONSUMER' | 'OWNER';

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  history: Order[];
}

export interface AdminSettings {
  vatRate: number;
  deliveryFee: number;
  ownerEmail: string;
  isLocked: boolean;
  categories: Category[];
}

export interface InvoiceData {
  items: CartItem[];
  subtotal: number;
  vat: number;
  delivery: number;
  total: number;
}
