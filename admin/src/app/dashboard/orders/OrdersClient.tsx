"use client"

import * as React from "react"
import { 
  X, 
  Search, 
  MapPin, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle,
  AlertCircle
} from "lucide-react"
import { updateOrderStatusAction } from "./actions"

interface OrderItem {
  id: string
  productName: string
  quantity: number
  price: number
  size: string
  color: string
}

interface Order {
  id: string
  orderNumber: string
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
  orderStatus: string
  paymentStatus: string
  createdAt: Date
  items: OrderItem[]
}

interface OrdersClientProps {
  orders: Order[]
}

export function OrdersClient({ orders }: OrdersClientProps) {
  const [selectedOrder, setSelectedOrder] = React.useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = React.useState<string>("")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isPending, startTransition] = React.useTransition()

  // Dynamic filter lists
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = !statusFilter || o.orderStatus === statusFilter
    const matchesSearch = 
      !searchQuery ||
      o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  // Status transitions
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus)
      if (result.success && selectedOrder && selectedOrder.id === orderId) {
        // Sync selected modal details
        setSelectedOrder({
          ...selectedOrder,
          orderStatus: newStatus
        })
      } else if (!result.success) {
        alert(result.error || "Failed to update order status.")
      }
    })
  }

  const statusOptions = [
    { value: "PENDING", label: "Pending Approval" },
    { value: "PROCESSING", label: "Processing" },
    { value: "SHIPPED", label: "Shipped" },
    { value: "DELIVERED", label: "Delivered" },
    { value: "CANCELLED", label: "Cancelled" }
  ]

  return (
    <div className="space-y-8 font-sans">
      
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-[#171717]">Orders</h2>
        <p className="text-neutral-400 text-sm mt-1 font-medium">
          Monitor transactions, customer shipment coordinates, and dispatch delivery status.
        </p>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 border border-[#eaeaea] rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.01)]">
        
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search Order Number or Name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 border border-[#eaeaea] rounded-xl text-neutral-900 placeholder-neutral-400 text-xs font-semibold bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b]"
          />
        </div>

        {/* Status Dropdown Filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider shrink-0">
            Filter Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#fafafa] border border-[#eaeaea] rounded-xl text-xs font-semibold px-3 py-2 focus:outline-none hover:border-neutral-300"
          >
            <option value="">All Transactions</option>
            {statusOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Orders List Table */}
      <div className="bg-white border border-[#eaeaea] rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.01)] overflow-hidden">
        {filteredOrders.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 font-medium">
            <AlertCircle className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
            <p>No transactions matching search terms.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#eaeaea] text-left text-sm">
              <thead>
                <tr className="bg-neutral-50/50 text-neutral-400 font-semibold text-xs uppercase tracking-wider">
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-2">Customer</th>
                  <th className="py-4 px-2">Status</th>
                  <th className="py-4 px-2">Shipment</th>
                  <th className="py-4 px-2 text-right">Total Billing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eaeaea] font-medium text-neutral-600">
                {filteredOrders.map((o) => {
                  const date = new Date(o.createdAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  })

                  // Color statuses
                  let badgeStyle = "bg-neutral-100 text-neutral-700"
                  if (o.orderStatus === "PROCESSING") badgeStyle = "bg-blue-50 text-blue-700 border-blue-100"
                  if (o.orderStatus === "SHIPPED") badgeStyle = "bg-amber-50 text-amber-700 border-amber-100"
                  if (o.orderStatus === "DELIVERED") badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-100"
                  if (o.orderStatus === "CANCELLED") badgeStyle = "bg-red-50 text-red-700 border-red-100"

                  return (
                    <tr 
                      key={o.id} 
                      onClick={() => setSelectedOrder(o)}
                      className="hover:bg-neutral-50/30 transition-colors cursor-pointer"
                    >
                      
                      {/* ID / Date */}
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-neutral-800 font-bold text-sm hover:text-[#064e3b]">
                            {o.orderNumber}
                          </p>
                          <p className="text-[10px] text-neutral-400 font-semibold flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" /> {date}
                          </p>
                        </div>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-2">
                        <div>
                          <p className="text-neutral-800 font-bold text-sm">{o.customerName}</p>
                          <p className="text-xs text-neutral-400">{o.customerEmail}</p>
                        </div>
                      </td>

                      {/* Order Status Badge */}
                      <td className="py-4 px-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase border tracking-wider ${badgeStyle}`}>
                          {o.orderStatus}
                        </span>
                      </td>

                      {/* City location */}
                      <td className="py-4 px-2">
                        <div className="flex items-center gap-1 text-xs text-neutral-500">
                          <MapPin className="h-3.5 w-3.5 shrink-0 text-neutral-400" />
                          <span>{o.city}, {o.postalCode}</span>
                        </div>
                      </td>

                      {/* Total */}
                      <td className="py-4 px-6 text-right font-bold text-[#171717]">
                        ${o.total.toFixed(2)}
                      </td>

                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAIL MODAL PANEL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-[#eaeaea] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-neutral-50 border-b border-[#eaeaea] p-6 flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-[#064e3b] uppercase tracking-widest bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                  Secure Transaction Invoice
                </span>
                <h3 className="text-lg font-bold text-[#171717] mt-1.5 flex items-center gap-2">
                  Invoice {selectedOrder.orderNumber}
                </h3>
              </div>
              
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-[#171717] transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Dynamic Status Adjuster */}
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-neutral-50 border border-[#eaeaea] rounded-xl">
                <div>
                  <p className="text-sm font-bold text-neutral-700">Dispatch Order Status</p>
                  <p className="text-[10px] text-neutral-400 font-medium">Update database commercial status instantly</p>
                </div>
                <select
                  disabled={isPending}
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                  className="bg-white border border-[#eaeaea] rounded-xl text-xs font-semibold px-3 py-2 focus:outline-none hover:border-neutral-300 disabled:opacity-50"
                >
                  {statusOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Grid: Customer Details vs Shipping Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-b border-[#eaeaea] pb-6">
                
                {/* Customer coordinates */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Customer Coordinates
                  </h4>
                  <div className="space-y-2 text-xs font-semibold text-neutral-600">
                    <p className="text-sm font-bold text-[#171717]">{selectedOrder.customerName}</p>
                    <p className="flex items-center gap-2 text-neutral-500">
                      <Mail className="h-3.5 w-3.5 text-neutral-400" /> {selectedOrder.customerEmail}
                    </p>
                    <p className="flex items-center gap-2 text-neutral-500">
                      <Phone className="h-3.5 w-3.5 text-neutral-400" /> {selectedOrder.phone}
                    </p>
                  </div>
                </div>

                {/* Shipping Coordinates */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    Shipping Coordinates
                  </h4>
                  <div className="space-y-2 text-xs font-semibold text-neutral-600">
                    <p className="flex items-start gap-2 text-neutral-500">
                      <MapPin className="h-3.5 w-3.5 text-neutral-400 shrink-0 mt-0.5" />
                      <span>
                        {selectedOrder.shippingAddress},<br />
                        {selectedOrder.city}, {selectedOrder.postalCode}
                      </span>
                    </p>
                    <p className="text-[10px] uppercase font-bold text-neutral-400 mt-1 pl-5">
                      Carrier: Carbon-Neutral Air Dispatch
                    </p>
                  </div>
                </div>

              </div>

              {/* Items List */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                  Itemized Manifest
                </h4>
                <div className="divide-y divide-[#eaeaea] border border-[#eaeaea] rounded-xl overflow-hidden bg-white">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="p-4 flex justify-between items-center text-sm font-medium">
                      <div>
                        <p className="text-neutral-800 font-bold">{item.productName}</p>
                        <p className="text-[10px] text-neutral-400 mt-0.5 uppercase tracking-wider">
                          Size: {item.size} | Color: {item.color}
                        </p>
                      </div>
                      <div className="text-right text-xs shrink-0">
                        <p className="text-neutral-800 font-bold">${item.price.toFixed(2)} x {item.quantity}</p>
                        <p className="text-neutral-400 font-semibold mt-0.5">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing breakdown */}
              <div className="border-t border-[#eaeaea] pt-6 space-y-2.5 text-sm font-medium text-neutral-500 max-w-sm ml-auto">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-neutral-800">${selectedOrder.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Carrier</span>
                  <span className="text-emerald-700 font-bold">Free</span>
                </div>
                <div className="flex justify-between pb-3 border-b border-[#eaeaea]">
                  <span>V.A.T. (8%)</span>
                  <span className="text-neutral-800">${selectedOrder.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-base font-bold text-[#171717]">
                  <span>Total Amount</span>
                  <span className="text-[#064e3b] text-lg">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-neutral-50 border-t border-[#eaeaea] px-6 py-4 flex justify-end gap-3">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#eaeaea] text-neutral-500 hover:bg-neutral-100 cursor-pointer active:scale-98"
              >
                Close Invoice
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}
