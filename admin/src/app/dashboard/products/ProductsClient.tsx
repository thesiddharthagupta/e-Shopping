"use client"

import * as React from "react"
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Check, 
  ShoppingBag,
  Sliders
} from "lucide-react"
import { createProductAction, updateProductAction, deleteProductAction } from "./actions"

interface Category {
  id: string
  name: string
  slug: string
}

interface ProductColor {
  name: string
  hex: string
}

interface MappedProduct {
  id: string
  name: string
  price: number
  originalPrice: number | null
  categoryId: string
  categoryName: string
  inStock: boolean
  isNew: boolean
  description: string
  sizes: string[]
  colors: ProductColor[]
}

interface ProductsClientProps {
  products: MappedProduct[]
  categories: Category[]
}

export function ProductsClient({ products, categories }: ProductsClientProps) {
  const [activeTab, setActiveTab] = React.useState<"list" | "create" | "edit">("list")
  const [selectedProduct, setSelectedProduct] = React.useState<MappedProduct | null>(null)
  
  // Custom Dynamic Color inputs in forms
  const [formColors, setFormColors] = React.useState<ProductColor[]>([{ name: "", hex: "#000000" }])

  const [error, setError] = React.useState<string | null>(null)
  const [isPending, startTransition] = React.useTransition()

  // SIZES checklist presets
  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]

  const handleAddColorInput = () => {
    setFormColors([...formColors, { name: "", hex: "#000000" }])
  }

  const handleRemoveColorInput = (index: number) => {
    setFormColors(formColors.filter((_, i) => i !== index))
  }

  const handleColorChange = (index: number, field: "name" | "hex", value: string) => {
    const updated = [...formColors]
    updated[index][field] = value
    setFormColors(updated)
  }

  const handleOpenCreate = () => {
    setError(null)
    setFormColors([{ name: "", hex: "#000000" }])
    setActiveTab("create")
  }

  const handleOpenEdit = (product: MappedProduct) => {
    setError(null)
    setSelectedProduct(product)
    setFormColors(product.colors.length > 0 ? product.colors : [{ name: "", hex: "#000000" }])
    setActiveTab("edit")
  }

  const handleClose = () => {
    setActiveTab("list")
    setSelectedProduct(null)
  }

  // Create Submit
  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    // Append colors
    formColors.forEach((c) => {
      if (c.name.trim() !== "") {
        formData.append("colorNames", c.name)
        formData.append("colorHexes", c.hex)
      }
    })

    startTransition(async () => {
      const result = await createProductAction(formData)
      if (result.success) {
        handleClose()
      } else {
        setError(result.error || "Failed to create product.")
      }
    })
  }

  // Edit Submit
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!selectedProduct) return
    setError(null)
    const formData = new FormData(e.currentTarget)

    // Append colors
    formColors.forEach((c) => {
      if (c.name.trim() !== "") {
        formData.append("colorNames", c.name)
        formData.append("colorHexes", c.hex)
      }
    })

    startTransition(async () => {
      const result = await updateProductAction(selectedProduct.id, formData)
      if (result.success) {
        handleClose()
      } else {
        setError(result.error || "Failed to update product.")
      }
    })
  }

  // Delete Action
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the product: "${name}"? This action cannot be undone.`)) {
      startTransition(async () => {
        const result = await deleteProductAction(id)
        if (!result.success) {
          alert(result.error || "Failed to delete product.")
        }
      })
    }
  }

  return (
    <div className="space-y-8 font-sans">
      
      {/* 1. Header Band */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-[#171717]">Products</h2>
          <p className="text-neutral-400 text-sm mt-1 font-medium">
            Manage your store inventory, variant sizing, and pricing models.
          </p>
        </div>
        
        {activeTab === "list" && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#064e3b] hover:bg-[#043d2e] shadow-md shadow-[#064e3b]/10 transition-all duration-200 cursor-pointer active:scale-98"
          >
            <Plus className="h-4 w-4" />
            <span>New Product</span>
          </button>
        )}
      </div>

      {/* 2. Error Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-xl text-sm font-semibold">
          {error}
        </div>
      )}

      {/* 3. CRUD Views Switching */}
      
      {/* LIST VIEW */}
      {activeTab === "list" && (
        <div className="bg-white border border-[#eaeaea] rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.01)] overflow-hidden">
          {products.length === 0 ? (
            <div className="py-20 text-center text-neutral-400 font-medium">
              <ShoppingBag className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
              <p>No products found in the database. Click "New Product" to populate your catalog.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[#eaeaea] text-left text-sm">
                <thead>
                  <tr className="bg-neutral-50/50 text-neutral-400 font-semibold text-xs uppercase tracking-wider">
                    <th className="py-4 px-6">Product Item</th>
                    <th className="py-4 px-2">Category</th>
                    <th className="py-4 px-2">Inventory</th>
                    <th className="py-4 px-2">Retail Price</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eaeaea] font-medium text-neutral-600">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-50/20 transition-colors">
                      
                      {/* Name & Details */}
                      <td className="py-4 px-6">
                        <div>
                          <p className="text-neutral-800 font-bold text-sm hover:text-[#064e3b] transition-colors">
                            {p.name}
                          </p>
                          
                          {/* Tags, Sizes & Colors preview */}
                          <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[10px] text-neutral-400">
                            {p.isNew && (
                              <span className="bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded font-bold">
                                NEW
                              </span>
                            )}
                            <span className="bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider">
                              Sizes: {p.sizes.join(", ")}
                            </span>
                            <div className="flex items-center gap-1 pl-1">
                              {p.colors.map((color, i) => (
                                <span 
                                  key={i}
                                  className="h-2.5 w-2.5 rounded-full border border-neutral-300 block shrink-0" 
                                  style={{ backgroundColor: color.hex }}
                                  title={color.name}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-2">
                        <span className="bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {p.categoryName}
                        </span>
                      </td>

                      {/* Stock Badges */}
                      <td className="py-4 px-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                          p.inStock 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                            : "bg-red-50 text-red-700 border-red-100"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full block ${p.inStock ? "bg-emerald-500" : "bg-red-500"}`} />
                          {p.inStock ? "In Stock" : "Sold Out"}
                        </span>
                      </td>

                      {/* Retail Price */}
                      <td className="py-4 px-2">
                        <div className="font-bold text-[#171717]">
                          <span>${p.price.toFixed(2)}</span>
                          {p.originalPrice && (
                            <span className="text-neutral-400 text-xs font-medium line-through ml-2">
                              ${p.originalPrice.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions buttons */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-2 hover:bg-neutral-100 text-neutral-600 hover:text-[#064e3b] rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit3 className="h-4.5 w-4.5" />
                          </button>
                          
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            disabled={isPending}
                            className="p-2 hover:bg-red-50 text-neutral-600 hover:text-red-600 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Product"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* CREATE VIEW */}
      {activeTab === "create" && (
        <div className="bg-white border border-[#eaeaea] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.01)] max-w-3xl">
          
          <div className="flex items-center justify-between border-b border-[#eaeaea] pb-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#171717]">Create New Product</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Populate details to list item storefront catalog.</p>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-[#171717] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleCreateSubmit} className="space-y-6">
            
            {/* Title / Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Product Name *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. Emerald Satin Blazer"
                  className="block w-full px-3.5 py-2.5 border border-[#eaeaea] rounded-xl text-neutral-900 placeholder-neutral-400 text-sm font-medium bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-all"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="e.g. Crafted from structured satin weave, this jacket features elegant styling..."
                  className="block w-full px-3.5 py-2.5 border border-[#eaeaea] rounded-xl text-neutral-900 placeholder-neutral-400 text-sm font-medium bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-all"
                />
              </div>
            </div>

            {/* Pricing / Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Retail Price ($) *
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  placeholder="120.00"
                  className="block w-full px-3.5 py-2.5 border border-[#eaeaea] rounded-xl text-neutral-900 placeholder-neutral-400 text-sm font-medium bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Original Price (Sale)
                </label>
                <input
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 150.00"
                  className="block w-full px-3.5 py-2.5 border border-[#eaeaea] rounded-xl text-neutral-900 placeholder-neutral-400 text-sm font-medium bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  name="categoryId"
                  required
                  className="block w-full px-3.5 py-2.5 border border-[#eaeaea] rounded-xl text-neutral-900 text-sm font-medium bg-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#064e3b]/20 focus:border-[#064e3b] transition-all"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* SIZES CHECKLIST */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-3">
                {sizeOptions.map((sz) => (
                  <label 
                    key={sz}
                    className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-[#eaeaea] rounded-xl text-sm font-semibold text-neutral-600 hover:border-neutral-300 cursor-pointer select-none"
                  >
                    <input 
                      type="checkbox" 
                      name="sizes" 
                      value={sz} 
                      defaultChecked={sz === "S" || sz === "M" || sz === "L"}
                      className="accent-[#064e3b]" 
                    />
                    <span>{sz}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* COLOR PALETTE BUILDER */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#eaeaea] pb-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Product Color Palette
                </label>
                <button
                  type="button"
                  onClick={handleAddColorInput}
                  className="text-xs text-[#064e3b] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Color
                </button>
              </div>

              <div className="space-y-3">
                {formColors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3 animate-fade-in">
                    <input
                      type="text"
                      placeholder="Color Name (e.g. Forest Green)"
                      value={color.name}
                      onChange={(e) => handleColorChange(idx, "name", e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#eaeaea] rounded-xl text-neutral-900 text-sm font-medium bg-[#fafafa]"
                    />
                    <div className="flex items-center gap-2 border border-[#eaeaea] rounded-xl px-3 py-1 bg-[#fafafa] shrink-0">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border-0 shrink-0"
                      />
                      <span className="text-xs font-mono font-semibold uppercase">{color.hex}</span>
                    </div>
                    {formColors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColorInput(idx)}
                        className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STATUS TOGGLES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#eaeaea] pt-6">
              
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-[#eaeaea] rounded-xl">
                <div>
                  <p className="text-sm font-bold text-neutral-700">Stock Availability</p>
                  <p className="text-[10px] text-neutral-400 font-medium">Render item as purchaseable</p>
                </div>
                <select
                  name="inStock"
                  className="bg-white border border-[#eaeaea] rounded-lg text-xs font-semibold px-2 py-1 focus:outline-none"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-[#eaeaea] rounded-xl">
                <div>
                  <p className="text-sm font-bold text-neutral-700">Tag as "New"</p>
                  <p className="text-[10px] text-neutral-400 font-medium">Show brand NEW badge in catalog</p>
                </div>
                <select
                  name="isNew"
                  className="bg-white border border-[#eaeaea] rounded-lg text-xs font-semibold px-2 py-1 focus:outline-none"
                >
                  <option value="true">New Arrival</option>
                  <option value="false">Standard Item</option>
                </select>
              </div>

            </div>

            {/* Submit Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#eaeaea]">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#eaeaea] text-neutral-500 hover:bg-neutral-50 cursor-pointer active:scale-98"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#064e3b] hover:bg-[#043d2e] shadow-md shadow-[#064e3b]/10 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {isPending ? "Creating..." : "Save Product"}
              </button>
            </div>

          </form>

        </div>
      )}

      {/* EDIT VIEW */}
      {activeTab === "edit" && selectedProduct && (
        <div className="bg-white border border-[#eaeaea] rounded-2xl p-6 md:p-8 shadow-[0_4px_20px_rgb(0,0,0,0.01)] max-w-3xl">
          
          <div className="flex items-center justify-between border-b border-[#eaeaea] pb-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#171717]">Edit Product: {selectedProduct.name}</h3>
              <p className="text-xs text-neutral-400 mt-0.5">Modify parameters or toggle stock levels.</p>
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-[#171717] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <form onSubmit={handleEditSubmit} className="space-y-6">
            
            {/* Title / Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Product Name *
                </label>
                <input
                  name="name"
                  type="text"
                  required
                  defaultValue={selectedProduct.name}
                  className="block w-full px-3.5 py-2.5 border border-[#eaeaea] rounded-xl text-neutral-900 text-sm font-medium bg-[#fafafa] focus:outline-none"
                />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Product Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={selectedProduct.description}
                  className="block w-full px-3.5 py-2.5 border border-[#eaeaea] rounded-xl text-neutral-900 text-sm font-medium bg-[#fafafa] focus:outline-none"
                />
              </div>
            </div>

            {/* Pricing / Category */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Retail Price ($) *
                </label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  defaultValue={selectedProduct.price}
                  className="block w-full px-3.5 py-2.5 border border-[#eaeaea] rounded-xl text-neutral-900 text-sm font-medium bg-[#fafafa]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Original Price (Sale)
                </label>
                <input
                  name="originalPrice"
                  type="number"
                  step="0.01"
                  defaultValue={selectedProduct.originalPrice || ""}
                  className="block w-full px-3.5 py-2.5 border border-[#eaeaea] rounded-xl text-neutral-900 text-sm font-medium bg-[#fafafa]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Category *
                </label>
                <select
                  name="categoryId"
                  required
                  defaultValue={selectedProduct.categoryId}
                  className="block w-full px-3.5 py-2.5 border border-[#eaeaea] rounded-xl text-neutral-900 text-sm font-medium bg-[#fafafa]"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

            </div>

            {/* SIZES CHECKLIST */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider block">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-3">
                {sizeOptions.map((sz) => (
                  <label 
                    key={sz}
                    className="flex items-center gap-2 px-3 py-2 bg-neutral-50 border border-[#eaeaea] rounded-xl text-sm font-semibold text-neutral-600 cursor-pointer select-none"
                  >
                    <input 
                      type="checkbox" 
                      name="sizes" 
                      value={sz} 
                      defaultChecked={selectedProduct.sizes.includes(sz)}
                      className="accent-[#064e3b]" 
                    />
                    <span>{sz}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* COLOR PALETTE BUILDER */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-[#eaeaea] pb-2">
                <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Product Color Palette
                </label>
                <button
                  type="button"
                  onClick={handleAddColorInput}
                  className="text-xs text-[#064e3b] font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" /> Add Color
                </button>
              </div>

              <div className="space-y-3">
                {formColors.map((color, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <input
                      type="text"
                      placeholder="Color Name"
                      value={color.name}
                      onChange={(e) => handleColorChange(idx, "name", e.target.value)}
                      className="flex-1 px-3 py-2 border border-[#eaeaea] rounded-xl text-neutral-900 text-sm font-medium bg-[#fafafa]"
                    />
                    <div className="flex items-center gap-2 border border-[#eaeaea] rounded-xl px-3 py-1 bg-[#fafafa] shrink-0">
                      <input
                        type="color"
                        value={color.hex}
                        onChange={(e) => handleColorChange(idx, "hex", e.target.value)}
                        className="h-8 w-8 cursor-pointer rounded border-0 shrink-0"
                      />
                      <span className="text-xs font-mono font-semibold uppercase">{color.hex}</span>
                    </div>
                    {formColors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveColorInput(idx)}
                        className="p-2 text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-50 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* STATUS TOGGLES */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#eaeaea] pt-6">
              
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-[#eaeaea] rounded-xl">
                <div>
                  <p className="text-sm font-bold text-neutral-700">Stock Availability</p>
                  <p className="text-[10px] text-neutral-400 font-medium">Render item as purchaseable</p>
                </div>
                <select
                  name="inStock"
                  defaultValue={selectedProduct.inStock ? "true" : "false"}
                  className="bg-white border border-[#eaeaea] rounded-lg text-xs font-semibold px-2 py-1"
                >
                  <option value="true">In Stock</option>
                  <option value="false">Out of Stock</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-neutral-50 border border-[#eaeaea] rounded-xl">
                <div>
                  <p className="text-sm font-bold text-neutral-700">Tag as "New"</p>
                  <p className="text-[10px] text-neutral-400 font-medium">Show brand NEW badge in catalog</p>
                </div>
                <select
                  name="isNew"
                  defaultValue={selectedProduct.isNew ? "true" : "false"}
                  className="bg-white border border-[#eaeaea] rounded-lg text-xs font-semibold px-2 py-1"
                >
                  <option value="true">New Arrival</option>
                  <option value="false">Standard Item</option>
                </select>
              </div>

            </div>

            {/* Submit Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[#eaeaea]">
              <button
                type="button"
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-[#eaeaea] text-neutral-500 hover:bg-neutral-50 cursor-pointer active:scale-98"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#064e3b] hover:bg-[#043d2e] shadow-md shadow-[#064e3b]/10 cursor-pointer disabled:opacity-50 active:scale-98"
              >
                {isPending ? "Saving..." : "Update Product"}
              </button>
            </div>

          </form>

        </div>
      )}

    </div>
  )
}
