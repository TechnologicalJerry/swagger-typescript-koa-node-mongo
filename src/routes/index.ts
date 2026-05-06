import Router from '@koa/router';
import { authRoutes } from './auth.routes';
import { userRoutes } from './user.routes';

const router = new Router({ prefix: '/api/v1' });

/**
 * @swagger
 * /api/v1/health:
 *   get:
 *     summary: API Health Check
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is up and running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.get('/health', (ctx) => {
  ctx.status = 200;
  ctx.body = {
    status: 'success',
    message: 'Server is healthy',
  };
});

router.use('/auth', authRoutes.routes(), authRoutes.allowedMethods());
router.use('/users', userRoutes.routes(), userRoutes.allowedMethods());

export const apiRoutes = router;
