import { Router } from 'express';
import { FontRoutes } from '../modules/Font/font.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/fonts',
    route: FontRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
