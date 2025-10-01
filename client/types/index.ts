export interface ProductImage {
    yellow: string
    white: string
    rose: string
}

export interface Product {
    id: string
    name: string
    popularityScore: number
    popularityScoreOutOf5: number
    weight: number
    price: number
    pricePerGram: number
    images: ProductImage
    category?: string
    description?: string
}

export interface ProductFilters {
    minPrice?: number | undefined
    maxPrice?: number | undefined
    minPopularity?: number | undefined
    maxPopularity?: number | undefined
    category?: string | undefined
    sortBy?: 'price' | 'popularity' | 'name' | undefined
    sortOrder?: 'asc' | 'desc' | undefined
}

export interface FilterInfo {
    applied: {
        priceRange?: { min: number; max: number } | null
        popularityRange?: { min: number; max: number } | null
    }
}

export interface GoldPriceInfo {
    pricePerGram: number
    lastUpdated?: string
    platform?: string
    spreadProfile?: string
    isStale?: boolean
}

export interface ApiResponse<T> {
    success: boolean
    data: T
    total: number
    filters: FilterInfo
    goldPrice?: GoldPriceInfo
    warning?: string
    message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    page: number
    limit: number
    totalPages: number
}

export type ColorOption = 'yellow' | 'white' | 'rose'

export interface ColorConfig {
    name: string
    hex: string
    imageKey: ColorOption
}

export interface Range {
    min: number
    max: number
}

// Error types
export interface ApiError {
    message: string
    code?: string
    status?: number
}

export interface ValidationError extends ApiError {
    field: string
    value: unknown
}
