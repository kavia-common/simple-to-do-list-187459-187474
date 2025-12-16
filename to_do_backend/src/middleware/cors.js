import cors from 'cors';

/**
 * PUBLIC_INTERFACE
 * createCorsMiddleware
 * Creates a CORS middleware configured to allow the FRONTEND_URL origin.
 * Falls back to http://localhost:3000 when FRONTEND_URL is not provided.
 * Also sets common headers for JSON APIs.
 */
export function createCorsMiddleware() {
  const allowedOrigin = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/+$/, '');

  const corsOptions = {
    origin: function (origin, callback) {
      // Allow no-origin requests (like curl or same-origin)
      if (!origin) return callback(null, true);
      const cleanOrigin = String(origin).replace(/\/+$/, '');
      if (cleanOrigin === allowedOrigin) {
        return callback(null, true);
      }
      // In dev, also allow localhost:3000 even if env differs slightly
      if (allowedOrigin.includes('localhost:3000') && cleanOrigin.includes('localhost:3000')) {
        return callback(null, true);
      }
      callback(new Error(`CORS: Origin ${origin} not allowed`));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept']
  };

  return cors(corsOptions);
}
