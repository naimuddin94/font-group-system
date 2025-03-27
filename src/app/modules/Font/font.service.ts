import status from 'http-status';
import { AppError } from '../../utils';
import { IFont } from './font.interface';
import Font from './font.model';
import { IFontGroup } from '../FontGroup/fontGroup.interface';
import FontGroup from '../FontGroup/fontGroup.model';

const createFont = async (data: IFont) => {
  const font = await Font.findOne({ name: data.name });

  if (font) {
    throw new AppError(status.BAD_REQUEST, 'Font already exists');
  }

  const newFont = new Font(data);
  await newFont.save();

  return newFont;
};

const getAllFonts = async () => {
  return await Font.find();
};

const getFontById = async (id: string) => {
  return await Font.findById(id);
};

const updateFont = async (id: string, data: Partial<IFont>) => {
  const font = await Font.findById(id);

  if (!font) {
    throw new AppError(status.NOT_FOUND, 'Font not found');
  }

  const updatedFont = await Font.findByIdAndUpdate(id, data, { new: true });

  return updatedFont;
};

const deleteFont = async (id: string) => {
  const font = await Font.findById(id);

  if (!font) {
    throw new AppError(status.NOT_FOUND, 'Font not found');
  }

  await Font.findByIdAndDelete(id);

  return null;
};

const createFontGroup = async (data: IFontGroup) => {
  // Ensure that all fonts are valid
  const fonts = await Font.find({ _id: { $in: data.fonts } });

  if (fonts.length !== data.fonts.length) {
    throw new AppError(status.BAD_REQUEST, 'One or more fonts are invalid');
  }

  const fontGroup = new FontGroup(data);
  await fontGroup.save();

  return fontGroup;
};

const getAllFontGroups = async () => {
  return await FontGroup.find().populate('fonts');
};

const getFontGroupById = async (id: string) => {
  return await FontGroup.findById(id).populate('fonts');
};

const updateFontGroup = async (id: string, data: Partial<IFontGroup>) => {
  const fontGroup = await FontGroup.findById(id);

  if (!fontGroup) {
    throw new AppError(status.NOT_FOUND, 'Font Group not found');
  }

  // If fonts are being updated, ensure that all font references are valid
  if (data.fonts) {
    const fonts = await Font.find({ _id: { $in: data.fonts } });

    if (fonts.length !== data.fonts.length) {
      throw new AppError(status.BAD_REQUEST, 'One or more fonts are invalid');
    }
  }

  const updatedFontGroup = await FontGroup.findByIdAndUpdate(id, data, { new: true });

  return updatedFontGroup;
};

const deleteFontGroup = async (id: string) => {
  const fontGroup = await FontGroup.findById(id);

  if (!fontGroup) {
    throw new AppError(status.NOT_FOUND, 'Font Group not found');
  }

  await FontGroup.findByIdAndDelete(id);

  return null;
};

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

export const FontService = {
  createFont,
  getAllFonts,
  getFontById,
  updateFont,
  deleteFont,
  createFontGroup,
  getAllFontGroups,
  getFontGroupById,
  updateFontGroup,
  deleteFontGroup,
  calculateFontGroupFontCount,
};
