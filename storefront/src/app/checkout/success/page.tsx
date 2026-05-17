"use client"

import React, { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, ShoppingBag, Calendar, Mail, FileText, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/Button"

function SuccessContent() {
  const searchParams = useSearchParams()
  
  const email = searchParams.get("email") || "your email"
  const orderId = searchParams.get("orderId") || "ORD-2026-X8FA92"
  const total = searchParams.get("total") || "0.00"
  const name = searchParams.get("name") || "Valued Customer"

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  }

  const childVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  }

  const circleVariants = {
    hidden: { scale: 0, rotate: -45 },
    visible: { 
      scale: 1, 
      rotate: 0,
      transition: { type: "spring", stiffness: 150, damping: 15, delay: 0.2 } 
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-2xl mx-auto bg-white border border-border rounded-2xl p-8 md:p-12 shadow-sm text-center"
    >
      {/* Premium Animated Green Icon */}
      <div className="flex justify-center mb-8">
        <motion.div
          variants={circleVariants}
          className="h-24 w-24 rounded-full bg-emerald-50 flex items-center justify-center border border-emerald-100"
        >
          <CheckCircle2 className="h-14 w-14 text-accent stroke-[1.5]" />
        </motion.div>
      </div>

      {/* Main Thank You Message */}
      <motion.div variants={childVariants} className="space-y-3 mb-8">
        <span className="text-xs uppercase tracking-widest text-accent font-bold">Order Confirmed</span>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Thank you, {name}!
        </h1>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          Your order has been securely processed. We've sent a detailed receipt and tracking details to your email.
        </p>
      </motion.div>

      {/* Receipt Details Box */}
      <motion.div
        variants={childVariants}
        className="bg-secondary border border-border rounded-xl p-6 md:p-8 text-left space-y-4 mb-8"
      >
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground font-bold border-b border-border pb-3">
          Receipt Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          {/* Order ID */}
          <div className="flex items-start gap-3">
            <FileText className="h-4.5 w-4.5 text-accent mt-0.5" />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Order Number</p>
              <p className="font-semibold text-foreground tracking-wide font-mono mt-0.5">{orderId}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <Mail className="h-4.5 w-4.5 text-accent mt-0.5" />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Confirmation Email</p>
              <p className="font-semibold text-foreground line-clamp-1 mt-0.5">{email}</p>
            </div>
          </div>

          {/* Total */}
          <div className="flex items-start gap-3">
            <ShoppingBag className="h-4.5 w-4.5 text-accent mt-0.5" />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Total Paid</p>
              <p className="font-semibold text-foreground mt-0.5">${total}</p>
            </div>
          </div>

          {/* Est Delivery */}
          <div className="flex items-start gap-3">
            <Calendar className="h-4.5 w-4.5 text-accent mt-0.5" />
            <div>
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">Estimated Delivery</p>
              <p className="font-semibold text-foreground mt-0.5">5-7 Business Days</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div variants={childVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/shop" className="w-full sm:w-auto">
          <Button className="w-full sm:w-auto bg-accent text-white hover:bg-accent/90 h-12 px-8 text-sm font-medium flex items-center justify-center gap-2">
            Continue Shopping
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  )
}

// Suspense Fallback
function SuccessFallback() {
  return (
    <div className="max-w-2xl mx-auto bg-white border border-border rounded-2xl p-8 md:p-12 shadow-sm text-center">
      <div className="h-20 w-20 rounded-full bg-secondary animate-pulse mx-auto mb-8" />
      <div className="h-8 bg-secondary animate-pulse w-1/2 mx-auto mb-4 rounded" />
      <div className="h-4 bg-secondary animate-pulse w-3/4 mx-auto mb-8 rounded" />
      <div className="h-40 bg-secondary animate-pulse w-full rounded-xl" />
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-16 flex items-center">
      <div className="container mx-auto px-4 md:px-6">
        <Suspense fallback={<SuccessFallback />}>
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  )
}
