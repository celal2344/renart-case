# Renart Product Catalog - Client

A luxury product catalog application built with Next.js.

## 🚀 Features

- **Product Catalog**: Browse luxury jewelry products with detailed information
- **Advanced Filtering**: Filter products by material, category, price range, and popularity
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Performance**: Optimized with React Query for efficient data fetching and caching
- **Type Safety**: Full TypeScript support for better development experience

## 🛠️ Tech Stack

- **Framework**: Next.js 14.2.16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives with shadcn/ui
- **State Management**: React Query (TanStack Query)
- **Icons**: Lucide React
- **Development**: ESLint, TypeScript compiler

## 📦 Installation

1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
# or
pnpm install
```

3. Set up environment variables:
Create a `.env` file in the client directory with your configuration.

## 🏃‍♂️ Running the Application

### Development Mode
```bash
npm run dev
# or
pnpm dev
```
The application will be available at `http://localhost:3000`

### Production Build
```bash
npm run build
npm run start
# or
pnpm build
pnpm start
```

### Other Commands
```bash
# Lint the code
npm run lint

# Fix linting issues
npm run lint:fix

# Type checking
npm run type-check

# Clean build artifacts
npm run clean
```

## 📁 Project Structure

```
client/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── product-card.tsx  # Product display component
│   ├── product-filters.tsx # Filtering interface
│   └── ...
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── types/               # TypeScript type definitions
├── public/              # Static assets
└── styles/              # Global styles
```

## 🎨 UI Components

The application uses a custom design system built on top of Radix UI primitives:

- **Cards**: Product display cards with hover effects
- **Filters**: Advanced filtering interface with sliders and dropdowns
- **Carousel**: Product showcase carousel
- **Loading States**: Skeleton loaders for better UX
- **Error Boundaries**: Graceful error handling

## ⚡ Technical Architecture

### Server-Side Rendering (SSR)
- **Next.js App Router**: Leverages React Server Components for optimal performance
- **Static Generation**: Product pages are statically generated at build time
- **Dynamic Routes**: API routes handle real-time data fetching

### Type Safety
```typescript
// Strict TypeScript configuration
interface Product {
  id: string
  name: string
  material: 'gold' | 'silver' | 'rose-gold'
  category: 'ring' | 'necklace' | 'bracelet' | 'earrings' | 'pendant'
  price: number
  popularity: number
}
```

### React Query Implementation
```typescript
// Efficient data fetching with caching
const { data: products, isLoading, error } = useQuery({
  queryKey: ['products', filters],
  queryFn: () => fetchProducts(filters),
  staleTime: 5 * 60 * 1000, // 5 minutes
  refetchOnWindowFocus: false
})
```

### API Client
```typescript
// Centralized API configuration
const api = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  endpoints: {
    products: '/api/products',
    filters: '/api/products/filters'
  }
}
```

### Linting & Code Quality
- **ESLint**: Next.js optimized configuration
- **TypeScript**: Strict mode enabled with `noEmit` checks
- **Prettier**: Code formatting (configured in `.prettierrc`)
- **Husky**: Pre-commit hooks for quality assurance

## 🔧 Key Features

- Product Filtering with real-time updates
- URL synchronization for shareable filter states
- Optimistic UI updates with React Query
- Image optimization with Next.js Image component
- Progressive loading and skeleton states

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- ARIA labels and proper semantic HTML
- High contrast design

## 📄 License

This project is private and proprietary to Renart.
