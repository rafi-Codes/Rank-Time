import mongoose, { Document, Schema } from 'mongoose';

export interface IChallenge extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  difficulty: 'easy' | 'medium' | 'hard';
  topics: string[];
  bonusPoints: number;
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
    type: { type: String, enum: ['daily', 'weekly'], required: true },
    difficulty: { type: String, enum: ['easy', 'medium', 'hard'], required: true },
    topics: [{ type: String, required: true }],
    bonusPoints: { type: Number, required: true },
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