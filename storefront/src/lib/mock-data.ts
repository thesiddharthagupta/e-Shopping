export type Product = {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  images: string[]
  sizes: string[]
  colors: { name: string; hex: string }[]
  isNew?: boolean
  rating: number
  reviewCount: number
}

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1",
    name: "Essential Cotton T-Shirt",
    description: "A premium everyday t-shirt made from 100% organic cotton. Features a relaxed fit and incredibly soft feel.",
    price: 35.00,
    category: "Men",
    images: [
      "/placeholder-1.webp",
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Black", hex: "#000000" },
      { name: "Navy", hex: "#1e3a8a" },
    ],
    isNew: true,
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: "prod-2",
    name: "Relaxed Fit Linen Trousers",
    description: "Breathable and lightweight linen trousers perfect for summer days or lounging at home.",
    price: 85.00,
    originalPrice: 110.00,
    category: "Women",
    images: [
      "/placeholder-2.webp",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Beige", hex: "#f5f5dc" },
      { name: "Olive", hex: "#808000" },
    ],
    rating: 4.5,
    reviewCount: 89
  },
  {
    id: "prod-3",
    name: "Classic Denim Jacket",
    description: "A timeless denim jacket with silver-tone hardware and a slightly distressed wash.",
    price: 120.00,
    category: "Unisex",
    images: [
      "/placeholder-3.webp",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Light Wash", hex: "#add8e6" },
      { name: "Dark Wash", hex: "#00008b" },
    ],
    rating: 4.9,
    reviewCount: 342
  },
  {
    id: "prod-4",
    name: "Silk Slip Dress",
    description: "Elegant midi-length slip dress crafted from 100% mulberry silk. Bias cut for a flattering drape.",
    price: 150.00,
    category: "Women",
    images: [
      "/placeholder-4.webp",
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: [
      { name: "Champagne", hex: "#fad6a5" },
      { name: "Black", hex: "#000000" },
    ],
    isNew: true,
    rating: 4.7,
    reviewCount: 56
  },
  {
    id: "prod-5",
    name: "Heavyweight Pullover Hoodie",
    description: "Cozy and durable hoodie with a brushed interior and kangaroo pocket.",
    price: 75.00,
    category: "Men",
    images: [
      "/placeholder-5.webp",
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Heather Grey", hex: "#9ca3af" },
      { name: "Forest Green", hex: "#064e3b" },
    ],
    rating: 4.6,
    reviewCount: 210
  }
]

export const CATEGORIES = [
  "All", "Men", "Women", "Unisex", "Accessories", "New Arrivals"
]

export const SIZES = ["XS", "S", "M", "L", "XL", "XXL"]
