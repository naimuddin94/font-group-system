import mongoose from 'mongoose';
import { z } from 'zod';

const fontSchema = z.object({
  fontName: z.string({ required_error: 'Font name is required' }),

  priceChange: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() !== '') {
      const num = Number(val);
      return isNaN(num) ? val : num;
    }
    return val;
  }, z.number().min(0, { message: 'Price change must be a valid positive number' })),

  selectedFont: z.preprocess((value) => {
    if (typeof value === 'string' && /^[0-9a-fA-F]{24}$/.test(value)) {
      return new mongoose.Types.ObjectId(value);
    }
    return value;
  }, z.instanceof(mongoose.Types.ObjectId, { message: 'Invalid MongoDB ObjectId' })),

  specificSize: z.preprocess((val) => {
    if (typeof val === 'string' && val.trim() !== '') {
      const num = Number(val);
      return isNaN(num) ? val : num;
    }
    return val;
  }, z.number().min(0, { message: 'specificSize must be a valid positive number' })),
});

const createSchema = z.object({
  body: z.object({
    groupTitle: z.string({ required_error: 'Group title is required' }),
    fonts: z
      .array(fontSchema)
      .min(2, 'At least two fonts are required to form a group'),
  }),
});

export interface IGroupPayload
  extends z.infer<typeof createSchema.shape.body> {}

export const GroupValidation = { createSchema };
