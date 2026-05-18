import * as React from "react"
import Link from "next/link"
import { ArrowRight, ShoppingBag, Sparkles, ShieldCheck, RefreshCw } from "lucide-react"
import { db } from "@/lib/db"
import { ProductCard } from "@/components/ui/ProductCard"
import { Button } from "@/components/ui/Button"
import { Product } from "@/lib/products"

export const dynamic = "force-dynamic"

export default async function StorefrontHomepage() {
  // 1. Fetch live categories from database
  const dbCategories = await db.category.findMany({
    orderBy: { name: "asc" },
  })

  // 2. Fetch latest 4 "New Arrival" products from database
  const dbNewProducts = await db.product.findMany({
    where: { isNew: true },
    include: { category: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  })

  // Map database products to the storefront interface
  const newArrivals: Product[] = dbNewProducts.map((p) => {
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

  // Category visual card backgrounds (luxury gradients instead of image placeholders)
  const categoryGradients: Record<string, string> = {
    men: "from-[#141e30] to-[#243b55]",
    women: "from-[#e65c00] to-[#f9d423]",
    accessories: "from-[#3a6073] to-[#3a6073]/80",
  }

  const categoryVisuals = dbCategories.map((c) => ({
    ...c,
    gradient: categoryGradients[c.slug] || "from-neutral-800 to-neutral-600",
  }))

  return (
    <div className="flex flex-col min-h-screen bg-[#fdfdfd] text-[#171717] font-sans">
      
      {/* 1. HERO BAND (Luxury Brand Accent) */}
      <section className="relative h-[85vh] w-full flex items-center justify-center overflow-hidden border-b border-neutral-100 bg-[#f9f9f9]">
        {/* Subtle high-end backdrop pattern */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center max-w-4xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-[#064e3b]/5 text-[#064e3b] uppercase tracking-widest mb-6 animate-pulse-subtle">
            <Sparkles className="h-3.5 w-3.5" /> High-End Everyday Essentials
          </span>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-6 leading-none text-[#171717]">
            Crafted for <br />
            <span className="text-[#064e3b] italic font-serif">Simplicity.</span>
          </h1>
          
          <p className="max-w-xl text-neutral-500 text-base md:text-lg mb-10 leading-relaxed font-medium">
            Explore carefully structured shapes, natural premium textures, and contemporary garments designed to stand the test of time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/shop" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-[#064e3b] text-white hover:bg-[#043d2e] h-13 px-8 rounded-xl font-semibold shadow-md shadow-[#064e3b]/10 transition-all duration-200 active:scale-98">
                Explore Catalog
              </Button>
            </Link>
            <Link href="/shop?category=men" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-neutral-200 text-neutral-700 hover:border-neutral-400 h-13 px-8 rounded-xl font-semibold transition-all duration-200 active:scale-98 bg-white">
                Menswear
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. LIVE CATEGORIES SECTION (Phase 3 Dynamism) */}
      <section className="py-24 border-b border-neutral-100">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-16">
            <span className="text-xs uppercase tracking-widest text-[#064e3b] font-bold">Curated Collections</span>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#171717] mt-3">
              Shop by Category
            </h2>
            <p className="text-neutral-400 text-sm max-w-sm mt-2 font-medium">
              Find exactly what you need, tailored to the season's aesthetics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categoryVisuals.map((cat) => (
              <Link 
                key={cat.id} 
                href={`/shop?category=${cat.slug}`}
                className="group relative h-[450px] overflow-hidden rounded-2xl border border-neutral-100 shadow-[0_4px_20px_rgb(0,0,0,0.01)] block"
              >
                {/* Decorative Visual Backdrop */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-95 group-hover:scale-105 transition-all duration-500 z-0`} />
                
                {/* Clean Mesh Grid Overlay */}
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors z-10" />

                {/* Text & Action Panel */}
                <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col justify-end h-1/2 bg-gradient-to-t from-black/60 via-black/25 to-transparent text-white">
                  <h3 className="text-2xl font-bold tracking-tight text-white mb-2">
                    {cat.name} Collection
                  </h3>
                  <p className="text-xs text-white/70 mb-4 line-clamp-2 leading-relaxed font-medium">
                    {cat.description}
                  </p>
                  <span className="text-xs font-bold flex items-center gap-1.5 hover:underline text-white w-fit tracking-wider uppercase">
                    Explore collection <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. DYNAMIC NEW ARRIVALS (Live DB Sync) */}
      <section className="py-24 bg-[#fafafa]">
        <div className="container px-4 md:px-6">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#064e3b] font-bold">Just Dropped</span>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#171717] mt-3">
                New Arrivals
              </h2>
              <p className="text-neutral-400 text-sm mt-1.5 font-medium">
                The latest dynamic seasonal garments, direct from our merchant control panel.
              </p>
            </div>
            
            <Link href="/shop">
              <Button variant="outline" className="border-neutral-200 hover:border-neutral-400 rounded-xl font-semibold bg-white">
                View All Collections <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>

          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-400 font-semibold text-sm border border-dashed border-neutral-200 rounded-2xl bg-white">
              No new arrivals marked in the database. Add and tag items in the admin control dashboard!
            </div>
          )}

        </div>
      </section>

      {/* 4. VALUE PROPOSITION SECTION */}
      <section className="py-20 bg-white border-t border-neutral-100">
        <div className="container px-4 md:px-6 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Prop 1 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#064e3b]/5 flex items-center justify-center text-[#064e3b]">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider">Premium Materials</h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                We select only the finest organic linens, cottons, and wool blends to assure absolute tactile excellence.
              </p>
            </div>

            {/* Prop 2 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#064e3b]/5 flex items-center justify-center text-[#064e3b]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider">Simulated Dispatch</h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Test checkout workflows with secure credit simulations and track invoice statuses from the admin control deck.
              </p>
            </div>

            {/* Prop 3 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="h-12 w-12 rounded-full bg-[#064e3b]/5 flex items-center justify-center text-[#064e3b]">
                <RefreshCw className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-neutral-800 text-sm uppercase tracking-wider">Dynamic Revisions</h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-medium">
                Create new products, modify colors, track sales totals, and manage order dispatches synchronously.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  )
}
