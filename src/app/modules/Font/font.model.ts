import mongoose from 'mongoose';
import { IFont } from './font.interface';

const fontSchema = new mongoose.Schema<IFont>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    style: {
      type: String,
      default: 'normal',
    },
    family: {
      type: String,
      required: false,
    },
    weight: {
      type: String,
      default: 'normal',
    },
    path: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

const Font = mongoose.model<IFont>('Font', fontSchema);

export default Font;
