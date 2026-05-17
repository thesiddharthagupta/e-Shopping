import { Metadata } from "next"
import { ShopClient } from "./ShopClient"
import { MOCK_PRODUCTS } from "@/lib/mock-data"

export const metadata: Metadata = {
  title: "Shop All | Luxe Clothing",
  description: "Browse our entire collection of premium clothing and accessories.",
}

// Next.js 15 requires searchParams to be a Promise or accessed properly
export default async function ShopPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams
  
  // In a real app, we would fetch data here based on searchParams
  // For now, we pass the mock data to the client component
  return (
    <div className="container mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        <ShopClient initialProducts={MOCK_PRODUCTS} />
      </div>
    </div>
  )
}
