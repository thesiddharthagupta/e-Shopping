import * as React from "react"
import { db } from "@/lib/db"
import { 
  DollarSign, 
  ShoppingBag, 
  Layers, 
  TrendingUp,
  ArrowUpRight 
} from "lucide-react"

// Force Next.js to fetch new data on every page reload
export const dynamic = "force-dynamic"

export default async function AdminDashboardOverview() {
  // 1. Fetch live metrics from SQLite database
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5
  })

  const allOrders = await db.order.findMany({
    select: { total: true }
  })

  const totalProducts = await db.product.count()
  const totalCategories = await db.category.count()

  // Calculations
  const ordersCount = allOrders.length
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.total, 0)
  const averageOrderValue = ordersCount > 0 ? totalRevenue / ordersCount : 0

  const metrics = [
    {
      name: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
      description: "Aggregated gross retail revenue"
    },
    {
      name: "Total Orders",
      value: ordersCount.toString(),
      icon: ShoppingBag,
      color: "bg-blue-50 text-blue-700 border-blue-100",
      description: "Successful simulated invoices"
    },
    {
      name: "Average Order Value",
      value: `$${averageOrderValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: "bg-purple-50 text-purple-700 border-purple-100",
      description: "Average customer spend"
    },
    {
      name: "Active Inventory",
      value: `${totalProducts} Products`,
      icon: Layers,
      color: "bg-amber-50 text-amber-700 border-amber-100",
      description: `Spanning ${totalCategories} live categories`
    }
  ]

  return (
    <div className="space-y-8 font-sans">
      
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#171717]">Dashboard</h2>
        <p className="text-neutral-400 text-sm mt-1 font-medium">
          Welcome back. Here is the active commercial status of your storefront.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((item) => (
          <div 
            key={item.name}
            className="bg-white border border-[#eaeaea] rounded-2xl p-6 shadow-[0_4px_20px_rgb(0,0,0,0.01)] flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                {item.name}
              </span>
              <div className={`h-8 w-8 rounded-lg border flex items-center justify-center ${item.color}`}>
                <item.icon className="h-4 w-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-[#171717] tracking-tight">{item.value}</p>
              <p className="text-xs text-neutral-400 mt-1 font-medium">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-[#eaeaea] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.01)] space-y-6">
        
        <div className="flex items-center justify-between border-b border-[#eaeaea] pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#171717]">Recent Orders</h3>
            <p className="text-xs text-neutral-400 mt-0.5">A live view of the latest purchases.</p>
          </div>
          <span className="text-xs text-[#064e3b] font-semibold flex items-center gap-1">
            Realtime database <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-neutral-400 text-sm font-medium">
            No orders have been received yet. Test by placing a guest checkout on the storefront!
          </div>
        ) : (
          <div className="overflow-x-auto min-w-full">
            <table className="min-w-full divide-y divide-[#eaeaea] text-left text-sm">
              <thead>
                <tr className="text-neutral-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-3 px-2">Order No.</th>
                  <th className="py-3 px-2">Customer</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaea] font-medium text-neutral-600">
                {orders.map((order) => {
                  const date = new Date(order.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })

                  // Color mapping for dynamic status badges
                  let badgeStyle = "bg-neutral-100 text-neutral-700"
                  if (order.orderStatus === "PROCESSING") badgeStyle = "bg-blue-50 text-blue-700 border border-blue-100"
                  if (order.orderStatus === "SHIPPED") badgeStyle = "bg-amber-50 text-amber-700 border border-amber-100"
                  if (order.orderStatus === "DELIVERED") badgeStyle = "bg-emerald-50 text-emerald-700 border border-emerald-100"

                  return (
                    <tr key={order.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-4 px-2 font-bold text-[#171717]">{order.orderNumber}</td>
                      <td className="py-4 px-2">
                        <div>
                          <p className="text-neutral-800 font-bold">{order.customerName}</p>
                          <p className="text-xs text-neutral-400">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="py-4 px-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${badgeStyle}`}>
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-2 text-xs text-neutral-400">{date}</td>
                      <td className="py-4 px-2 text-right font-bold text-[#171717]">
                        ${order.total.toFixed(2)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  )
}
