import { Schema, model, Types } from 'mongoose';

export const DOCUMENT_NAME = 'Log';
export const COLLECTION_NAME = 'logs';

export default interface Log {
  _id: Types.ObjectId;
  userId: string;
  temperature: number;
  location: { type: 'Point'; coordinates: number[] };
  createdAt: Date;
}

const pointSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});
const schema = new Schema<Log>({
  userId: {
    type: Schema.Types.String,
    required: true,
  },
  temperature: {
    type: Schema.Types.Number,
    required: true,
  },
  location: pointSchema,
  createdAt: {
    type: Schema.Types.Date,
    required: true,
    select: false,
  },
});

schema.index({ key: 1, status: 1 });

export const LogModel = model<Log>(DOCUMENT_NAME, schema, COLLECTION_NAME);
