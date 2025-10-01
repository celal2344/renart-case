import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api'
import { QUERY_KEYS, CACHE_TIMES } from '@/lib/constants'
import type { ProductFilters } from '@/types'

export const useFilteredProducts = (filters: ProductFilters = {}) => {
    return useQuery({
        queryKey: QUERY_KEYS.FILTERED_PRODUCTS(filters),
        queryFn: () => apiClient.getProducts(filters),
        staleTime: CACHE_TIMES.STALE_TIME,
        gcTime: CACHE_TIMES.GC_TIME,
    })
}

export type { ProductFilters }
