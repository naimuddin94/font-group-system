import { Document, Types } from 'mongoose';

export interface IGroup extends Document {
  groupTitle: string;
  fonts: Types.ObjectId[];
}
