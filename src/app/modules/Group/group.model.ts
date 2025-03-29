import mongoose from 'mongoose';
import { IGroup } from './group.interface';

const fontSchema = new mongoose.Schema(
  {
    fontName: {
      type: String,
      required: true,
    },
    priceChange: {
      type: Number,
      required: true,
    },
    selectedFont: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Font',
      required: true,
    },
    specificSize: {
      type: Number,
      required: true,
    },
  },
  { _id: false, versionKey: false }
);

const fontGroupSchema = new mongoose.Schema<IGroup>(
  {
    groupTitle: {
      type: String,
      required: true,
    },
    fonts: [fontSchema],
  },
  { versionKey: false }
);

const FontGroup = mongoose.model<IGroup>('FontGroup', fontGroupSchema);

export default FontGroup;
