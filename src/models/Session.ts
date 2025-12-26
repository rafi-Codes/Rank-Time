import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ILap {
  name: string;
  duration: number; // in seconds
  startedAt?: Date;
  endedAt?: Date;
  comment?: string;
}

export interface ISession extends Document {
  user: Types.ObjectId;
  problemId: string;
  problemName: string;
  problemUrl: string;
  problemRating: number;
  problemTags: string[];
  laps: ILap[];
  totalTime: number; // in seconds
  score: number;
  streakBonus: number;
  notes?: string;
  comments?: string;
  codeforcesHandle: string;
  createdAt: Date;
  updatedAt: Date;
}

const LapSchema = new Schema<ILap>({
  name: { type: String, required: true },
  duration: { type: Number, required: true },
  startedAt: { type: Date },
  endedAt: { type: Date },
  comment: { type: String },
});

const SessionSchema = new Schema<ISession>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    problemId: { type: String, required: false },
    problemName: { type: String, required: true },
    problemUrl: { type: String, required: false },
    problemRating: { type: Number, required: true },
    problemTags: [{ type: String }],
    laps: [LapSchema],
    totalTime: { type: Number, required: true },
    score: { type: Number, required: true },
    streakBonus: { type: Number, default: 0 },
    notes: { type: String },
    comments: { type: String },
    codeforcesHandle: { type: String, required: false },
  },
  { timestamps: true }
);

// Create index for faster queries
SessionSchema.index({ user: 1, createdAt: -1 });

// Create a model or use the existing one if it's already been created
export default mongoose.models?.Session || mongoose.model<ISession>('Session', SessionSchema);
