import * as React from "react"
import { db } from "@/lib/db"
import { OrdersClient } from "./OrdersClient"

export const dynamic = "force-dynamic"

export default async function AdminOrdersPage() {
  // Query all transactions including child purchase line items
  const dbOrders = await db.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  })

  return <OrdersClient orders={dbOrders} />
}
