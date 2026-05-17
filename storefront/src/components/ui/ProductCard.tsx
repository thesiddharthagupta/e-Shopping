"use client"

import * as React from "react"
import Link from "next/link"
import { ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardContent } from "@/components/ui/Card"
import { Product } from "@/lib/products"
import { useCart } from "@/lib/cart-context"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = React.useState(false)
  const [isAdding, setIsAdding] = React.useState(false)
  const { addToCart } = useCart()

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    
    // Check if product has colors and sizes
    if (!product.colors || !product.sizes || product.colors.length === 0 || product.sizes.length === 0) {
      return
    }

    setIsAdding(true)
    // Add with default first color and size
    addToCart(product, 1, product.sizes[0], product.colors[0].name)
    
    // Reset button state after brief delay
    setTimeout(() => setIsAdding(false), 1500)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
        <CardContent className="p-0">
          {/* Image Container */}
          <div className="relative overflow-hidden h-64 bg-secondary">
            <div className="w-full h-full bg-neutral-200 group-hover:scale-110 transition-transform duration-300" />
            
            {/* Badge */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              {product.isNew && (
                <span className="bg-accent text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  New
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
                  -{discountPercent}%
                </span>
              )}
            </div>

            {/* Favorite Button */}
            <button
              onClick={(e) => {
                e.preventDefault()
                setIsFavorite(!isFavorite)
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-neutral-400"}`}
              />
            </button>

            {/* Stock Status */}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <span className="text-white font-semibold">Out of Stock</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-4 bg-white">
            <h3 className="font-semibold text-sm mb-1 line-clamp-2 text-[#1a1a1a] group-hover:text-accent transition-colors">
              {product.name}
            </h3>
            
            <p className="text-xs text-[#999999] mb-3 capitalize">
              {product.category}
            </p>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-3">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-xs ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-[#999999]">({product.reviews})</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-[#1a1a1a]">${product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-[#999999] line-through">
                  ${product.originalPrice}
                </span>
              )}
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              size="sm"
              className="w-full"
              disabled={!product.inStock || isAdding}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isAdding ? "Added!" : "Add to Cart"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
