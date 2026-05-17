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
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80",
    description: "Elegant white t-shirt made from 100% organic cotton.",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    isNew: true,
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "Heather Grey", hex: "#e5e7eb" }
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "2",
    name: "Black Slim Fit Jeans",
    price: 89.99,
    category: "men",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80",
    description: "Classic black jeans with a modern slim fit.",
    rating: 4.8,
    reviews: 256,
    inStock: true,
    colors: [
      { name: "Black", hex: "#000000" },
      { name: "Dark Indigo", hex: "#1e3a8a" }
    ],
    sizes: ["30", "32", "34", "36"]
  },
  {
    id: "3",
    name: "Minimalist Sweater",
    price: 79.99,
    originalPrice: 99.99,
    category: "women",
    image: "https://images.unsplash.com/photo-1574164904299-3a102b110380?w=600&auto=format&fit=crop&q=80",
    description: "Soft wool blend sweater in neutral tones.",
    rating: 4.6,
    reviews: 189,
    inStock: true,
    isNew: true,
    colors: [
      { name: "Beige", hex: "#f5f5dc" },
      { name: "Sage", hex: "#8fbc8f" }
    ],
    sizes: ["XS", "S", "M", "L"]
  },
  {
    id: "4",
    name: "Casual White Sneakers",
    price: 119.99,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80",
    description: "Comfortable and stylish white leather sneakers.",
    rating: 4.7,
    reviews: 342,
    inStock: true,
    colors: [
      { name: "White", hex: "#ffffff" },
      { name: "White/Black", hex: "#e5e7eb" }
    ],
    sizes: ["8", "9", "10", "11"]
  },
  {
    id: "5",
    name: "Wool Blend Coat",
    price: 199.99,
    originalPrice: 249.99,
    category: "women",
    image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=600&auto=format&fit=crop&q=80",
    description: "Elegant wool blend coat perfect for any season.",
    rating: 4.9,
    reviews: 95,
    inStock: true,
    isNew: true,
    colors: [
      { name: "Camel", hex: "#c19a6b" },
      { name: "Charcoal", hex: "#36454f" }
    ],
    sizes: ["S", "M", "L"]
  },
  {
    id: "6",
    name: "Oxford Dress Shirt",
    price: 74.99,
    category: "men",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80",
    description: "Classic oxford cloth dress shirt for formal occasions.",
    rating: 4.4,
    reviews: 167,
    inStock: true,
    colors: [
      { name: "Light Blue", hex: "#add8e6" },
      { name: "White", hex: "#ffffff" }
    ],
    sizes: ["S", "M", "L", "XL"]
  },
  {
    id: "7",
    name: "Canvas Backpack",
    price: 89.99,
    originalPrice: 109.99,
    category: "accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80",
    description: "Durable canvas backpack with leather accents.",
    rating: 4.6,
    reviews: 203,
    inStock: true,
    colors: [
      { name: "Olive Green", hex: "#556b2f" },
      { name: "Khaki", hex: "#f0e68c" }
    ],
    sizes: ["One Size"]
  },
  {
    id: "8",
    name: "Summer Linen Dress",
    price: 99.99,
    category: "women",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80",
    description: "Breathable linen dress perfect for warm weather.",
    rating: 4.5,
    reviews: 134,
    inStock: true,
    isNew: true,
    colors: [
      { name: "Lavender", hex: "#e6e6fa" },
      { name: "Mint Green", hex: "#98ff98" }
    ],
    sizes: ["XS", "S", "M", "L"]
  }
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
