import { Router } from 'express';
import { validateRequest } from '../../middlewares';
import { GroupController } from './group.controller';
import { GroupValidation } from './group.validation';

const router = Router();

router
  .route('/')
  .get(GroupController.fetchGroup)
  .post(
    validateRequest(GroupValidation.createSchema),
    GroupController.saveGroup
  );

router
  .route('/:id')
  .delete(GroupController.removeGroup)
  .get(GroupController.fetchGroupById)
  .patch(
    validateRequest(GroupValidation.createSchema),
    GroupController.updateGroup
  );

export const GroupRoutes = router;
