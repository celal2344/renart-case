"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter, RotateCcw } from "lucide-react"
import type { ProductFilters, Range } from "@/types"

interface ProductFiltersProps {
    filters: ProductFilters
    onFiltersChange: (filters: ProductFilters) => void
    priceRange?: Range
    popularityRange?: Range
    isLoading?: boolean
    resultCount?: number
}

export default function ProductFilters({
    filters,
    onFiltersChange,
    priceRange = { min: 0, max: 10000 },
    popularityRange = { min: 0, max: 1 },
    isLoading = false,
    resultCount
}: ProductFiltersProps) {
    const [localFilters, setLocalFilters] = useState<ProductFilters>(filters)
    const [showFilters, setShowFilters] = useState(false)

    useEffect(() => {
        setLocalFilters(filters)
    }, [filters])

    const handleApplyFilters = () => {
        onFiltersChange(localFilters)
    }

    const handleResetFilters = () => {
        const emptyFilters: ProductFilters = {}
        setLocalFilters(emptyFilters)
        onFiltersChange(emptyFilters)
    }

    const handlePriceChange = (type: 'min' | 'max', value: string) => {
        const numValue = value === '' ? undefined : Number(value)
        setLocalFilters(prev => ({
            ...prev,
            [type === 'min' ? 'minPrice' : 'maxPrice']: numValue
        }))
    }

    const handlePopularitySliderChange = (values: number[]) => {
        setLocalFilters(prev => ({
            ...prev,
            minPopularity: values[0],
            maxPopularity: values[1]
        }))
    }

    const getActiveFiltersCount = () => {
        let count = 0
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) count++
        if (filters.minPopularity !== undefined || filters.maxPopularity !== undefined) count++
        return count
    }

    const activeFiltersCount = getActiveFiltersCount()

    return (
        <div className="w-full space-y-4">
            {/* Filter Toggle and Summary */}
            <div className="flex items-center justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFilters(!showFilters)}
                    className="gap-2"
                >
                    <Filter className="h-4 w-4" />
                    Filters
                    {activeFiltersCount > 0 && (
                        <Badge variant="secondary" className="ml-1">
                            {activeFiltersCount}
                        </Badge>
                    )}
                </Button>

                <div className="flex items-center gap-4">
                    {resultCount !== undefined && (
                        <span className="text-sm text-muted-foreground">
                            {resultCount} products found
                        </span>
                    )}
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleResetFilters}
                            className="gap-2"
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </Button>
                    )}
                </div>
            </div>

            {/* Active Filters Display */}
            {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2">
                    {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                        <Badge variant="secondary" className="gap-1">
                            Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => onFiltersChange({ ...filters, minPrice: undefined, maxPrice: undefined })}
                            />
                        </Badge>
                    )}
                    {(filters.minPopularity !== undefined || filters.maxPopularity !== undefined) && (
                        <Badge variant="secondary" className="gap-1">
                            Popularity: {((filters.minPopularity || 0) * 5).toFixed(1)} - {((filters.maxPopularity || 1) * 5).toFixed(1)}/5
                            <X
                                className="h-3 w-3 cursor-pointer"
                                onClick={() => onFiltersChange({ ...filters, minPopularity: undefined, maxPopularity: undefined })}
                            />
                        </Badge>
                    )}
                </div>
            )}

            {/* Filter Panel */}
            {showFilters && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Filter Products</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Price Range */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Price Range ($)</Label>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <Label htmlFor="minPrice" className="text-xs text-muted-foreground">
                                        Min Price
                                    </Label>
                                    <Input
                                        id="minPrice"
                                        type="number"
                                        placeholder={`${priceRange.min}`}
                                        value={localFilters.minPrice || ''}
                                        onChange={(e) => handlePriceChange('min', e.target.value)}
                                        min={priceRange.min}
                                        max={priceRange.max}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="maxPrice" className="text-xs text-muted-foreground">
                                        Max Price
                                    </Label>
                                    <Input
                                        id="maxPrice"
                                        type="number"
                                        placeholder={`${priceRange.max}`}
                                        value={localFilters.maxPrice || ''}
                                        onChange={(e) => handlePriceChange('max', e.target.value)}
                                        min={priceRange.min}
                                        max={priceRange.max}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Popularity Range */}
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">
                                Popularity Score
                                <span className="text-xs text-muted-foreground ml-1">
                                    ({((localFilters.minPopularity || popularityRange.min) * 5).toFixed(1)} - {((localFilters.maxPopularity || popularityRange.max) * 5).toFixed(1)}/5)
                                </span>
                            </Label>
                            <div className="px-3">
                                <Slider
                                    value={[
                                        localFilters.minPopularity || popularityRange.min,
                                        localFilters.maxPopularity || popularityRange.max
                                    ]}
                                    onValueChange={handlePopularitySliderChange}
                                    min={popularityRange.min}
                                    max={popularityRange.max}
                                    step={0.1}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{(popularityRange.min * 5).toFixed(1)}/5</span>
                                <span>{(popularityRange.max * 5).toFixed(1)}/5</span>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                onClick={handleApplyFilters}
                                disabled={isLoading}
                                className="flex-1"
                            >
                                {isLoading ? 'Applying...' : 'Apply Filters'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handleResetFilters}
                                disabled={isLoading}
                            >
                                Reset
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}
