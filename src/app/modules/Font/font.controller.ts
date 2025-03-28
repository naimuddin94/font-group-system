import status from 'http-status';
import { AppResponse, asyncHandler } from '../../utils';
import { FontService } from './font.service';

const saveFont = asyncHandler(async (req, res) => {
  const result = await FontService.createFontsFromTTF(req.file?.path || '');

  res
    .status(status.CREATED)
    .json(new AppResponse(status.CREATED, result, 'Font saved successfully'));
});

const fetchFonts = asyncHandler(async (req, res) => {
  const result = await FontService.fetchFontsFromDB();

  res
    .status(status.OK)
    .json(new AppResponse(status.OK, result, 'Fonts retrieved successfully'));
});

export const FontController = { saveFont, fetchFonts };
