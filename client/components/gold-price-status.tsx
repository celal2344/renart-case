"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { GoldPriceInfo } from "@/types"
import { AlertTriangle, Clock, DollarSign } from "lucide-react"

interface GoldPriceStatusProps {
    goldPrice?: GoldPriceInfo
    warning?: string
}

export function GoldPriceStatus({ goldPrice, warning }: GoldPriceStatusProps) {
    if (!goldPrice && !warning) {
        return null
    }

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Unknown'
        return new Date(dateString).toLocaleString()
    }

    return (
        <div className="space-y-2">
            {warning && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{warning}</AlertDescription>
                </Alert>
            )}
            
            {goldPrice && (
                <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Gold: ${goldPrice.pricePerGram}/gram</span>
                    </div>
                    
                    {goldPrice.lastUpdated && (
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Updated: {formatDate(goldPrice.lastUpdated)}</span>
                        </div>
                    )}
                    
                    {goldPrice.isStale && (
                        <Badge variant="outline" className="text-yellow-600">
                            Stale Data
                        </Badge>
                    )}
                    
                    {goldPrice.platform && (
                        <Badge variant="secondary">
                            {goldPrice.platform}
                        </Badge>
                    )}
                </div>
            )}
        </div>
    )
}
