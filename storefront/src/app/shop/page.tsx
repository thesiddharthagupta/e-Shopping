"use client"

import * as React from "react"
import { products, filterProducts } from "@/lib/products"
import { ProductCard } from "@/components/ui/ProductCard"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Sliders } from "lucide-react"

export default function ShopPage() {
  const [filteredProducts, setFilteredProducts] = React.useState(products)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string>("")
  const [sortBy, setSortBy] = React.useState<"newest" | "price-low" | "price-high" | "rating">("newest")
  const [showFilters, setShowFilters] = React.useState(false)

  React.useEffect(() => {
    let result = filterProducts(products, selectedCategory || undefined, searchQuery)

    // Apply sorting
    if (sortBy === "price-low") {
      result = [...result].sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-high") {
      result = [...result].sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      result = [...result].sort((a, b) => b.rating - a.rating)
    } else if (sortBy === "newest") {
      result = [...result].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
    }

    setFilteredProducts(result)
  }, [searchQuery, selectedCategory, sortBy])

  const categories = [
    { value: "", label: "All Products" },
    { value: "women", label: "Women" },
    { value: "men", label: "Men" },
    { value: "accessories", label: "Accessories" },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border sticky top-0 z-40 page-header-band">
        <div className="container mx-auto px-4 md:px-6 py-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#1a1a1a]">Shop</h1>
              <p className="text-[#666666] mt-1">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {/* Sort and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 rounded-lg border border-border bg-white text-[#1a1a1a] text-sm font-medium hover:border-accent focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Sliders className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="page-content-band">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <aside
            className={`md:col-span-1 ${showFilters ? "block" : "hidden"} md:block space-y-6 bg-white p-6 rounded-lg border border-[#d9d6d1] h-fit`}
          >
            {/* Category Filter */}
            <div className="pb-4 border-b border-[#d9d6d1]">
              <h3 className="font-semibold mb-4 text-[#1a1a1a]">Categories</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className={`w-full text-sm px-3 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedCategory === cat.value
                        ? "bg-accent text-white shadow-md"
                        : "bg-white text-[#1a1a1a] border border-[#d9d6d1] hover:border-accent hover:bg-neutral-50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Search in Sidebar */}
            <div className="pb-4 border-b border-[#d9d6d1]">
              <h3 className="font-semibold mb-3 text-[#1a1a1a]">Search</h3>
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="text-sm"
              />
            </div>

            {/* Price Range (Placeholder) */}
            <div>
              <h3 className="font-semibold mb-4 text-[#1a1a1a]">Price Range</h3>
              <div className="text-sm text-[#666666] px-3 py-2 bg-neutral-50 rounded-lg border border-[#d9d6d1]">
                $0 - $500+
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="md:col-span-3">
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <h3 className="text-xl font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            )}
          </main>
          </div>
        </div>
      </section>
    </div>
  )
}
