import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
    size?: "sm" | "md" | "lg"
    className?: string
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
    return (
        <div
            className={cn(
                "animate-spin rounded-full border-2 border-muted border-t-primary",
                {
                    "h-4 w-4": size === "sm",
                    "h-8 w-8": size === "md",
                    "h-12 w-12": size === "lg",
                },
                className
            )}
        />
    )
}

export function LoadingCard() {
    return (
        <div className="bg-card rounded-lg overflow-hidden shadow-sm animate-pulse">
            <div className="aspect-square bg-muted" />
            <div className="p-6 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-5 bg-muted rounded w-1/2" />
                <div className="space-y-2">
                    <div className="h-3 bg-muted rounded w-1/3" />
                    <div className="flex gap-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-8 w-8 bg-muted rounded-full" />
                        ))}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="h-4 w-4 bg-muted rounded" />
                        ))}
                    </div>
                    <div className="h-3 bg-muted rounded w-12" />
                </div>
            </div>
        </div>
    )
}

export function ProductListSkeleton() {
    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <div className="h-16 bg-muted rounded w-1/3 animate-pulse" />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div className="h-10 bg-muted rounded w-24 animate-pulse" />
                    <div className="h-4 bg-muted rounded w-32 animate-pulse" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <LoadingCard key={i} />
                ))}
            </div>
        </div>
    )
}
