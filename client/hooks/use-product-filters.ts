import { useState, useMemo } from 'react'
import { useFilteredProducts } from './use-filtered-products'
import { DEFAULT_RANGES } from '@/lib/constants'
import type { ProductFilters, FilterInfo, Product } from '@/types'

interface UseProductFiltersResult {
    filters: ProductFilters
    setFilters: (filters: ProductFilters) => void
    products: Product[]
    total: number
    isLoading: boolean
    error: Error | null
    filterInfo: FilterInfo | null
    ranges: {
        priceRange: { min: number; max: number }
        popularityRange: { min: number; max: number }
    }
    refetch: () => void
}

export const useProductFilters = (): UseProductFiltersResult => {
    const [filters, setFilters] = useState<ProductFilters>({})
    const { data, isLoading, error, refetch } = useFilteredProducts(filters)

    // Get all products for range calculation
    const { data: allProductsData } = useFilteredProducts({})

    const ranges = useMemo(() => {
        const products = allProductsData?.products || []

        if (products.length === 0) {
            return {
                priceRange: DEFAULT_RANGES.PRICE,
                popularityRange: DEFAULT_RANGES.POPULARITY,
            }
        }

        const prices = products.map(p => p.price)
        const popularityScores = products.map(p => p.popularityScore)

        return {
            priceRange: {
                min: Math.floor(Math.min(...prices)),
                max: Math.ceil(Math.max(...prices)),
            },
            popularityRange: {
                min: Math.min(...popularityScores),
                max: Math.max(...popularityScores),
            },
        }
    }, [allProductsData?.products])

    return {
        filters,
        setFilters,
        products: data?.products || [],
        total: data?.total || 0,
        isLoading,
        error,
        filterInfo: data?.filters || null,
        ranges,
        refetch,
    }
}
