import { Router } from 'express';
import { FontRoutes } from '../modules/Font/font.route';
import { GroupRoutes } from '../modules/Group/group.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/fonts',
    route: FontRoutes,
  },
  {
    path: '/groups',
    route: GroupRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
