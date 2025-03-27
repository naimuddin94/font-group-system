import mongoose from 'mongoose';
import { IFontGroup } from './fontGroup.interface';

const fontGroupSchema = new mongoose.Schema<IFontGroup>({
  name: {
    type: String,
    required: true,
  },
  fonts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Font',
      required: true,
    },
  ],
});

const FontGroup = mongoose.model<IFontGroup>('FontGroup', fontGroupSchema);

export default FontGroup;
