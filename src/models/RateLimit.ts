import mongoose, { Document, Schema } from 'mongoose';

export interface IRateLimit extends Document {
  key: string;
  scope: string;
  attempts: number;
  lockedUntil?: Date;
  nextAllowedAt?: Date;
  resetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RateLimitSchema = new Schema<IRateLimit>(
  {
    key: { type: String, required: true },
    scope: { type: String, required: true },
    attempts: { type: Number, default: 0 },
    lockedUntil: { type: Date },
    nextAllowedAt: { type: Date },
    resetAt: { type: Date, required: true },
  },
  { timestamps: true }
);

RateLimitSchema.index({ key: 1, scope: 1 }, { unique: true });
RateLimitSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models?.RateLimit || mongoose.model<IRateLimit>('RateLimit', RateLimitSchema);
