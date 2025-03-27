import mongoose from 'mongoose';
import { IFont } from './font.interface';

const fontSchema = new mongoose.Schema<IFont>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  style: {
    type: String,
    default: 'normal',
  },
  previewText: {
    type: String,
    default: 'Example Style',
  },
});

const Font = mongoose.model<IFont>('Font', fontSchema);

export default Font;
