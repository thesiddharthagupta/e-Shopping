import * as React from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { getAdminSession } from "@/lib/auth"
import { logoutAdminAction } from "./actions"
import { 
  LayoutDashboard, 
  ShoppingBag, 
  FileText, 
  LogOut, 
  ShieldAlert,
  User
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: DashboardLayoutProps) {
  // 1. Authenticate session server-side
  const session = await getAdminSession()
  if (!session) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen flex bg-[#fbfbfb] text-[#171717] font-sans">
      
      {/* 1. Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#eaeaea] bg-white h-screen sticky top-0 shrink-0">
        
        {/* Sidebar Header */}
        <div className="h-20 border-b border-[#eaeaea] px-6 flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-[#064e3b] flex items-center justify-center text-white shadow-sm shadow-[#064e3b]/10">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold leading-none text-[#171717]">LUXE CONTROL</h1>
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mt-1 block">
              Merchant Panel
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          
          <Link 
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:text-[#064e3b] hover:bg-[#064e3b]/5 transition-all duration-200"
          >
            <LayoutDashboard className="h-4 w-4" />
            <span>Overview</span>
          </Link>

          <Link 
            href="/dashboard/products"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:text-[#064e3b] hover:bg-[#064e3b]/5 transition-all duration-200"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Products</span>
          </Link>

          <Link 
            href="/dashboard/orders"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-neutral-600 hover:text-[#064e3b] hover:bg-[#064e3b]/5 transition-all duration-200"
          >
            <FileText className="h-4 w-4" />
            <span>Orders</span>
          </Link>

        </nav>

        {/* Profile Card / Logout */}
        <div className="p-4 border-t border-[#eaeaea] space-y-3">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 border border-neutral-200">
              <User className="h-4 w-4" />
            </div>
            <div className="truncate">
              <p className="text-xs font-bold truncate text-[#171717]">Administrator</p>
              <p className="text-[10px] text-neutral-400 truncate">{session}</p>
            </div>
          </div>

          <form action={logoutAdminAction}>
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 cursor-pointer active:scale-98"
            >
              <LogOut className="h-4 w-4" />
              <span>Log Out Panel</span>
            </button>
          </form>
        </div>

      </aside>

      {/* 2. Main Page Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Mobile Top Bar */}
        <header className="md:hidden h-16 border-b border-[#eaeaea] bg-white px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-[#064e3b]" />
            <h1 className="text-sm font-bold tracking-tight text-[#171717]">LUXE ADMIN</h1>
          </div>
          <form action={logoutAdminAction}>
            <button type="submit" className="text-red-500 p-2 hover:bg-red-50 rounded-lg">
              <LogOut className="h-5 w-5" />
            </button>
          </form>
        </header>

        {/* Page Children Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>
    </div>
  )
}
