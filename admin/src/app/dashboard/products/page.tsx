import * as React from "react"
import { db } from "@/lib/db"
import { ProductsClient } from "./ProductsClient"

export const dynamic = "force-dynamic"

export default async function AdminProductsPage() {
  // 1. Fetch live categories and products from the database
  const dbCategories = await db.category.findMany({
    orderBy: { name: "asc" }
  })

  const dbProducts = await db.product.findMany({
    include: {
      category: true
    },
    orderBy: {
      createdAt: "desc"
    }
  })

  // 2. Map and parse SQLite JSON array strings back to JavaScript arrays
  const mappedProducts = dbProducts.map((p) => {
    let parsedSizes: string[] = ["One Size"]
    let parsedColors: Array<{ name: string; hex: string }> = [{ name: "Default", hex: "#cccccc" }]

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
      originalPrice: p.originalPrice,
      categoryId: p.categoryId,
      categoryName: p.category?.name || "Accessories",
      inStock: p.inStock,
      isNew: p.isNew,
      description: p.description,
      sizes: parsedSizes,
      colors: parsedColors,
    }
  })

  const categories = dbCategories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug
  }))

  return (
    <ProductsClient 
      products={mappedProducts} 
      categories={categories} 
    />
  )
}
