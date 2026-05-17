"use client"

import * as React from "react"
import { products } from "@/lib/products"
import { ProductCard } from "@/components/ui/ProductCard"

export default function NewArrivalsPage() {
  const newProducts = products.filter((p) => p.isNew)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border sticky top-0 z-30 page-header-band">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2 text-[#1a1a1a]">
            New Arrivals
          </h1>
          <p className="text-[#666666]">
            Discover the latest additions to our collection
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="page-content-band">
        <div className="container mx-auto px-4 md:px-6 py-8">
          {newProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-semibold mb-2">No new arrivals yet</h3>
              <p className="text-muted-foreground">
                Check back soon for exciting new products
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
