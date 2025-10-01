# Jewelry Store API

An Node.js + Express.js server that returns products data with real time gold prices.

## Features

- Real-time gold price updates
- Swagger API documentation
- Security middleware (helmet, rate limiting)
- CORS support

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

The server runs on `http://localhost:5000` by default.

- **API Documentation**: `/api-docs`
- **Products**: `/api/products`
- **Health Check**: `/api/health`