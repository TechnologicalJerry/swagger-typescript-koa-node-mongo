import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import helmet from 'koa-helmet';
import ratelimit from 'koa-ratelimit';
import { koaSwagger } from 'koa2-swagger-ui';
import { errorMiddleware } from './middlewares/error.middleware';
import { swaggerSpec } from './swagger/swagger.config';
import { apiRoutes } from './routes';

const app = new Koa();

// Global Middlewares
app.use(helmet());
app.use(cors());

// Rate Limiting
const db = new Map();
app.use(
  ratelimit({
    driver: 'memory',
    db: db,
    duration: 60000,
    errorMessage: 'Sometimes You Just Have to Slow Down.',
    id: (ctx: any) => ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total'
    },
    max: 100,
    disableHeader: false,
  })
);

app.use(bodyParser());

// Swagger Docs Endpoint
app.use(
  koaSwagger({
    routePrefix: '/api/docs',
    swaggerOptions: {
      spec: swaggerSpec as Record<string, unknown>,
    },
  })
);

// Error Handling Middleware
app.use(errorMiddleware);

// Routes
app.use(apiRoutes.routes());
app.use(apiRoutes.allowedMethods());

export { app };
