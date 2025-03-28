import { Document } from 'mongoose';

type FontStyle =
  | 'normal'
  | 'italic'
  | 'oblique'
  | 'bold'
  | 'lighter'
  | 'bolder';

export interface IFont extends Document {
  name: string;
  style: FontStyle;
  family: string;
  path: string;
}
