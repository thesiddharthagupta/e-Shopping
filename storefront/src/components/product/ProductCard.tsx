import Link from "next/link"
import Image from "next/link" // actually use next/image later, or just a div for now since we don't have images
import { Product } from "@/lib/mock-data"
import { Card, CardContent, CardFooter } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { ShoppingCart } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden border-border/50 bg-background transition-colors hover:border-border">
      <Link href={`/product/${product.id}`}>
        <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
          {/* Placeholder for Product Image */}
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30">
            <span className="text-sm font-medium uppercase tracking-widest">{product.category}</span>
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity group-hover:opacity-100" />
          
          {/* Badges */}
          <div className="absolute left-3 top-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">
                NEW
              </span>
            )}
            {product.originalPrice && (
              <span className="bg-accent px-2 py-1 text-xs font-semibold text-accent-foreground">
                SALE
              </span>
            )}
          </div>
        </div>
      </Link>
      
      <CardContent className="p-4">
        <div className="mb-1 text-xs text-muted-foreground">{product.category}</div>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold line-clamp-1 hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">${product.price.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Button className="w-full gap-2 transition-transform active:scale-95" variant="outline">
          <ShoppingCart className="h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}
