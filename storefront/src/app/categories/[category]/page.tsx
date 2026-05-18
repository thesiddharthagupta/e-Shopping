import * as React from "react"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ProductCard } from "@/components/ui/ProductCard"
import { Product } from "@/lib/products"

export const dynamic = "force-dynamic"

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params
  const categorySlug = resolvedParams.category

  // 1. Fetch category and associated products from SQLite database
  const categoryData = await db.category.findUnique({
    where: { slug: categorySlug },
    include: {
      products: {
        include: { category: true },
        orderBy: { createdAt: "desc" }
      }
    }
  })

  // 2. Fallback to 404 if category is not found in database
  if (!categoryData) {
    notFound()
  }

  // 3. Map database products to the storefront interface
  const mappedProducts: Product[] = categoryData.products.map((p) => {
    let parsedImages: string[] = ["/placeholder-1.webp"]
    let parsedSizes: string[] = ["One Size"]
    let parsedColors: Array<{ name: string; hex: string }> = [{ name: "Default", hex: "#cccccc" }]

    try {
      if (p.images) parsedImages = JSON.parse(p.images)
    } catch (e) {
      console.error(`Failed to parse images for product ${p.id}`)
    }

    try {
      if (p.sizes) parsedSizes = JSON.parse(p.sizes)
    } catch (e) {
      console.error(`Failed to parse sizes for product ${p.id}`)
    }

    try {
      if (p.colors) parsedColors = JSON.parse(p.colors)
    } catch (e) {
      console.error(`Failed to parse colors for product ${p.id}`)
    }

    return {
      id: p.id,
      name: p.name,
      price: p.price,
      originalPrice: p.originalPrice || undefined,
      category: (p.category?.slug as any) || "accessories",
      image: parsedImages[0] || "/placeholder-1.webp",
      description: p.description,
      rating: p.rating,
      reviews: p.reviewCount,
      inStock: p.inStock,
      isNew: p.isNew,
      colors: parsedColors,
      sizes: parsedSizes,
    }
  })

  return (
    <div className="min-h-screen bg-[#fdfdfd] pt-32 pb-16 font-sans">
      
      {/* Header Band */}
      <section className="border-b border-border sticky top-0 z-30 page-header-band py-6 mb-12">
        <div className="container mx-auto px-4 md:px-6">
          <span className="text-xs uppercase tracking-widest text-[#064e3b] font-bold">Category Collection</span>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a1a] mt-1">
            {categoryData.name} Collection
          </h1>
          <p className="text-[#666666] text-sm mt-1 font-medium">
            {categoryData.description || `Browse modern premium products inside our ${categoryData.name} collection.`}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 md:px-6">
        {mappedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {mappedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-neutral-200 rounded-2xl bg-white max-w-xl mx-auto">
            <h3 className="text-lg font-bold mb-1 text-neutral-800">No products found</h3>
            <p className="text-xs text-neutral-400 font-medium max-w-xs px-4">
              Check back soon. We are cataloging new luxury garments inside this category.
            </p>
          </div>
        )}
      </section>

    </div>
  )
}
