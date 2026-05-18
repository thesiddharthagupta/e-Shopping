"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Truck, Lock, ShieldCheck, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { createOrderAction } from "./actions"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, totalItems, clearCart } = useCart()
  
  // Checkout Steps: 1 = Shipping, 2 = Payment
  const [step, setStep] = useState<1 | 2>(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // Form State
  const [shipping, setShipping] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    zipCode: "",
    phone: "",
  })
  
  const [payment, setPayment] = useState({
    cardholderName: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  })

  // Validation Errors
  const [errors, setErrors] = useState<Record<string, string>>({})

  // If cart is empty, redirect back or show empty state
  if (items.length === 0 && !isSubmitting) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center py-20">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h2>
          <p className="text-muted-foreground mb-8">
            You cannot checkout with an empty cart. Please explore our collections to add items!
          </p>
          <Link href="/shop">
            <Button className="bg-accent text-white hover:bg-accent/90 px-6 py-3">
              Go to Shop
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Calculations
  const tax = totalPrice * 0.08
  const finalTotal = totalPrice + tax

  // Handle Input Changes
  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setShipping((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let formattedValue = value

    // Card number formatting (adds space every 4 digits)
    if (name === "cardNumber") {
      formattedValue = value
        .replace(/\s?/g, "")
        .replace(/(\d{4})/g, "$1 ")
        .trim()
        .slice(0, 19)
    }
    // Expiry formatting (MM/YY)
    else if (name === "expiry") {
      formattedValue = value
        .replace(/\//g, "")
        .replace(/(\d{2})/g, "$1/")
        .slice(0, 5)
      if (formattedValue.endsWith("/")) {
        formattedValue = formattedValue.slice(0, -1)
      }
    }
    // CVV limit (3 or 4 digits)
    else if (name === "cvv") {
      formattedValue = value.replace(/\D/g, "").slice(0, 4)
    }

    setPayment((prev) => ({ ...prev, [name]: formattedValue }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Step 1 Validation
  const validateShipping = () => {
    const newErrors: Record<string, string> = {}
    
    if (!shipping.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) newErrors.email = "Invalid email format"
    
    if (!shipping.name.trim()) newErrors.name = "Full name is required"
    if (!shipping.address.trim()) newErrors.address = "Address is required"
    if (!shipping.city.trim()) newErrors.city = "City is required"
    if (!shipping.zipCode.trim()) newErrors.zipCode = "Postal code is required"
    if (!shipping.phone.trim()) newErrors.phone = "Phone number is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Step 2 Validation
  const validatePayment = () => {
    const newErrors: Record<string, string> = {}

    if (!payment.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required"
    if (!payment.cardNumber.trim() || payment.cardNumber.length < 15) {
      newErrors.cardNumber = "Valid card number is required"
    }
    if (!payment.expiry.trim() || !/^\d{2}\/\d{2}$/.test(payment.expiry)) {
      newErrors.expiry = "Use MM/YY format"
    }
    if (!payment.cvv.trim() || payment.cvv.length < 3) {
      newErrors.cvv = "Valid CVV is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleContinueToPayment = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateShipping()) {
      setStep(2)
      window.scrollTo(0, 0)
    }
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validatePayment()) return

    setIsSubmitting(true)
    
    // Map cart items into DB order items format
    const orderItems = items.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      size: item.selectedSize,
      color: item.selectedColor,
    }))

    try {
      // Call the Server Action
      const response = await createOrderAction({
        customerName: shipping.name,
        customerEmail: shipping.email,
        shippingAddress: shipping.address,
        city: shipping.city,
        postalCode: shipping.zipCode,
        phone: shipping.phone,
        subtotal: totalPrice,
        tax: tax,
        shipping: 0,
        total: finalTotal,
        items: orderItems,
      })

      if (response.success && response.orderNumber) {
        clearCart()
        router.push(
          `/checkout/success?email=${encodeURIComponent(shipping.email)}&orderId=${
            response.orderNumber
          }&total=${finalTotal.toFixed(2)}&name=${encodeURIComponent(shipping.name)}`
        )
      } else {
        setErrors((prev) => ({
          ...prev,
          payment: response.error || "Failed to process database order. Please try again.",
        }))
        setIsSubmitting(false)
      }
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        payment: "An unexpected error occurred during database checkout. Please try again.",
      }))
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      {/* Header Band */}
      <div className="border-b border-border bg-white py-6 mb-8 page-header-band">
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/cart" className="p-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="h-5 w-5 text-foreground" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Checkout</h1>
              <p className="text-xs text-muted-foreground mt-0.5">Secure payment processing</p>
            </div>
          </div>
          {/* Progress Indicator */}
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className={`px-2.5 py-1 rounded-full text-xs transition-colors duration-300 ${
              step === 1 ? "bg-accent text-white" : "bg-emerald-100 text-accent"
            }`}>
              {step === 2 ? <Check className="h-3 w-3 inline" /> : "1"}
            </span>
            <span className="text-muted-foreground text-xs">Shipping</span>
            <span className="h-px w-6 bg-border" />
            <span className={`px-2.5 py-1 rounded-full text-xs transition-colors duration-300 ${
              step === 2 ? "bg-accent text-white" : "bg-secondary text-muted-foreground"
            }`}>
              2
            </span>
            <span className="text-muted-foreground text-xs">Payment</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-border rounded-xl p-6 md:p-8 space-y-6">
              
              {/* STEP 1: SHIPPING INFORMATION */}
              {step === 1 && (
                <form onSubmit={handleContinueToPayment} className="space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-border">
                    <Truck className="h-5 w-5 text-accent" />
                    <h2 className="text-lg font-bold text-foreground">Shipping Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="email" className="text-sm font-medium text-foreground">Email Address</label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={shipping.email}
                        onChange={handleShippingChange}
                        className={errors.email ? "border-red-500" : ""}
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="name" className="text-sm font-medium text-foreground">Full Name</label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={shipping.name}
                        onChange={handleShippingChange}
                        className={errors.name ? "border-red-500" : ""}
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="address" className="text-sm font-medium text-foreground">Street Address</label>
                      <Input
                        id="address"
                        name="address"
                        placeholder="123 Fashion Ave, Apt 4B"
                        value={shipping.address}
                        onChange={handleShippingChange}
                        className={errors.address ? "border-red-500" : ""}
                      />
                      {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="city" className="text-sm font-medium text-foreground">City</label>
                      <Input
                        id="city"
                        name="city"
                        placeholder="New York"
                        value={shipping.city}
                        onChange={handleShippingChange}
                        className={errors.city ? "border-red-500" : ""}
                      />
                      {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="zipCode" className="text-sm font-medium text-foreground">Postal / ZIP Code</label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        placeholder="10001"
                        value={shipping.zipCode}
                        onChange={handleShippingChange}
                        className={errors.zipCode ? "border-red-500" : ""}
                      />
                      {errors.zipCode && <p className="text-xs text-red-500">{errors.zipCode}</p>}
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="phone" className="text-sm font-medium text-foreground">Phone Number</label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={shipping.phone}
                        onChange={handleShippingChange}
                        className={errors.phone ? "border-red-500" : ""}
                      />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>
                  </div>

                  <Button type="submit" className="w-full bg-accent text-white hover:bg-accent/90 h-12 text-base font-medium mt-4">
                    Continue to Payment
                  </Button>
                </form>
              )}

              {/* STEP 2: PAYMENT METHOD (SIMULATION) */}
              {step === 2 && (
                <form onSubmit={handlePlaceOrder} className="space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-border justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-accent" />
                      <h2 className="text-lg font-bold text-foreground">Payment details</h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="text-xs text-accent hover:underline flex items-center gap-1 font-medium"
                    >
                      Edit Shipping
                    </button>
                  </div>

                  {/* Card Visa/MC badge */}
                  <div className="bg-[#1a1a1a] rounded-xl p-6 text-white space-y-8 relative overflow-hidden shadow-lg border border-white/5">
                    <div className="absolute right-0 bottom-0 top-0 left-0 bg-gradient-to-tr from-accent/25 via-transparent to-transparent z-0" />
                    <div className="flex justify-between items-center relative z-10">
                      <span className="text-sm font-bold tracking-widest text-white/60">LUXE CARD</span>
                      <CreditCard className="h-8 w-8 text-white/80" />
                    </div>
                    <div className="space-y-2 relative z-10">
                      <div className="text-xl md:text-2xl font-mono tracking-widest text-center">
                        {payment.cardNumber || "•••• •••• •••• ••••"}
                      </div>
                    </div>
                    <div className="flex justify-between items-center relative z-10 text-xs font-mono">
                      <div>
                        <p className="text-[10px] text-white/40 uppercase">Card Holder</p>
                        <p className="font-semibold uppercase tracking-wider">{payment.cardholderName || "YOUR NAME"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-white/40 uppercase">Expires</p>
                        <p className="font-semibold">{payment.expiry || "MM/YY"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="cardholderName" className="text-sm font-medium text-foreground">Cardholder Name</label>
                      <Input
                        id="cardholderName"
                        name="cardholderName"
                        placeholder="NAME ON CARD"
                        value={payment.cardholderName}
                        onChange={handlePaymentChange}
                        className={errors.cardholderName ? "border-red-500 font-medium uppercase" : "font-medium uppercase"}
                      />
                      {errors.cardholderName && <p className="text-xs text-red-500">{errors.cardholderName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cardNumber" className="text-sm font-medium text-foreground">Card Number</label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={payment.cardNumber}
                        onChange={handlePaymentChange}
                        className={errors.cardNumber ? "border-red-500 font-mono" : "font-mono"}
                      />
                      {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label htmlFor="expiry" className="text-sm font-medium text-foreground">Expiration Date</label>
                        <Input
                          id="expiry"
                          name="expiry"
                          placeholder="MM/YY"
                          value={payment.expiry}
                          onChange={handlePaymentChange}
                          className={errors.expiry ? "border-red-500 font-mono" : "font-mono"}
                        />
                        {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="cvv" className="text-sm font-medium text-foreground">CVV</label>
                        <Input
                          id="cvv"
                          name="cvv"
                          placeholder="123"
                          value={payment.cvv}
                          onChange={handlePaymentChange}
                          className={errors.cvv ? "border-red-500 font-mono" : "font-mono"}
                        />
                        {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="bg-secondary/40 rounded-lg p-4 flex items-start gap-3 border border-border/50 text-xs text-muted-foreground mt-4">
                    <Lock className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <p>
                      Your transaction is securely simulated. We employ high-grade bank-level encryption standards. No real funds are transferred.
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent text-white hover:bg-accent/90 h-12 text-base font-medium flex items-center justify-center gap-2 mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Simulating Payment...
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="h-5 w-5 mr-1" />
                        Place Order (${finalTotal.toFixed(2)})
                      </>
                    )}
                  </Button>
                  {errors.payment && <p className="text-sm font-semibold text-red-500 mt-3 text-center">{errors.payment}</p>}
                </form>
              )}

            </div>
          </div>

          {/* Sticky Summary Side */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-secondary border border-border rounded-xl p-6 space-y-6">
              <h2 className="text-lg font-bold text-foreground">Order Summary</h2>
              
              {/* Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-border pr-2">
                {items.map((item) => (
                  <div key={`${item.product.id}-${item.selectedSize}-${item.selectedColor}`} className="py-4 flex gap-4 first:pt-0 last:pb-0">
                    <div className="w-12 h-16 bg-white border border-border rounded-md overflow-hidden flex-shrink-0 relative">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xs font-semibold text-foreground line-clamp-1">{item.product.name}</h3>
                        <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
                          Size: {item.selectedSize} | Color: {item.selectedColor}
                        </p>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">Qty {item.quantity}</span>
                        <span className="font-bold text-foreground">${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Summary Breakdown */}
              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="text-foreground">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-accent font-medium">Free</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground pb-4 border-b border-border">
                  <span>Tax (8%)</span>
                  <span className="text-foreground">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-base font-bold text-foreground pt-1">
                  <span>Total</span>
                  <span className="text-lg">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="pt-4 border-t border-border space-y-2 text-xs text-muted-foreground flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>Free Shipping & Free 30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>Carbon-neutral shipping packaging</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
