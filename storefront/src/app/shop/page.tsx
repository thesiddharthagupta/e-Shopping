import * as React from "react"
import { db } from "@/lib/db"
import { ShopClient } from "./ShopClient"
import { Product } from "@/lib/products"

// Force dynamic rendering to query the database on every request
export const dynamic = "force-dynamic"

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category } = await searchParams

  // Query all active products from SQLite with their category data
  const dbProducts = await db.product.findMany({
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  // Map database structures to fit storefront interface
  const mappedProducts: Product[] = dbProducts.map((p) => {
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

  return <ShopClient initialProducts={mappedProducts} initialCategory={category || ""} />
}
