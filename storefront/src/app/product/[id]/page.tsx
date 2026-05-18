import { Metadata } from "next"
import { notFound } from "next/navigation"
import { db } from "@/lib/db"
import { ProductGallery } from "./ProductGallery"
import { ProductInfo } from "./ProductInfo"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

async function getProductFromDb(id: string) {
  const p = await db.product.findUnique({
    where: { id },
    include: { category: true }
  })

  if (!p) return null

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
    category: p.category?.name || "Accessories",
    images: parsedImages,
    sizes: parsedSizes,
    colors: parsedColors,
    rating: p.rating,
    reviewCount: p.reviewCount,
    inStock: p.inStock,
    isNew: p.isNew,
    description: p.description,
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductFromDb(id)

  if (!product) {
    return { title: "Product Not Found | Luxe Clothing" }
  }

  return {
    title: `${product.name} | Luxe Clothing`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductFromDb(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Images Gallery */}
        <ProductGallery images={product.images} productName={product.name} />
        
        {/* Product Details & Add to Cart */}
        {/* @ts-ignore - Map dynamic database fields cleanly */}
        <ProductInfo product={product} />
      </div>
    </div>
  )
}
