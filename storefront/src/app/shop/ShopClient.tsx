"use client"

import * as React from "react"
import { Product, CATEGORIES, SIZES } from "@/lib/mock-data"
import { ProductCard } from "@/components/product/ProductCard"
import { Button } from "@/components/ui/Button"
import { SlidersHorizontal, ChevronDown } from "lucide-react"

interface ShopClientProps {
  initialProducts: Product[]
}

export function ShopClient({ initialProducts }: ShopClientProps) {
  const [products, setProducts] = React.useState<Product[]>(initialProducts)
  const [activeCategory, setActiveCategory] = React.useState<string>("All")
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = React.useState(false)

  // Filter Logic
  React.useEffect(() => {
    if (activeCategory === "All") {
      setProducts(initialProducts)
    } else {
      setProducts(initialProducts.filter((p) => p.category === activeCategory))
    }
  }, [activeCategory, initialProducts])

  return (
    <div className="w-full flex flex-col md:flex-row gap-8">
      {/* Mobile Filter Toggle */}
      <div className="md:hidden w-full flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight">Shop</h1>
        <Button variant="outline" size="sm" onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}>
          <SlidersHorizontal className="mr-2 h-4 w-4" /> Filters
        </Button>
      </div>

      {/* Sidebar Filters (Desktop & Mobile) */}
      <aside className={`w-full md:w-64 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
        <div className="sticky top-24 space-y-8">
          <div className="hidden md:block">
            <h1 className="text-3xl font-bold tracking-tight mb-2">Shop All</h1>
            <p className="text-muted-foreground mb-8">Showing {products.length} results</p>
          </div>

          {/* Categories Filter */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Categories</h3>
            <ul className="space-y-2">
              {CATEGORIES.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => setActiveCategory(category)}
                    className={`text-sm hover:text-accent transition-colors ${
                      activeCategory === category ? "font-bold text-accent" : "text-muted-foreground"
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="h-px bg-border w-full" />

          {/* Sizes Filter (Visual only for now) */}
          <div>
            <h3 className="font-semibold mb-4 text-lg">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {SIZES.map((size) => (
                <Button key={size} variant="outline" size="sm" className="h-10">
                  {size}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* Product Grid */}
      <main className="flex-1">
        <div className="flex items-center justify-between mb-6 hidden md:flex">
          <div /> {/* Spacer */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <Button variant="ghost" size="sm" className="font-medium">
              Featured <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center text-muted-foreground">
            No products found matching your criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
