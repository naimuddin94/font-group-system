import fontkit from 'fontkit';
import fs from 'fs/promises';
import status from 'http-status';
import mongoose from 'mongoose';
import path from 'path';
import { AppError } from '../../utils';
import FontGroup from '../Group/group.model';
import { IFont } from './font.interface';
import FontModel from './font.model';

interface FontMetadata {
  name: string;
  family: string;
  weight: string | number;
  style: string;
}

const getFontStyle = (font: any): 'normal' | 'italic' => {
  if (
    font['post'] &&
    font['post'].italicAngle &&
    font['post'].italicAngle !== 0
  ) {
    return 'italic';
  }
  return 'normal';
};

const getFontWeight = (font: any): string | number => {
  if (font['OS/2'] && font['OS/2'].usWeightClass) {
    return font['OS/2'].usWeightClass; // Returns numeric weight (100–900)
  }

  return 'normal';
};

const extractFontsFromTTF = async (
  filePath: string
): Promise<FontMetadata[]> => {
  try {
    const buffer = await fs.readFile(filePath);
    const font = fontkit.create(buffer);

    let fonts: FontMetadata[] = [];

    if ('fonts' in font) {
      // FontCollection case (e.g., .ttc files)
      fonts = font.fonts.map((f) => ({
        name: f.fullName || 'Unknown',
        family: f.familyName || 'Unknown',
        style: getFontStyle(f),
        weight: getFontWeight(f),
      }));
    } else {
      // Single Font case (e.g., .ttf files)
      fonts = [
        {
          name: font.fullName,
          family: font.familyName,
          style: getFontStyle(font),
          weight: getFontWeight(font),
        },
      ];
    }

    return fonts;
  } catch (error) {
    throw new Error(
      `Failed to extract font metadata: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
};

const createFontsFromTTF = async (filePath: string): Promise<IFont[]> => {
  const fontsData = await extractFontsFromTTF(filePath);

  const savedFonts = await Promise.all(
    fontsData.map(async (fontData) => {
      const existingFont = await FontModel.findOne({ name: fontData.name });

      if (!existingFont) {
        const newFont = new FontModel({
          name: fontData.name,
          family: fontData.family,
          style: fontData.style,
          path: filePath,
        });
        return (await newFont.save()).toObject();
      }

      return existingFont.toObject();
    })
  );

  return savedFonts;
};

const fetchFontsFromDB = async () => {
  return await FontModel.find();
};

const removeFontFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const font = await FontModel.findByIdAndDelete(id, { session });

    if (!font) {
      throw new AppError(status.OK, 'Font not fount');
    }

    await FontGroup.updateMany(
      { 'fonts.selectedFont': id },
      { $pull: { fonts: { selectedFont: id } } },
      { session }
    );

    const filePath = path.resolve(font.path);

    try {
      await fs.access(filePath);
      await fs.unlink(filePath);
    } catch {
      console.log(`File not found: ${filePath}`);
    }

    await session.commitTransaction();
    session.endSession();

    return null;
  } catch {
    await session.abortTransaction();
    session.endSession;
    throw new AppError(
      status.INTERNAL_SERVER_ERROR,
      'Something went wrong when remove font'
    );
  }
};

export const FontService = {
  createFontsFromTTF,
  fetchFontsFromDB,
  removeFontFromDB,
};
