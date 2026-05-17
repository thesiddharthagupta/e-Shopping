import Link from "next/link"
import { Mail } from "lucide-react"
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"

export function Footer() {
  return (
    <footer className="bg-secondary text-foreground pt-16 pb-8 border-t border-border">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="text-3xl font-bold tracking-tighter text-foreground">
              Luxe.
            </Link>
            <p className="text-muted-foreground text-sm">
              Premium clothing and accessories for the modern minimalist. Ethically sourced and crafted with care.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors"><FaInstagram className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors"><FaFacebook className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors"><FaTwitter className="h-5 w-5" /></Link>
              <Link href="#" className="text-muted-foreground hover:text-accent transition-colors"><FaYoutube className="h-5 w-5" /></Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-lg text-foreground">Shop</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/collections/new" className="hover:text-accent transition-colors">New Arrivals</Link></li>
              <li><Link href="/categories/women" className="hover:text-accent transition-colors">Women's Collection</Link></li>
              <li><Link href="/categories/men" className="hover:text-accent transition-colors">Men's Collection</Link></li>
              <li><Link href="/collections/accessories" className="hover:text-accent transition-colors">Accessories</Link></li>
              <li><Link href="/sale" className="hover:text-accent transition-colors">Sale</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-lg text-foreground">Support</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li><Link href="/faq" className="hover:text-accent transition-colors">FAQ</Link></li>
              <li><Link href="/shipping" className="hover:text-accent transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/size-guide" className="hover:text-accent transition-colors">Size Guide</Link></li>
              <li><Link href="/contact" className="hover:text-accent transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-lg text-foreground">Stay in the loop</h4>
            <p className="text-sm text-muted-foreground">
              Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.
            </p>
            <form className="flex gap-2 mt-2">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="bg-background border-border"
              />
              <Button variant="default" className="bg-accent text-white hover:bg-accent/90" type="submit">
                <Mail className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Luxe Clothing. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
