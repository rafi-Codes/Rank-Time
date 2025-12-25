import mongoose, { Document, Schema } from 'mongoose';

export interface IBadge extends Document {
  userId: mongoose.Types.ObjectId;
  badgeId: string;
  name: string;
  description: string;
  icon: string;
  category: 'achievement' | 'streak' | 'skill' | 'challenge';
  earned: boolean;
  earnedAt?: Date;
  progress?: number; // For progress-based badges
  target?: number; // Target value for progress
  createdAt: Date;
  updatedAt: Date;
}

const BadgeSchema = new Schema<IBadge>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    badgeId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    category: { type: String, enum: ['achievement', 'streak', 'skill', 'challenge'], required: true },
    earned: { type: Boolean, default: false },
    earnedAt: { type: Date },
    progress: { type: Number, default: 0 },
    target: { type: Number },
  },
  { timestamps: true }
);

// Compound index for efficient queries
BadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });
BadgeSchema.index({ userId: 1, category: 1 });

export default mongoose.models?.Badge || mongoose.model<IBadge>('Badge', BadgeSchema);