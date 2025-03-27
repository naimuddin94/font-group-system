import { Document, Types } from 'mongoose';

export interface IFontGroup extends Document {
  name: string;
  fonts: Types.ObjectId[];
}
