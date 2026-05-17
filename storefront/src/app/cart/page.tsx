'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { Button } from '@/components/ui/Button'

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice, totalItems } = useCart()

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-[#1a1a1a] mb-4">Your Cart is Empty</h1>
          <p className="text-[#666666] mb-8">
            Looks like you haven't added any items to your cart yet. Start shopping to find something amazing!
          </p>
          <Link href="/shop">
            <Button className="bg-accent text-white hover:bg-accent/90">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <Link href="/shop" className="flex items-center gap-2 text-accent hover:text-accent/80 mb-8">
        <ArrowLeft className="h-4 w-4" />
        Continue Shopping
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-8">Shopping Cart</h1>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 p-6 bg-white border border-[#d9d6d1] rounded-lg hover:shadow-md transition-shadow"
              >
                {/* Product Image Placeholder */}
                <div className="w-24 h-24 bg-neutral-200 rounded-lg flex-shrink-0" />

                {/* Product Details */}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[#1a1a1a] mb-2">
                    {item.product.name}
                  </h3>
                  <div className="space-y-1 text-sm text-[#666666] mb-3">
                    <p>Size: <span className="font-medium">{item.selectedSize}</span></p>
                    <p>Color: <span className="font-medium">{item.selectedColor}</span></p>
                  </div>
                  <p className="text-lg font-bold text-[#1a1a1a]">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Quantity & Actions */}
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() =>
                      removeFromCart(
                        item.product.id,
                        item.selectedSize,
                        item.selectedColor
                      )
                    }
                    className="text-[#999999] hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  {/* Quantity Selector */}
                  <div className="flex items-center gap-2 border border-[#d9d6d1] rounded-lg p-1">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                      className="p-1 hover:bg-neutral-100 rounded transition-colors"
                    >
                      <Minus className="h-4 w-4 text-[#666666]" />
                    </button>
                    <span className="w-8 text-center text-[#1a1a1a] font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.product.id,
                          item.quantity + 1,
                          item.selectedSize,
                          item.selectedColor
                        )
                      }
                      className="p-1 hover:bg-neutral-100 rounded transition-colors"
                    >
                      <Plus className="h-4 w-4 text-[#666666]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={clearCart}
            className="mt-6 text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white border border-[#d9d6d1] rounded-lg p-6 space-y-6">
            <h2 className="text-xl font-bold text-[#1a1a1a]">Order Summary</h2>

            <div className="space-y-3 border-b border-[#d9d6d1] pb-6">
              <div className="flex justify-between text-[#666666]">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between text-[#666666]">
                <span>Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-lg font-bold text-[#1a1a1a]">
              <span>Total</span>
              <span>${(totalPrice * 1.08).toFixed(2)}</span>
            </div>

            <Button className="w-full bg-accent text-white hover:bg-accent/90 h-12 text-base">
              Proceed to Checkout
            </Button>

            <p className="text-xs text-[#999999] text-center">
              Free shipping on orders over $100. Standard delivery in 5-7 business days.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
