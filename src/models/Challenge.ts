import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  bonusPoints: number;
  points: number;
  category: string;
  completed: boolean;
  completedAt?: Date;
  deadline: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ChallengeSchema = new Schema<IChallenge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    topics: [{ type: String, required: true }],
    bonusPoints: { type: Number, required: true },
    points: { type: Number, required: true, default: 0 },
    category: { type: String, required: true, default: 'general' },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    deadline: { type: Date, required: true },
  },
  { timestamps: true }
);

// Index for efficient queries
ChallengeSchema.index({ userId: 1, type: 1, completed: 1 });
ChallengeSchema.index({ deadline: 1 });

export default mongoose.models?.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema);