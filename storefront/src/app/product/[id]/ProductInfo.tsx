"use client"

import * as React from "react"
import { Product } from "@/lib/mock-data"
import { Button } from "@/components/ui/Button"
import { ShoppingCart, Heart, Share2, Star } from "lucide-react"

export function ProductInfo({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = React.useState<string | null>(null)
  const [selectedColor, setSelectedColor] = React.useState<string | null>(null)
  const [quantity, setQuantity] = React.useState(1)

  return (
    <div className="flex flex-col">
      {/* Category & Title */}
      <div className="mb-6">
        <div className="text-sm text-muted-foreground uppercase tracking-widest mb-2">{product.category}</div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{product.name}</h1>
        
        {/* Ratings */}
        <div className="flex items-center gap-2 text-sm">
          <div className="flex items-center text-accent">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className={`h-4 w-4 ${star <= Math.round(product.rating) ? 'fill-current' : 'text-muted-foreground'}`} />
            ))}
          </div>
          <span className="font-medium">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-4 mb-8">
        <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
        {product.originalPrice && (
          <span className="text-xl text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
        )}
      </div>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed mb-8">
        {product.description}
      </p>

      {/* Colors */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold">Color: {selectedColor || "Select"}</span>
        </div>
        <div className="flex gap-3">
          {product.colors.map((color) => (
            <button
              key={color.name}
              onClick={() => setSelectedColor(color.name)}
              className={`h-10 w-10 rounded-full border-2 transition-all ${
                selectedColor === color.name ? "border-primary scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: color.hex }}
              title={color.name}
              aria-label={`Select ${color.name} color`}
            />
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold">Size: {selectedSize || "Select"}</span>
          <button className="text-sm text-muted-foreground underline hover:text-primary transition-colors">
            Size Guide
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {product.sizes.map((size) => (
            <Button
              key={size}
              variant={selectedSize === size ? "default" : "outline"}
              onClick={() => setSelectedSize(size)}
              className="h-12 text-base"
            >
              {size}
            </Button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        {/* Quantity selector could go here */}
        <Button size="lg" className="flex-1 h-14 text-lg">
          <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
        </Button>
        <Button size="icon" variant="outline" className="h-14 w-14 shrink-0">
          <Heart className="h-6 w-6" />
        </Button>
      </div>
      
      {/* Meta */}
      <div className="border-t border-border pt-6 mt-4 flex items-center justify-between text-sm text-muted-foreground">
        <div><span className="font-medium text-foreground">SKU:</span> {product.id}</div>
        <button className="flex items-center gap-2 hover:text-foreground transition-colors">
          <Share2 className="h-4 w-4" /> Share
        </button>
      </div>
    </div>
  )
}
