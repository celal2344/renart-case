"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, Star, Package } from "lucide-react"
import type { Product } from "@/types"

interface ProductSummaryProps {
    products: Product[]
    total: number
    isFiltered: boolean
    loading?: boolean
}

export default function ProductSummary({ products, total, isFiltered, loading }: ProductSummaryProps) {
    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-sm text-muted-foreground">Loading summary...</div>
                </CardContent>
            </Card>
        )
    }

    if (products.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="text-center">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No products found</h3>
                        <p className="text-sm text-muted-foreground">
                            {isFiltered
                                ? "Try adjusting your filters to see more products."
                                : "No products are currently available."
                            }
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    // Calculate statistics
    const prices = products.map(p => p.price)
    const popularityScores = products.map(p => p.popularityScore)
    const weights = products.map(p => p.weight)

    const stats = {
        avgPrice: prices.reduce((sum, price) => sum + price, 0) / prices.length,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        avgPopularity: popularityScores.reduce((sum, score) => sum + score, 0) / popularityScores.length,
        totalWeight: weights.reduce((sum, weight) => sum + weight, 0),
        avgWeight: weights.reduce((sum, weight) => sum + weight, 0) / weights.length
    }

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">
                        {isFiltered ? 'Filtered ' : ''}Product Summary
                    </h3>
                    <Badge variant="secondary">
                        {total} product{total !== 1 ? 's' : ''}
                    </Badge>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                            <DollarSign className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                            <div className="text-sm font-medium">${stats.avgPrice.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">Avg Price</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                            <TrendingUp className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium">${stats.minPrice.toFixed(2)} - ${stats.maxPrice.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">Price Range</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                            <Star className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium">{(stats.avgPopularity * 5).toFixed(1)}/5</div>
                            <div className="text-xs text-muted-foreground">Avg Rating</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                            <Package className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <div className="text-sm font-medium">{stats.avgWeight.toFixed(1)}g</div>
                            <div className="text-xs text-muted-foreground">Avg Weight</div>
                        </div>
                    </div>
                </div>

                {isFiltered && (
                    <div className="mt-4 pt-4 border-t">
                        <div className="text-xs text-muted-foreground">
                            Showing filtered results. Total weight: {stats.totalWeight.toFixed(1)}g
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
