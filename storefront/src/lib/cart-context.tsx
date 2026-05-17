'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { Product } from './products'

export type CartItem = {
  id: string
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: string
}

type CartContextType = {
  items: CartItem[]
  addToCart: (product: Product, quantity: number, size: string, color: string) => void
  removeFromCart: (productId: string, size: string, color: string) => void
  updateQuantity: (productId: string, quantity: number, size: string, color: string) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('luxe-cart')
    if (saved) {
      try {
        setItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to load cart:', e)
      }
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('luxe-cart', JSON.stringify(items))
    }
  }, [items, isLoaded])

  const addToCart = (product: Product, quantity: number, size: string, color: string) => {
    const key = `${product.id}-${size}-${color}`
    
    setItems((prevItems) => {
      const existing = prevItems.find(
        (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      )

      if (existing) {
        return prevItems.map((item) =>
          item.id === existing.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      return [
        ...prevItems,
        {
          id: key,
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
        },
      ]
    })
  }

  const removeFromCart = (productId: string, size: string, color: string) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) =>
          !(item.product.id === productId && item.selectedSize === size && item.selectedColor === color)
      )
    )
  }

  const updateQuantity = (productId: string, quantity: number, size: string, color: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color)
      return
    }

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId && item.selectedSize === size && item.selectedColor === color
          ? { ...item, quantity }
          : item
      )
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
