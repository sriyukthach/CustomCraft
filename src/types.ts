export type ProductCategory = 'ALL' | 'T-SHIRTS' | 'HOODIES' | 'ACCESSORIES';

export type TShirtColor = 'Black' | 'White' | 'Navy Blue' | 'Pink' | 'Grey';

export type TShirtSize = 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type PrintType = 'Standard Print' | 'Premium Print';

export type DesignOptionId = 'none' | 'minimal-star' | 'lightning' | 'floral' | 'abstract' | 'heart' | 'initials';

export interface DesignOption {
  id: DesignOptionId;
  name: string;
  price: number;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'T-SHIRTS' | 'HOODIES' | 'ACCESSORIES';
  base_price: number;
  image: string;
  description: string;
  stock: number;
  rating?: number;
  reviews_count?: number;
  available_sizes: TShirtSize[];
  available_colors: TShirtColor[];
}

export interface CustomizationState {
  productId: string;
  color: TShirtColor;
  size: TShirtSize;
  customText: string;
  textStyle: 'modern' | 'varsity' | 'serif' | 'script';
  textColor: 'white' | 'charcoal' | 'gold' | 'soft-pink';
  design: DesignOptionId;
  printType: PrintType;
}

export interface CartItem {
  cart_item_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  color: TShirtColor;
  size: TShirtSize;
  custom_text: string;
  text_style?: string;
  text_color?: string;
  design: string;
  print_type: PrintType;
  quantity: number;
  base_price: number;
  text_charge: number;
  design_charge: number;
  print_charge: number;
  unit_price: number;
  total_price: number;
}

export interface CustomerDetails {
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  payment_method: 'UPI' | 'Card' | 'Cash on Delivery';
}

export interface OrderItem {
  id: number | string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image?: string;
  quantity: number;
  color: string;
  size: string;
  custom_text: string;
  design: string;
  print_type: string;
  price: number;
}

export interface Order {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total_amount: number;
  status: 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered';
  created_at: string;
  items?: OrderItem[];
}
