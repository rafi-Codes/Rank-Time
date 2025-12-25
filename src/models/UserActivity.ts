import mongoose, { Document, Schema } from 'mongoose';

export interface IUserActivity extends Document {
  userId: mongoose.Types.ObjectId;
  date: Date;
  sessions: number;
  totalTime: number;
  averageScore: number;
  topics: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserActivitySchema = new Schema<IUserActivity>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    sessions: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 }, // in minutes
    averageScore: { type: Number, default: 0 },
    topics: [{ type: String }],
  },
  { timestamps: true }
);

// Create compound index for efficient queries
UserActivitySchema.index({ userId: 1, date: 1 }, { unique: true });

export default mongoose.models?.UserActivity || mongoose.model<IUserActivity>('UserActivity', UserActivitySchema);