"use client"

import * as React from "react"
import { UploadCloud, X, ImageIcon, Loader2 } from "lucide-react"

interface ImageUploaderProps {
  /** Existing image URLs already saved on the product (shown as previews) */
  existingImages?: string[]
  /** Called whenever the final confirmed list of image paths changes */
  onChange: (paths: string[]) => void
}

export function ImageUploader({ existingImages = [], onChange }: ImageUploaderProps) {
  const [previews, setPreviews] = React.useState<string[]>(existingImages)
  const [isUploading, setIsUploading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  // Sync upward whenever previews change
  React.useEffect(() => {
    onChange(previews)
  }, [previews]) // eslint-disable-line react-hooks/exhaustive-deps

  const uploadFiles = async (files: FileList | File[]) => {
    setError(null)
    setIsUploading(true)

    const form = new FormData()
    Array.from(files).forEach((f) => form.append("files", f))

    try {
      const res = await fetch("/api/upload", { method: "POST", body: form })
      const data = await res.json()

      if (!data.success) {
        setError(data.error || "Upload failed.")
      } else {
        setPreviews((prev) => {
          const next = [...prev, ...data.paths]
          return next
        })
      }
    } catch {
      setError("Network error. Could not reach the upload server.")
    } finally {
      setIsUploading(false)
      // Reset file input so the same file can be picked again
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files)
    }
  }

  const handleRemove = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Resolve full URL: if it starts with /uploads it's served by storefront on :3000,
  // otherwise it's an absolute path already.
  const resolvePreviewUrl = (path: string) => {
    if (path.startsWith("/uploads/")) {
      return `http://localhost:3000${path}`
    }
    return path
  }

  return (
    <div className="space-y-4">
      
      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl px-6 py-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
          isDragOver
            ? "border-[#064e3b] bg-[#064e3b]/5"
            : "border-[#eaeaea] hover:border-neutral-300 bg-[#fafafa]"
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        {isUploading ? (
          <>
            <Loader2 className="h-8 w-8 text-[#064e3b] animate-spin" />
            <p className="text-sm font-semibold text-neutral-500">Uploading...</p>
          </>
        ) : (
          <>
            <div className="h-12 w-12 rounded-full bg-[#064e3b]/5 flex items-center justify-center text-[#064e3b]">
              <UploadCloud className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-neutral-700">
                Drag & drop images here, or <span className="text-[#064e3b] underline">click to browse</span>
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                JPG, PNG, WebP, GIF — max 5MB per file. Multiple allowed.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="flex items-center gap-2 text-red-700 text-xs font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <X className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Image Previews Grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {previews.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="relative aspect-square rounded-xl overflow-hidden border border-[#eaeaea] bg-neutral-100 group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvePreviewUrl(src)}
                alt={`Product image ${idx + 1}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback if image not yet served
                  const target = e.target as HTMLImageElement
                  target.style.display = "none"
                  target.parentElement!.querySelector(".fallback")!.classList.remove("hidden")
                }}
              />

              {/* Fallback placeholder if image fails */}
              <div className="fallback hidden absolute inset-0 flex items-center justify-center text-neutral-400">
                <ImageIcon className="h-6 w-6" />
              </div>

              {/* Position badge */}
              <span className="absolute bottom-1 left-1.5 text-[10px] font-bold bg-black/50 text-white px-1.5 py-0.5 rounded">
                {idx + 1}
              </span>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1.5 right-1.5 h-6 w-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {previews.length === 0 && !isUploading && (
        <p className="text-xs text-neutral-400 text-center font-medium">
          No images yet. Upload at least one for this product.
        </p>
      )}
    </div>
  )
}
