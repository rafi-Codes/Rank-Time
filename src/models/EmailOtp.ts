import mongoose, { Document, Schema } from 'mongoose';

export interface IEmailOtp extends Document {
  email: string;
  otp: string;
  purpose?: 'registration' | 'reset';
  userId?: mongoose.Types.ObjectId;
  registrationData?: {
    name: string;
    email: string;
    password: string;
    usertag: string;
  };
  createdAt: Date;
  expiresAt: Date;
}

const EmailOtpSchema = new Schema<IEmailOtp>(
  {
    email: { type: String, required: true, index: true },
    otp: { type: String, required: true },
    purpose: { type: String, enum: ['registration', 'reset'], default: 'registration', index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    registrationData: {
      name: { type: String },
      email: { type: String },
      password: { type: String },
      usertag: { type: String },
    },
    createdAt: { type: Date, default: Date.now, expires: 3600 },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false }
);

EmailOtpSchema.index({ email: 1, purpose: 1, createdAt: -1 });

export default mongoose.models?.EmailOtp || mongoose.model<IEmailOtp>('EmailOtp', EmailOtpSchema, 'emailOtps');
