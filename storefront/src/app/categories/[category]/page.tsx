"use client"

import * as React from "react"
import { products, filterProducts } from "@/lib/products"
import { ProductCard } from "@/components/ui/ProductCard"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = React.use(params)
  const categoryValue = category as "women" | "men" | "accessories"
  const filteredProducts = filterProducts(products, categoryValue)

  const categoryTitles: Record<string, { title: string; description: string }> = {
    women: {
      title: "Women's Collection",
      description: "Discover our carefully curated collection of women's fashion",
    },
    men: {
      title: "Men's Collection",
      description: "Explore our exclusive range of men's clothing and accessories",
    },
    accessories: {
      title: "Accessories",
      description: "Complete your look with our premium accessories",
    },
  }

  const categoryInfo = categoryTitles[categoryValue] || { title: "Collection", description: "" }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border sticky top-0 z-30 page-header-band">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2 text-[#1a1a1a]">
            {categoryInfo.title}
          </h1>
          <p className="text-[#666666]">
            {categoryInfo.description}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="page-content-band">
        <div className="container mx-auto px-4 md:px-6 py-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Check back soon for new items in this category
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
