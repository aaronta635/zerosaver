// Shared TypeScript interfaces for ZeroSaver app

export interface Deal {
  id: string
  vendorId: string
  vendor: string
  title: string
  description: string
  imageUrl: string
  category: string
  diet: string[]
  originalPrice: number
  price: number
  quantity: number
  minOrderQty: number
  distanceKm: number
  pickupAddress: string
  pickupNotes: string
  pickupStart: string
  pickupEnd: string
  bestBefore: string
  createdAt: string
  expiresAt: string
  allergens: string[]
  coldChain: boolean
  b2b: boolean
  rating: number
  tags: string[]
  is_active?: boolean
  ready_time?: string
  restaurant_name?: string
  image_url?: string
  created_at?: string
  updated_at?: string
}

export interface Partner {
  id: string
  name: string
  approved: boolean
  type: string
  category?: string
  email?: string
  phone?: string
  address?: string
  status?: string
  joinDate?: string
  totalDeals?: number
  rating?: number
}

export interface CartItem {
  dealId: string
  qty: number
  title: string
  price: number
  vendor: string
}

export interface Order {
  dealId: string
  title: string
  qty: number
}

export interface Feedback {
  id: number
  orderId: string
  dealId: string
  customerId: string
  customerName: string
  customerEmail: string
  partnerId: string
  partnerName: string
  dealTitle: string
  rating: number
  comment: string
  date: string
  response: string | null
}

export interface Filters {
  q: string
  cat: string
  diet: string
  maxKm: number
}

// Component Props
export interface HeaderProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  role: string
  setRole: (role: string) => void
  cartCount: number
}

export interface ExploreProps {
  deals: Deal[]
  filters: Filters
  setFilters: (filters: Filters) => void
  onReserve: (deal: Deal, qty?: number) => void
}

export interface PartnerDashboardProps {
  partners: Partner[]
  setPartners: (partners: Partner[]) => void
  addDeal: (deal: any) => void
  feedback: Feedback[]
  respondToFeedback: (feedbackId: number, response: string) => void
}

export interface CartProps {
  cart: CartItem[]
  removeItem: (dealId: string) => void
  checkout: () => void
  submitFeedback: (feedbackData: any) => void
}

export interface AdminProps {
  partners: Partner[]
  setPartners: (partners: Partner[]) => void
  feedback: Feedback[]
}

export interface AnalyticsProps {
  orders: Order[]
}

export interface CreateDealRequest {
  title: string
  restaurant_name: string
  description: string
  price: number  // in cents
  quantity: number
  pickup_address: string
  image_url?: string
  ready_time: string
}

export interface CreateDealResponse {
  id: string
  title: string
  restaurant_name: string
  description: string
  price: number
  quantity: number
  pickup_address: string
  image_url: string
  is_active: boolean
  ready_time: string
  created_at: string
  updated_at: string
}