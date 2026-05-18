"use server"

import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  try {
    const updatedOrder = await db.order.update({
      where: { id: orderId },
      data: {
        orderStatus: newStatus,
      },
    })

    revalidatePath("/dashboard/orders")
    revalidatePath("/dashboard")
    
    return { 
      success: true, 
      orderStatus: updatedOrder.orderStatus 
    }
  } catch (error) {
    console.error("Failed to update order status:", error)
    return { 
      success: false, 
      error: "Failed to update order status in the database." 
    }
  }
}
