import type { Product, ProductFilters, ApiResponse, ApiError, FilterInfo, GoldPriceInfo } from '@/types'
import { API_ENDPOINTS } from '@/lib/constants'

class ApiClient {
    private baseUrl: string

    constructor() {
        // In production, API calls will be routed to /api which maps to the server
        // In development, use the full localhost URL
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
        this.baseUrl = `${apiUrl}/api`
    }

    private async request<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${this.baseUrl}${endpoint}`

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
                ...options,
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(
                    errorData.message || `HTTP error! status: ${response.status}`
                )
            }

            const data = await response.json()

            if (!data.success) {
                throw new Error(data.message || 'API request failed')
            }

            return data
        } catch (error) {
            if (error instanceof Error) {
                throw error
            }
            throw new Error('Network error occurred')
        }
    }

    async getProducts(filters: ProductFilters = {}): Promise<{
        products: Product[]
        total: number
        filters: FilterInfo
        goldPrice?: GoldPriceInfo
        warning?: string
    }> {
        const params = new URLSearchParams()

        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                params.append(key, value.toString())
            }
        })

        const queryString = params.toString()
        const endpoint = queryString
            ? `${API_ENDPOINTS.PRODUCTS}?${queryString}`
            : API_ENDPOINTS.PRODUCTS

        const response = await this.request<ApiResponse<Product[]>>(endpoint)

        return {
            products: response.data,
            total: response.total,
            filters: response.filters,
            goldPrice: response.goldPrice,
            warning: response.warning,
        }
    }
}

export const apiClient = new ApiClient()
export const isApiError = (error: unknown): error is ApiError => {
    return (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as Record<string, unknown>).message === 'string'
    )
}

export const getErrorMessage = (error: unknown): string => {
    if (isApiError(error)) {
        return error.message
    }
    if (error instanceof Error) {
        return error.message
    }
    return 'An unexpected error occurred'
}
