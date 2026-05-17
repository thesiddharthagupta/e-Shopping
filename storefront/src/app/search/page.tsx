"use client"

import * as React from "react"
import { useSearchParams } from "next/navigation"
import { products, filterProducts } from "@/lib/products"
import { ProductCard } from "@/components/ui/ProductCard"

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""
  const filteredProducts = query ? filterProducts(products, undefined, query) : []

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="border-b border-border sticky top-0 z-30 page-header-band">
        <div className="container mx-auto px-4 md:px-6 py-6">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tighter mb-2 text-[#1a1a1a]">
            Search Results
          </h1>
          <p className="text-[#666666]">
            {query ? (
              <>
                Showing {filteredProducts.length} result{filteredProducts.length !== 1 ? "s" : ""} for{" "}
                <span className="font-semibold text-[#1a1a1a]">"{ query}"</span>
              </>
            ) : (
              "Enter a search query to find products"
            )}
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
          ) : query ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <h3 className="text-xl font-semibold mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try searching for something else
              </p>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  )
}
