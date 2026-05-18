"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Lock, Mail, ShieldCheck, AlertCircle } from "lucide-react"
import { loginAdminAction } from "./actions"

export default function AdminLoginPage() {
  const router = useRouter()
  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await loginAdminAction(formData)

      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "An unexpected error occurred.")
      }
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfdfd] px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full space-y-8 bg-white border border-[#eaeaea] rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
        
        {/* Logo/Branding */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="h-12 w-12 rounded-full bg-[#064e3b] flex items-center justify-center text-white mb-4 shadow-md shadow-[#064e3b]/10">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-[#171717]">LUXE ADMIN</h2>
          <p className="text-xs text-neutral-400 mt-1 uppercase tracking-widest font-semibold">
            Merchant Control Panel
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-red-700 text-sm animate-fade-in">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
            <span className="font-medium">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Admin Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="admin@luxe.com"
                  defaultValue="admin@luxe.com"
                  className="block w-full pl-10 pr-3 py-3 border border-[#eaeaea] rounded-xl text-neutral-900 placeholder-neutral-400 text-sm font-medium bg-[#fafafa] hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-all duration-200"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••••••"
                  defaultValue="adminpassword123"
                  className="block w-full pl-10 pr-3 py-3 border border-[#eaeaea] rounded-xl text-neutral-900 placeholder-neutral-400 text-sm font-medium bg-[#fafafa] hover:border-neutral-300 focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-all duration-200"
                />
              </div>
            </div>

          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-[#064e3b] hover:bg-[#043d2e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#064e3b] disabled:opacity-50 transition-all duration-200 cursor-pointer shadow-md shadow-[#064e3b]/10 active:scale-[0.98]"
          >
            {isPending ? (
              <div className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Authorizing Security Session...</span>
              </div>
            ) : (
              "Sign In to Controller"
            )}
          </button>

        </form>

        {/* Footer Info */}
        <div className="text-center pt-4 border-t border-[#eaeaea]">
          <p className="text-xs text-neutral-400 font-medium">
            Authorized admin personnel only. Device IP address logged.
          </p>
        </div>

      </div>
    </div>
  )
}
