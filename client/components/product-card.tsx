"use client"

import { useState, memo } from "react"
import Image from "next/image"
import type { Product } from "@/types"
import { COLOR_OPTIONS } from "@/lib/constants"
import { LoadingSpinner } from "./ui/loading"

interface ProductCardProps {
  product: Product
}

const StarRating = memo(({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${rating} out of 5 stars`}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, index) => {
          const fillPercentage = Math.min(
            100,
            Math.max(0, (rating - index) * 100)
          )
          return (
            <div key={index} className="relative w-4 h-4">
              <svg
                className="w-4 h-4 text-border"
                fill="currentColor"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
              </svg>
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <svg
                  className="w-4 h-4 text-[#E6CA97]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                </svg>
              </div>
            </div>
          )
        })}
      </div>
      <span className="font-avenir text-[12px] text-muted-foreground">
        {rating}/5
      </span>
    </div>
  )
})

StarRating.displayName = "StarRating"

function ProductCard({ product }: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0)
  const [imageLoading, setImageLoading] = useState(true)
  const [colorChanging, setColorChanging] = useState(false)

  const currentColor = COLOR_OPTIONS[selectedColorIndex]
  const currentImage = product.images[currentColor.imageKey]

  const handleColorChange = (index: number) => {
    if (index !== selectedColorIndex) {
      setColorChanging(true)
      setImageLoading(true)
      setSelectedColorIndex(index)
    }
  }

  return (
    <article className="bg-card rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 group">
      {/* Product Image */}
      <div className="relative aspect-square bg-secondary">
        {imageLoading && !colorChanging && (
          <div className="absolute inset-0 bg-muted rounded-t-lg z-10" />
        )}
        {colorChanging && (
          <div className="absolute inset-0 bg-muted/80 rounded-t-lg z-10 flex items-center justify-center">
            <LoadingSpinner size="md" className="text-primary" />
          </div>
        )}
        <Image
          src={currentImage || "/placeholder.svg"}
          alt={`${product.name} in ${currentColor.name}`}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
          onLoad={() => {
            setImageLoading(false)
            setColorChanging(false)
          }}
          priority={false}
        />
      </div>

      {/* Product Info */}
      <div className="p-6">
        <h3 className="font-avenir text-[14px] font-normal text-foreground mb-2 line-clamp-2">
          {product.name}
        </h3>

        <p className="font-montserrat text-[15px] font-medium text-foreground mb-4">
          ${product.price.toFixed(2)} USD
        </p>

        {/* Color Picker */}
        <div className="mb-4">
          <p className="font-avenir text-[12px] text-muted-foreground mb-2">
            {currentColor.name}
          </p>
          <div className="flex gap-2" role="radiogroup" aria-label="Color options">
            {COLOR_OPTIONS.map((color, index) => (
              <button
                key={color.name}
                role="radio"
                aria-checked={selectedColorIndex === index}
                aria-label={`Select ${color.name}`}
                disabled={colorChanging}
                className={`w-8 h-8 rounded-full border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 relative ${selectedColorIndex === index
                  ? "border-foreground scale-110"
                  : "border-border hover:border-muted-foreground"
                  } ${colorChanging ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                style={{ backgroundColor: color.hex }}
                onClick={() => handleColorChange(index)}
                title={color.name}
              >
                {colorChanging && selectedColorIndex === index && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <LoadingSpinner size="sm" className="text-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Popularity Score */}
        <StarRating rating={product.popularityScoreOutOf5} />
      </div>
    </article>
  )
}

export default memo(ProductCard)
