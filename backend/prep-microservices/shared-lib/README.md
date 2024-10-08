README.md

# Shared Library for Microservices

This shared library provides common utilities, middleware, and helper functions that can be used across multiple microservices in the Prep&Post application.

## Installation

To use this shared library in your microservice, add it to your `package.json` dependencies:

```json
"dependencies": {
  "shared-lib": "file:../shared-lib"
}
```

Then run `npm install` to install the shared library.

## Usage

Import the required modules from the shared library in your microservice:

```javascript
const {
  logger,
  errorHandler,
  rateLimiter,
  validateRequest,
  authMiddleware,
  kafkaProducer,
  redis,
  constants,
  ApiError,
  asyncHandler,
  encrypt,
  jwtUtils,
} = require("shared-lib");
```

## Available Modules

- `logger`: Winston-based logger for consistent logging across services
- `errorHandler`: Express middleware for centralized error handling
- `rateLimiter`: Redis-based rate limiting middleware
- `validateRequest`: Request validation middleware using Joi
- `authMiddleware`: JWT-based authentication middleware
- `kafkaProducer`: Utility for producing Kafka messages
- `redis`: Redis client for caching and other Redis operations
- `constants`: Shared constants and configuration values
- `ApiError`: Custom error class for API errors
- `asyncHandler`: Utility for handling async Express route handlers
- `encrypt`: Password encryption and comparison utilities
- `jwtUtils`: JWT token generation and verification utilities

## Contributing

To contribute to this shared library, please follow these steps:

1. Create a new branch for your feature or bug fix
2. Make your changes and add tests if applicable
3. Run the test suite using `npm test`
4. Submit a pull request with a description of your changes

## License

This shared library is proprietary and confidential. Unauthorized copying, transfer or use in source and binary forms, with or without modification, is strictly prohibited.
