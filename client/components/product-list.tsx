"use client"

import ProductCarousel from "./product-carousel"
import ProductFilters from "./product-filters"
import { useProductFilters } from "@/hooks/use-product-filters"
import { ProductListSkeleton } from "@/components/ui/loading"
import { ErrorFallback } from "@/components/error-boundary"

export default function ProductList() {
  const {
    filters,
    setFilters,
    products,
    total,
    isLoading,
    error,
    ranges,
    refetch
  } = useProductFilters()

  if (isLoading) {
    return <ProductListSkeleton />
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <ErrorFallback
          error={error}
          resetError={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <header>
        <h1 className="font-avenir text-[45px] font-normal leading-tight text-foreground text-center">
          Product List
        </h1>
      </header>


      <ProductFilters
        filters={filters}
        onFiltersChange={setFilters}
        priceRange={ranges.priceRange}
        popularityRange={ranges.popularityRange}
        isLoading={isLoading}
        resultCount={total}
      />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <svg
              className="h-10 w-10 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground max-w-md">
            Try adjusting your filters or browse all products to find what you&apos;re looking for.
          </p>
        </div>
      ) : (
        <ProductCarousel products={products} />
      )}
    </div>
  )
}
