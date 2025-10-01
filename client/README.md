# Renart Product Catalog

A modern, responsive product catalog built with Next.js 14, showcasing luxury jewelry with filtering capabilities.

## Features

- **Product Showcase**: Display products with multiple color variants
- **Advanced Filtering**: Filter by price range and popularity score
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Image Optimization**: Optimized images with Next.js Image component
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **Type Safety**: Full TypeScript support

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **State Management**: TanStack Query for server state
- **Image Handling**: Next.js optimized images

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   Update `NEXT_PUBLIC_API_URL` to point to your API server.

3. **Run the development server**:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
client/
├── app/                    # Next.js app directory
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── product-card.tsx  # Product display component
│   ├── product-carousel.tsx
│   ├── product-filters.tsx
│   └── product-list.tsx
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configurations
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Key Components

### ProductList
Main component that orchestrates the product display, filtering, and loading states.

### ProductCarousel
Responsive carousel component that adapts to different screen sizes.

### ProductFilters
Advanced filtering interface with price and popularity range controls.

### ProductCard
Individual product display with color selection and rating visualization.

## API Integration

The application expects a REST API with the following endpoints:

- `GET /api/products` - Get all products with optional filtering
- Query parameters: `minPrice`, `maxPrice`, `minPopularity`, `maxPopularity`

## Design Decisions

- **Mobile-first**: Responsive design starting from mobile
- **Performance**: Image optimization and efficient caching
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **User Experience**: Smooth transitions and loading states
- **Type Safety**: Comprehensive TypeScript coverage

## Development

```bash
# Development
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Build
npm run build
npm run start
```
