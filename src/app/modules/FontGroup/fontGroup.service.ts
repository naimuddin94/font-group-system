import status from 'http-status';
import { AppError } from '../../utils';
import { IFontGroup } from './fontGroup.interface';
import FontGroup from './fontGroup.model';
import Font from '../Font/font.model';

// 1. Create a new Font Group
const createFontGroup = async (data: IFontGroup) => {
  // Ensure all fonts are valid
  const fonts = await Font.find({ _id: { $in: data.fonts } });
  if (fonts.length !== data.fonts.length) {
    throw new AppError(status.BAD_REQUEST, 'One or more fonts are invalid');
  }

  const fontGroup = new FontGroup(data);
  await fontGroup.save();

  return fontGroup;
};

// 2. Get all Font Groups
const getAllFontGroups = async () => {
  return await FontGroup.find().populate('fonts');  // Populate the fonts to get details
};

// 3. Get a Font Group by ID
const getFontGroupById = async (id: string) => {
  const fontGroup = await FontGroup.findById(id).populate('fonts');
  if (!fontGroup) {
    throw new AppError(status.NOT_FOUND, 'Font Group not found');
  }

  return fontGroup;
};

// 4. Update a Font Group
const updateFontGroup = async (id: string, data: Partial<IFontGroup>) => {
  const fontGroup = await FontGroup.findById(id);
  if (!fontGroup) {
    throw new AppError(status.NOT_FOUND, 'Font Group not found');
  }

  // Ensure all fonts in the updated list are valid
  if (data.fonts) {
    const fonts = await Font.find({ _id: { $in: data.fonts } });
    if (fonts.length !== data.fonts.length) {
      throw new AppError(status.BAD_REQUEST, 'One or more fonts are invalid');
    }
  }

  const updatedFontGroup = await FontGroup.findByIdAndUpdate(id, data, { new: true }).populate('fonts');

  return updatedFontGroup;
};

// 5. Delete a Font Group
const deleteFontGroup = async (id: string) => {
  const fontGroup = await FontGroup.findById(id);
  if (!fontGroup) {
    throw new AppError(status.NOT_FOUND, 'Font Group not found');
  }

  await FontGroup.findByIdAndDelete(id);

  return null;
};

// 6. Add Fonts to a Font Group
const addFontsToFontGroup = async (fontGroupId: string, fontIds: string[]) => {
  const fontGroup = await FontGroup.findById(fontGroupId);
  if (!fontGroup) {
    throw new AppError(status.NOT_FOUND, 'Font Group not found');
  }

  // Ensure all fonts are valid
  const fonts = await Font.find({ _id: { $in: fontIds } });
  if (fonts.length !== fontIds.length) {
    throw new AppError(status.BAD_REQUEST, 'One or more fonts are invalid');
  }

  fontGroup.fonts = [...fontGroup.fonts, ...fontIds];
  await fontGroup.save();

  return fontGroup;
};

// 7. Remove Fonts from a Font Group
const removeFontsFromFontGroup = async (fontGroupId: string, fontIds: string[]) => {
  const fontGroup = await FontGroup.findById(fontGroupId);
  if (!fontGroup) {
    throw new AppError(status.NOT_FOUND, 'Font Group not found');
  }

  fontGroup.fonts = fontGroup.fonts.filter((font: string) => !fontIds.includes(font));
  await fontGroup.save();

  return fontGroup;
};

// 8. Calculate Total Font Count in all Font Groups
const calculateFontGroupFontCount = async () => {
  const result = await FontGroup.aggregate([
    { $unwind: "$fonts" },
    { $group: { _id: null, totalFontCount: { $sum: 1 } } }
  ]);

  if (result.length === 0) {
    throw new AppError(status.NOT_FOUND, 'No font groups found');
  }

  return { totalFontCount: result[0].totalFontCount };
};

// 9. Get All Fonts in a Font Group
const getFontsInFontGroup = async (id: string) => {
  const fontGroup = await FontGroup.findById(id).populate('fonts');
  if (!fontGroup) {
    throw new AppError(status.NOT_FOUND, 'Font Group not found');
  }

  return fontGroup.fonts;
};

export const FontGroupService = {
  createFontGroup,
  getAllFontGroups,
  getFontGroupById,
  updateFontGroup,
  deleteFontGroup,
  addFontsToFontGroup,
  removeFontsFromFontGroup,
  calculateFontGroupFontCount,
  getFontsInFontGroup,
};
