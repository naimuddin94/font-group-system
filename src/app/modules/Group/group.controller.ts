import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { GroupService } from './group.service';

const saveGroup = asyncHandler(async (req, res) => {
  console.log(req.body);

  const result = await GroupService.createFontGroup(req.body);

  res
    .status(status.CREATED)
    .json(
      new AppResponse(status.CREATED, result, 'Group created successfully')
    );
});

const fetchGroup = asyncHandler(async (req, res) => {
  const result = await GroupService.fetchAllGroup();

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Groups fetched successfully'));
});

const removeGroup = asyncHandler(async (req, res) => {
  const result = await GroupService.removeGroupFromDB(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Group remove successfully'));
});

const fetchGroupById = asyncHandler(async (req, res) => {
  const result = await GroupService.fetchGroupById(req.params.id);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Group fetched successfully'));
});

const updateGroup = asyncHandler(async (req, res) => {
  const result = await GroupService.updateGroupIntoDB(req.params.id, req.body);

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Group update successfully'));
});

export const GroupController = {
  saveGroup,
  fetchGroup,
  removeGroup,
  fetchGroupById,
  updateGroup,
};
