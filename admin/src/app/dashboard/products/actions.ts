"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function createProductAction(formData: FormData) {
  const name = formData.get("name") as string
  const priceStr = formData.get("price") as string
  const originalPriceStr = formData.get("originalPrice") as string
  const categoryId = formData.get("categoryId") as string
  const description = formData.get("description") as string
  const inStock = formData.get("inStock") === "true"
  const isNew = formData.get("isNew") === "true"

  // Collect sizes
  const sizes = formData.getAll("sizes") as string[]
  
  // Collect colors
  const colorNames = formData.getAll("colorNames") as string[]
  const colorHexes = formData.getAll("colorHexes") as string[]
  
  const colors = colorNames.map((name, i) => ({
    name,
    hex: colorHexes[i] || "#cccccc"
  })).filter(c => c.name.trim() !== "")

  // Product validation
  if (!name || !priceStr || !categoryId || !description) {
    return { success: false, error: "Please fill in all required fields." }
  }

  const price = parseFloat(priceStr)
  if (isNaN(price)) {
    return { success: false, error: "Invalid price value." }
  }

  const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null

  try {
    const defaultImages = ["/placeholder-1.webp"] // Fallback image for simulation

    await db.product.create({
      data: {
        name,
        description,
        price,
        originalPrice,
        categoryId,
        inStock,
        isNew,
        images: JSON.stringify(defaultImages),
        sizes: JSON.stringify(sizes.length > 0 ? sizes : ["One Size"]),
        colors: JSON.stringify(colors.length > 0 ? colors : [{ name: "Default", hex: "#cccccc" }]),
        rating: 5.0,
        reviewCount: 0,
      }
    })

    revalidatePath("/dashboard/products")
    return { success: true }
  } catch (error) {
    console.error("Failed to create product:", error)
    return { success: false, error: "Failed to save product in database." }
  }
}

export async function updateProductAction(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const priceStr = formData.get("price") as string
  const originalPriceStr = formData.get("originalPrice") as string
  const categoryId = formData.get("categoryId") as string
  const description = formData.get("description") as string
  const inStock = formData.get("inStock") === "true"
  const isNew = formData.get("isNew") === "true"

  // Collect sizes
  const sizes = formData.getAll("sizes") as string[]
  
  // Collect colors
  const colorNames = formData.getAll("colorNames") as string[]
  const colorHexes = formData.getAll("colorHexes") as string[]
  
  const colors = colorNames.map((name, i) => ({
    name,
    hex: colorHexes[i] || "#cccccc"
  })).filter(c => c.name.trim() !== "")

  // Product validation
  if (!name || !priceStr || !categoryId || !description) {
    return { success: false, error: "Please fill in all required fields." }
  }

  const price = parseFloat(priceStr)
  if (isNaN(price)) {
    return { success: false, error: "Invalid price value." }
  }

  const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null

  try {
    await db.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        originalPrice,
        categoryId,
        inStock,
        isNew,
        sizes: JSON.stringify(sizes.length > 0 ? sizes : ["One Size"]),
        colors: JSON.stringify(colors.length > 0 ? colors : [{ name: "Default", hex: "#cccccc" }]),
      }
    })

    revalidatePath("/dashboard/products")
    return { success: true }
  } catch (error) {
    console.error("Failed to update product:", error)
    return { success: false, error: "Failed to update product in database." }
  }
}

export async function deleteProductAction(id: string) {
  try {
    // Delete any associated order items first to avoid foreign key constraints
    await db.orderItem.deleteMany({
      where: { productId: id }
    })

    await db.product.delete({
      where: { id }
    })

    revalidatePath("/dashboard/products")
    return { success: true }
  } catch (error) {
    console.error("Failed to delete product:", error)
    return { success: false, error: "Failed to delete product from database." }
  }
}
