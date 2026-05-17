"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = React.useState(0)

  return (
    <div className="flex flex-col-reverse lg:flex-row gap-4">
      {/* Thumbnails */}
      <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:w-24 pb-2 lg:pb-0 hide-scrollbar">
        {images.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setActiveImage(idx)}
            className={`relative aspect-[3/4] w-20 lg:w-full flex-shrink-0 overflow-hidden bg-secondary transition-all ${
              activeImage === idx ? "ring-2 ring-primary ring-offset-2" : "opacity-70 hover:opacity-100"
            }`}
          >
            {/* Real image goes here */}
            <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
              Img {idx + 1}
            </div>
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="relative aspect-[3/4] flex-1 overflow-hidden bg-secondary rounded-lg">
        <motion.div
          key={activeImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center text-muted-foreground/30"
        >
           <span className="text-xl uppercase tracking-widest">{productName} Image</span>
        </motion.div>
      </div>
    </div>
  )
}
