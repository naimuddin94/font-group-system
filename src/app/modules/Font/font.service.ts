import fontkit from 'fontkit';
import fs from 'fs/promises';
import { IFont } from './font.interface';
import FontModel from './font.model';

interface FontMetadata {
  name: string;
  family: string;
  style: string;
}

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
        style: f.subfamilyName || 'Regular',
      }));
    } else {
      // Single Font case (e.g., .ttf files)
      fonts = [
        {
          name: font.fullName || 'Unknown',
          family: font.familyName || 'Unknown',
          style: font.subfamilyName || 'Regular',
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
        });
        return (await newFont.save()).toObject();
      }

      return existingFont.toObject();
    })
  );

  return savedFonts;
};

export const FontService = {
  createFontsFromTTF,
};
