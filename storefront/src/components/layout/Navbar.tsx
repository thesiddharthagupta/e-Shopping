"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Search, ShoppingCart, Menu, X, User } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/Button"
import { useCart } from "@/lib/cart-context"

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { totalItems } = useCart()
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isNavVisible, setIsNavVisible] = React.useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [isSearchOpen, setIsSearchOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const lastScrollY = React.useRef(0)

  const shouldAutoHideNavbar =
    pathname === "/shop" ||
    pathname === "/collections/new" ||
    pathname.startsWith("/categories/")

  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsScrolled(currentScrollY > 20)

      if (!shouldAutoHideNavbar || isMobileMenuOpen || isSearchOpen) {
        setIsNavVisible(true)
        lastScrollY.current = currentScrollY
        return
      }

      if (currentScrollY <= 80) {
        setIsNavVisible(true)
      } else if (currentScrollY > lastScrollY.current + 4) {
        setIsNavVisible(false)
      } else if (currentScrollY < lastScrollY.current - 4) {
        setIsNavVisible(true)
      }

      lastScrollY.current = currentScrollY
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [shouldAutoHideNavbar, isMobileMenuOpen, isSearchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
      setIsSearchOpen(false)
      setSearchQuery("")
    }
  }

  return (
    <>
      <header
        style={{ height: 'var(--navbar-height)' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 transform-gpu ${isNavVisible ? "translate-y-0" : "-translate-y-full"} ${
          isScrolled ? "glass-effect shadow-sm" : "glass-effect"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open Menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold tracking-tighter">Luxe.</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <Link href="/" className="hover:text-accent transition-colors">
              Home
            </Link>
            <Link href="/shop" className="hover:text-accent transition-colors">
              Shop All
            </Link>
            <Link href="/categories/women" className="hover:text-accent transition-colors">
              Women
            </Link>
            <Link href="/categories/men" className="hover:text-accent transition-colors">
              Men
            </Link>
            <Link href="/collections/new" className="hover:text-accent transition-colors">
              New Arrivals
            </Link>
          </nav>

          {/* Icons (Search, User, Cart) */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2 backdrop-blur-sm border border-white/20">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch(e as any)}
                className="bg-transparent outline-none text-sm w-48 placeholder:text-muted-foreground"
              />
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              aria-label="Search"
              onClick={() => setIsSearchOpen(true)}
              className="md:hidden"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Account">
              <User className="h-5 w-5" />
            </Button>
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute top-1 right-1 h-5 w-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-semibold">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-3/4 max-w-sm bg-background p-6 shadow-xl md:hidden flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-2xl font-bold tracking-tighter">Luxe.</span>
                <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <nav className="flex flex-col gap-6 text-lg font-medium">
                <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
                <Link href="/shop" onClick={() => setIsMobileMenuOpen(false)}>Shop All</Link>
                <Link href="/categories/women" onClick={() => setIsMobileMenuOpen(false)}>Women</Link>
                <Link href="/categories/men" onClick={() => setIsMobileMenuOpen(false)}>Men</Link>
                <Link href="/collections/new" onClick={() => setIsMobileMenuOpen(false)}>New Arrivals</Link>
                <div className="h-px bg-border my-2" />
                <Link href="/account" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                  <User className="h-5 w-5" /> Account
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSearchOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-20 left-0 right-0 z-40 flex justify-center px-4"
            >
              <div className="w-full max-w-2xl">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full px-6 py-4 rounded-lg bg-background border border-border shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                  <button
                    type="button"
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
