"use client"

import { Component, ReactNode, ErrorInfo } from "react"
import { AlertTriangle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ErrorBoundaryState {
    hasError: boolean
    error?: Error
}

interface ErrorBoundaryProps {
    children: ReactNode
    fallback?: ReactNode
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error }
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error caught by boundary:", error, errorInfo)
    }

    handleReset = () => {
        this.setState({ hasError: false, error: undefined })
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback
            }

            return (
                <div className="flex items-center justify-center min-h-[400px] p-4">
                    <Card className="w-full max-w-md">
                        <CardHeader className="text-center">
                            <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                            <CardTitle>Something went wrong</CardTitle>
                            <CardDescription>
                                An unexpected error occurred. Please try refreshing the page.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {process.env.NODE_ENV === "development" && this.state.error && (
                                <div className="p-3 bg-muted rounded-md">
                                    <code className="text-sm text-muted-foreground">
                                        {this.state.error.message}
                                    </code>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <Button onClick={this.handleReset} className="flex-1">
                                    <RefreshCw className="h-4 w-4 mr-2" />
                                    Try Again
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => window.location.reload()}
                                    className="flex-1"
                                >
                                    Refresh Page
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )
        }

        return this.props.children
    }
}

// Hook version for functional components
export function ErrorFallback({
    error,
    resetError
}: {
    error: Error
    resetError: () => void
}) {
    return (
        <div className="flex items-center justify-center min-h-[200px] p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <CardTitle>Oops! Something went wrong</CardTitle>
                    <CardDescription>
                        {error.message || "An unexpected error occurred"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button onClick={resetError} className="w-full">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Try Again
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
