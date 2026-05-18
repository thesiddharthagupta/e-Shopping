"use server"

import { db } from "@/lib/db"

interface OrderItemInput {
  productId: string
  productName: string
  quantity: number
  price: number
  size: string
  color: string
}

interface CreateOrderInput {
  customerName: string
  customerEmail: string
  shippingAddress: string
  city: string
  postalCode: string
  phone: string
  subtotal: number
  tax: number
  shipping: number
  total: number
  items: OrderItemInput[]
}

export async function createOrderAction(input: CreateOrderInput) {
  try {
    // Generate a beautiful, professional order number
    const randomDigits = Math.floor(100000 + Math.random() * 900000)
    const orderNumber = `LUXE-2026-${randomDigits}`

    // Run order creation and items generation as a Prisma Transaction
    const result = await db.$transaction(async (tx) => {
      // 1. Create the main Order record
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          shippingAddress: input.shippingAddress,
          city: input.city,
          postalCode: input.postalCode,
          phone: input.phone,
          subtotal: input.subtotal,
          tax: input.tax,
          shipping: input.shipping,
          total: input.total,
          orderStatus: "PROCESSING",
          paymentStatus: "PAID", // Simulation payment is auto-authorized
        },
      })

      // 2. Create the associated Order Items
      const orderItemsData = input.items.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        size: item.size,
        color: item.color,
      }))

      await tx.orderItem.createMany({
        data: orderItemsData,
      })

      return order
    })

    return {
      success: true,
      orderId: result.id,
      orderNumber: result.orderNumber,
    }
  } catch (error) {
    console.error("Error creating order in DB:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected database error occurred",
    }
  }
}
