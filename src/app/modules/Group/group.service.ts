import status from 'http-status';
import { AppError } from '../../utils';
import Font from '../Font/font.model';
import FontGroup from './group.model';
import { IGroupPayload } from './group.validation';

const createFontGroup = async (payload: IGroupPayload) => {
  // Ensure all fonts are valid
  const fonts = await Font.find({
    _id: { $in: payload.fonts.map((f) => f.selectedFont) },
  });

  if (fonts.length !== payload.fonts.length) {
    throw new AppError(status.BAD_REQUEST, 'One or more fonts are invalid');
  }

  return await FontGroup.create(payload);
};

const fetchAllGroup = async () => {
  return await FontGroup.find();
};

const removeGroupFromDB = async (id: string) => {
  const group = await FontGroup.findByIdAndDelete(id);

  if (!group) {
    throw new AppError(status.OK, 'Group not found');
  }

  return null;
};

const fetchGroupById = async (id: string) => {
  return await FontGroup.findById(id);
};

const updateGroupIntoDB = async (
  id: string,
  payload: Partial<IGroupPayload>
) => {
  const group = await FontGroup.findById(id);

  if (!group) {
    throw new AppError(status.OK, 'Group not found');
  }

  return await FontGroup.findByIdAndUpdate(id, payload, { new: true });
};

export const GroupService = {
  createFontGroup,
  fetchAllGroup,
  removeGroupFromDB,
  fetchGroupById,
  updateGroupIntoDB,
};
