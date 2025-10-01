import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { ProductFilters } from './use-filtered-products'

export const useUrlFilters = (): [ProductFilters, (filters: ProductFilters) => void] => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const [filters, setFilters] = useState<ProductFilters>({})

    // Initialize filters from URL params on mount
    useEffect(() => {
        const urlFilters: ProductFilters = {}

        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const minPopularity = searchParams.get('minPopularity')
        const maxPopularity = searchParams.get('maxPopularity')

        if (minPrice) urlFilters.minPrice = parseFloat(minPrice)
        if (maxPrice) urlFilters.maxPrice = parseFloat(maxPrice)
        if (minPopularity) urlFilters.minPopularity = parseFloat(minPopularity)
        if (maxPopularity) urlFilters.maxPopularity = parseFloat(maxPopularity)

        setFilters(urlFilters)
    }, [searchParams])

    const updateFilters = (newFilters: ProductFilters) => {
        setFilters(newFilters)

        // Update URL params
        const params = new URLSearchParams()

        if (newFilters.minPrice !== undefined) {
            params.set('minPrice', newFilters.minPrice.toString())
        }
        if (newFilters.maxPrice !== undefined) {
            params.set('maxPrice', newFilters.maxPrice.toString())
        }
        if (newFilters.minPopularity !== undefined) {
            params.set('minPopularity', newFilters.minPopularity.toString())
        }
        if (newFilters.maxPopularity !== undefined) {
            params.set('maxPopularity', newFilters.maxPopularity.toString())
        }

        // Update URL without triggering a navigation
        const newUrl = params.toString() ? `?${params.toString()}` : '/'
        router.replace(newUrl, { scroll: false })
    }

    return [filters, updateFilters]
}

// Enhanced version that integrates with the main product filters hook
export const useProductFiltersWithUrl = () => {
    const [urlFilters, setUrlFilters] = useUrlFilters()
    const [localFilters, setLocalFilters] = useState<ProductFilters>(urlFilters)

    // Sync local filters with URL filters
    useEffect(() => {
        setLocalFilters(urlFilters)
    }, [urlFilters])

    const updateFilters = (newFilters: ProductFilters) => {
        setLocalFilters(newFilters)
        setUrlFilters(newFilters)
    }

    return {
        filters: localFilters,
        setFilters: updateFilters
    }
}
