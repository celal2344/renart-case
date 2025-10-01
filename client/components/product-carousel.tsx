"use client"

import { useState, useEffect } from "react"
import ProductCard from "./product-card"
import type { Product } from "@/types"
import { CAROUSEL_SETTINGS } from "@/lib/constants"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"

interface ProductCarouselProps {
  products: Product[]
}

export default function ProductCarousel({ products }: ProductCarouselProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [itemsVisible, setItemsVisible] = useState<1 | 2 | 4>(CAROUSEL_SETTINGS.ITEMS_PER_VIEW.desktop)

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < CAROUSEL_SETTINGS.BREAKPOINTS.mobile) {
        setItemsVisible(CAROUSEL_SETTINGS.ITEMS_PER_VIEW.mobile)
      } else if (width < CAROUSEL_SETTINGS.BREAKPOINTS.tablet) {
        setItemsVisible(CAROUSEL_SETTINGS.ITEMS_PER_VIEW.tablet)
      } else {
        setItemsVisible(CAROUSEL_SETTINGS.ITEMS_PER_VIEW.desktop)
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    if (!api) return

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  if (products.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <p className="text-muted-foreground">No products to display</p>
      </div>
    )
  }

  const getItemClassName = () => {
    switch (itemsVisible) {
      case 1: return "basis-full"
      case 2: return "basis-1/2"
      case 4: return "basis-1/4"
      default: return "basis-1/4"
    }
  }

  return (
    <div className="relative">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: products.length > itemsVisible,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {products.map((product, index) => (
            <CarouselItem
              key={product.id || `product-${index}`}
              className={`pl-2 md:pl-4 ${getItemClassName()}`}
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {products.length > itemsVisible && (
          <>
            <CarouselPrevious className="left-0 -translate-x-4 bg-card shadow-lg hover:bg-secondary" />
            <CarouselNext className="right-0 translate-x-4 bg-card shadow-lg hover:bg-secondary" />
          </>
        )}
      </Carousel>

      {/* Dots Indicator */}
      {count > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {Array.from({ length: count }).map((_, index) => (
            <button
              key={index}
              className={`h-2 rounded-full transition-all ${index === current - 1 ? "w-8 bg-primary" : "w-2 bg-border"
                }`}
              onClick={() => api?.scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
