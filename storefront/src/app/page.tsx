import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full bg-secondary flex items-center justify-center overflow-hidden">
        {/* Placeholder for Hero Image - In a real app we'd use Next Image here with a real photo */}
        <div className="absolute inset-0 z-0 bg-neutral-200">
           {/* Fallback pattern or color if image fails to load */}
        </div>
        
        <div className="container relative z-10 px-4 md:px-6 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6">
            Elevate Your <span className="text-accent">Style.</span>
          </h1>
          <p className="max-w-[600px] text-lg md:text-xl text-muted-foreground mb-8">
            Discover the latest trends in fashion. Shop modern, high-quality clothing designed for everyday elegance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button size="lg" asChild className="w-full sm:w-auto text-md h-12 px-8">
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto text-md h-12 px-8">
              <Link href="/collections/new">New Arrivals</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories (Placeholder) */}
      <section className="py-24 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Shop by Category</h2>
            <p className="text-muted-foreground mt-4">Curated collections for your specific needs.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group relative h-[400px] overflow-hidden rounded-xl bg-secondary">
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors z-10" />
                <div className="absolute bottom-0 left-0 p-6 z-20">
                  <h3 className="text-2xl font-bold text-white mb-2">Category {i}</h3>
                  <Button variant="link" className="text-white p-0 h-auto font-semibold">Explore</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
