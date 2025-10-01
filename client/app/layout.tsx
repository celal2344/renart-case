import type { Metadata } from "next"
import { Suspense } from "react"
import { Montserrat } from "next/font/google"
import QueryProvider from "@/components/query-provider"
import { ErrorBoundary } from "@/components/error-boundary"
import { LoadingSpinner } from "@/components/ui/loading"
import "@/styles/globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["400", "500"],
})

export const metadata: Metadata = {
  title: "Renart Product Catalog",
  description: "Luxury product showcase - Case Study",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <link
          href="https://db.onlinewebfonts.com/c/1dc8ecd69ac240c2aa8b2a4308e7c2fc?family=Avenir+Book"
          rel="stylesheet"
        />
      </head>
      <body className="font-avenir antialiased bg-background text-foreground">
        <ErrorBoundary>
          <QueryProvider>
            <Suspense
              fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <LoadingSpinner size="lg" />
                </div>
              }
            >
              {children}
            </Suspense>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
