import type { ColorConfig } from '@/types'

export const COLOR_OPTIONS: ColorConfig[] = [
    { name: "Yellow Gold", hex: "#E6CA97", imageKey: "yellow" },
    { name: "White Gold", hex: "#D9D9D9", imageKey: "white" },
    { name: "Rose Gold", hex: "#E1A4A9", imageKey: "rose" },
] as const

export const API_ENDPOINTS = {
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id: string) => `/products/${id}`,
} as const

export const QUERY_KEYS = {
    PRODUCTS: ['products'],
    FILTERED_PRODUCTS: (filters: object) => ['products', 'filtered', filters],
    PRODUCT: (id: string) => ['products', id],
} as const

export const DEFAULT_RANGES = {
    PRICE: { min: 0, max: 10000 },
    POPULARITY: { min: 0, max: 1 },
} as const

export const CAROUSEL_SETTINGS = {
    ITEMS_PER_VIEW: {
        mobile: 1 as const,
        tablet: 2 as const,
        desktop: 4 as const,
    },
    BREAKPOINTS: {
        mobile: 768,
        tablet: 1024,
    },
} as const

export const CACHE_TIMES = {
    STALE_TIME: 1000 * 60 * 3, // 3 minutes
    GC_TIME: 1000 * 60 * 5, // 5 minutes
} as const

export const ANIMATION_DURATIONS = {
    FAST: 150,
    NORMAL: 200,
    SLOW: 300,
} as const
