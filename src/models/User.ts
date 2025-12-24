import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  emailVerified?: Date;
  image?: string;
  codeforcesHandle?: string;
  usertag: string; // Unique random tag for each user
  following: mongoose.Types.ObjectId[]; // Array of user IDs this user follows
  totalScore: number;
  currentStreak: number;
  maxStreak: number;
  lastSessionDate?: Date;
  league: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond' | 'master' | 'grandmaster';
  rank: number;
  totalSessions: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Date },
    image: { type: String },
    codeforcesHandle: { type: String },
    usertag: { type: String, required: true, unique: true },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    totalScore: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    maxStreak: { type: Number, default: 0 },
    lastSessionDate: { type: Date },
    league: {
      type: String,
      enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster'],
      default: 'bronze',
    },
    rank: { type: Number, default: 0 },
    totalSessions: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Create a model or use the existing one if it's already been created
export default mongoose.models?.User || mongoose.model<IUser>('User', UserSchema);
