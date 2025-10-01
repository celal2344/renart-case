import { NextRequest, NextResponse } from 'next/server'
import type { Product } from '@/types'

interface ProductFilters {
    minPrice?: number
    maxPrice?: number
    minPopularity?: number
    maxPopularity?: number
}

interface FilterInfo {
    applied: {
        priceRange?: { min: number; max: number } | null
        popularityRange?: { min: number; max: number } | null
    }
}

interface ApiResponse {
    success: boolean
    data: Product[]
    total: number
    filters: FilterInfo
}

async function fetchFromBackend(filters: ProductFilters): Promise<ApiResponse> {
    // In production on Vercel, make requests to the server via internal routing
    // In development, use the backend server URL
    let backendUrl: string

    if (process.env.NODE_ENV === 'production') {
        // In production, use relative URL - Vercel will route internally
        backendUrl = ''
    } else {
        // In development, use the backend server URL
        backendUrl = process.env.BACKEND_URL || 'http://localhost:5000'
    }

    const params = new URLSearchParams()

    if (filters.minPrice !== undefined) params.append('minPrice', filters.minPrice.toString())
    if (filters.maxPrice !== undefined) params.append('maxPrice', filters.maxPrice.toString())
    if (filters.minPopularity !== undefined) params.append('minPopularity', filters.minPopularity.toString())
    if (filters.maxPopularity !== undefined) params.append('maxPopularity', filters.maxPopularity.toString())

    const url = params.toString()
        ? `${backendUrl}/api/products?${params.toString()}`
        : `${backendUrl}/api/products`

    const response = await fetch(url, {
        headers: {
            'Content-Type': 'application/json',
        },
        // Add cache control for performance
        next: { revalidate: 60 } // Revalidate every 60 seconds
    })

    if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`)
    }

    return response.json()
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    try {
        const filters: ProductFilters = {}

        const minPrice = searchParams.get('minPrice')
        const maxPrice = searchParams.get('maxPrice')
        const minPopularity = searchParams.get('minPopularity')
        const maxPopularity = searchParams.get('maxPopularity')

        if (minPrice !== null) filters.minPrice = parseFloat(minPrice)
        if (maxPrice !== null) filters.maxPrice = parseFloat(maxPrice)
        if (minPopularity !== null) filters.minPopularity = parseFloat(minPopularity)
        if (maxPopularity !== null) filters.maxPopularity = parseFloat(maxPopularity)

        const data = await fetchFromBackend(filters)

        return NextResponse.json(data, {
            headers: {
                'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
            },
        })
    } catch (error) {
        console.error('API Route Error:', error)
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch products',
                error: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

// Export types for use in other files
export type { ProductFilters, FilterInfo, ApiResponse }
