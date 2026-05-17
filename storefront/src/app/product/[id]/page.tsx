import { Metadata } from "next"
import { notFound } from "next/navigation"
import { MOCK_PRODUCTS } from "@/lib/mock-data"
import { ProductGallery } from "./ProductGallery"
import { ProductInfo } from "./ProductInfo"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = MOCK_PRODUCTS.find((p) => p.id === id)

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
  const product = MOCK_PRODUCTS.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Product Images Gallery */}
        <ProductGallery images={product.images} productName={product.name} />
        
        {/* Product Details & Add to Cart */}
        <ProductInfo product={product} />
      </div>
    </div>
  )
}
