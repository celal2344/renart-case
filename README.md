## Overview

This application consists of two main components:
- **Frontend** (Next.js): Modern product catalog with filtering and responsive design
- **Backend** (Express.js): API server with real-time gold price integration

## Features

### Frontend
- **Advanced Filtering**: Filter by price range and popularity score  
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Built with Radix UI components and Tailwind CSS
- **Type Safety**: Full TypeScript support

### Backend
- **Real-time Gold Pricing**: Automatic gold price updates via external API
- **Security**: Rate limiting, CORS, and Helmet middleware
- **API Documentation**: Interactive Swagger documentation

## Tech Stack

**Frontend:**
- Next.js 14, React 18, TypeScript
- Tailwind CSS, Radix UI

**Backend:**
- Node.js, Express.js

## Quick Start

### Local Development

1. **Install dependencies for both client and server:**
   ```bash
   # Install client dependencies
   cd client
   npm install
   
   # Install server dependencies  
   cd ../server
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   # In server directory
   cp .env.example .env
   # Edit .env with your configuration
   
   # In client directory  
   cp .env.example .env
   # Set NEXT_PUBLIC_API_URL to your API server
   ```

3. **Start the development servers:**
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm run dev
   
   # Terminal 2 - Start frontend  
   cd client
   npm run dev
   ```

4. **Access the application:**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Backend API: [http://localhost:5000](http://localhost:5000)
   - API Documentation: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)


## Vercel Deployment

- **Frontend**: Deployed as Next.js app from `/client`
- **Backend**: Deployed as serverless functions from `/server`
- **Unified routing**: API calls routed to server, everything else to client


## Environment Variables

### Server (.env)
```bash
PORT=5000
NODE_ENV=development

API_PREFIX=/api
API_VERSION=v1

RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

SWISSQUOTE_API_URL=https://forex-data-feed.swissquote.com/public-quotes/bboquotes/instrument/XAU/USD

CORS_ORIGIN=*

SWAGGER_TITLE=Jewelry Store API
SWAGGER_DESCRIPTION=API for managing jewelry products with real-time gold pricing
SWAGGER_VERSION=1.0.0

```

### Client (.env.local)
```bash
NEXT_PUBLIC_API_URL = http://localhost:5000
BACKEND_URL = http://localhost:5000
```
