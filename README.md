# Random Phone Number Generator API

A RESTful API service that generates random U.S. phone numbers following the North American Numbering Plan (NANP) format.

## Features

- Generate single random phone numbers
- Generate multiple phone numbers in bulk
- Multiple output formats (plain, dashed, parentheses, dotted)
- Valid area codes and exchange codes
- Rate limiting
- API key authentication
- Request logging
- Health monitoring
- Docker support with Redis caching

## Quick Start

### Local Development

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment file and configure:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Docker Deployment

1. Build and start the containers:
   ```bash
   docker-compose up -d
   ```
2. The API will be available at `http://localhost:3000`

## API Documentation

### Endpoints

#### 1. Generate Single Phone Number
```http
GET /api/phone
```

Query Parameters:
- `format` (optional): Output format (plain, dashed, parentheses, dotted)

Example Response:
```json
{
  "request_id": "req_123abc",
  "timestamp": "2023-12-20T10:30:00Z",
  "data": {
    "formatted": "555-123-4567",
    "raw": {
      "areaCode": "555",
      "exchange": "123",
      "lineNumber": "4567"
    },
    "format": "dashed"
  },
  "metadata": {
    "rate_limit_remaining": 98,
    "rate_limit_reset": "2023-12-20T10:31:00Z"
  }
}
```

#### 2. Generate Multiple Phone Numbers
```http
GET /api/phone/bulk
```

Query Parameters:
- `count` (optional): Number of phone numbers to generate (1-1000, default: 10)
- `format` (optional): Output format (plain, dashed, parentheses, dotted)

#### 3. List Available Formats
```http
GET /api/formats
```

#### 4. List Valid Area Codes
```http
GET /api/area-codes
```

### Authentication

Include your API key in the request headers:
```http
X-API-Key: your-api-key
```

### Rate Limiting

- Default: 100 requests per 15 minutes
- Headers included in response:
  - X-RateLimit-Limit
  - X-RateLimit-Remaining
  - X-RateLimit-Reset

## Configuration

Environment variables (see .env.example):

- \`PORT\`: Server port (default: 3000)
- \`NODE_ENV\`: Environment (development/production)
- \`RATE_LIMIT_WINDOW\`: Rate limit window in ms
- \`RATE_LIMIT_MAX\`: Maximum requests per window
- \`REDIS_HOST\`: Redis host
- \`REDIS_PORT\`: Redis port
- \`API_KEYS\`: Comma-separated list of valid API keys
- \`CORS_ORIGIN\`: Allowed CORS origins
- \`LOG_LEVEL\`: Logging level
- \`LOG_FILE\`: Log file path

## Docker Deployment

The application includes a multi-stage Dockerfile and docker-compose configuration with:

- Node.js application container
- Redis cache container
- Volume mounting for logs
- Health checks
- Resource limits
- Non-root user security
- Bridge network

### Production Deployment Considerations

1. Set appropriate environment variables
2. Configure proper API keys
3. Set CORS origins
4. Adjust rate limiting
5. Configure logging
6. Set up monitoring
7. Use proper SSL/TLS termination
8. Configure backup strategy for Redis

## Development

### Running Tests
```bash
# Run tests with coverage
npm test

# Watch mode
npm run test:watch
```

### Linting
```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## Security Features

- API key authentication
- Rate limiting
- CORS configuration
- Security headers (helmet)
- Input validation
- Non-root Docker user
- Request validation
- Error handling

## Monitoring and Logging

- Winston logger
- Request/Response logging
- Error tracking
- Health check endpoint
- Docker health checks
- Resource monitoring

## License

ISC
