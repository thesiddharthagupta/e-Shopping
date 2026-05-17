export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: "women" | "men" | "accessories"
  image: string
  description: string
  rating: number
  reviews: number
  inStock: boolean
  isNew?: boolean
  colors: Array<{ name: string; hex: string }>
  sizes: string[]
}

export const products: Product[] = [
  {
    id: "1",
    name: "Premium White T-Shirt",
    price: 49.99,
    originalPrice: 69.99,
    category: "men",
    image: "/images/product-1.jpg",
    description: "Elegant white t-shirt made from 100% organic cotton.",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    isNew: true,
  },
  {
    id: "2",
    name: "Black Slim Fit Jeans",
    price: 89.99,
    category: "men",
    image: "/images/product-2.jpg",
    description: "Classic black jeans with a modern slim fit.",
    rating: 4.8,
    reviews: 256,
    inStock: true,
  },
  {
    id: "3",
    name: "Minimalist Sweater",
    price: 79.99,
    originalPrice: 99.99,
    category: "women",
    image: "/images/product-3.jpg",
    description: "Soft wool blend sweater in neutral tones.",
    rating: 4.6,
    reviews: 189,
    inStock: true,
    isNew: true,
  },
  {
    id: "4",
    name: "Casual White Sneakers",
    price: 119.99,
    category: "accessories",
    image: "/images/product-4.jpg",
    description: "Comfortable and stylish white leather sneakers.",
    rating: 4.7,
    reviews: 342,
    inStock: true,
  },
  {
    id: "5",
    name: "Wool Blend Coat",
    price: 199.99,
    originalPrice: 249.99,
    category: "women",
    image: "/images/product-5.jpg",
    description: "Elegant wool blend coat perfect for any season.",
    rating: 4.9,
    reviews: 95,
    inStock: true,
    isNew: true,
  },
  {
    id: "6",
    name: "Oxford Dress Shirt",
    price: 74.99,
    category: "men",
    image: "/images/product-6.jpg",
    description: "Classic oxford cloth dress shirt for formal occasions.",
    rating: 4.4,
    reviews: 167,
    inStock: true,
  },
  {
    id: "7",
    name: "Canvas Backpack",
    price: 89.99,
    originalPrice: 109.99,
    category: "accessories",
    image: "/images/product-7.jpg",
    description: "Durable canvas backpack with leather accents.",
    rating: 4.6,
    reviews: 203,
    inStock: true,
  },
  {
    id: "8",
    name: "Summer Linen Dress",
    price: 99.99,
    category: "women",
    image: "/images/product-8.jpg",
    description: "Breathable linen dress perfect for warm weather.",
    rating: 4.5,
    reviews: 134,
    inStock: true,
    isNew: true,
  },
]

export function filterProducts(
  products: Product[],
  category?: string,
  searchQuery?: string
): Product[] {
  return products.filter((product) => {
    const matchesCategory = !category || product.category === category
    const matchesSearch =
      !searchQuery ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })
}
