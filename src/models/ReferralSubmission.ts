import mongoose, { Document, Model, Schema } from "mongoose";

export interface IReferralSubmission extends Document {
  referrerName: string;
  referrerEmail: string;
  referrerPhone?: string;
  referrerUpiOrBank: string;
  clientBusinessName: string;
  clientContactName: string;
  clientEmail: string;
  clientPhone?: string;
  projectScope: string;
  status: 'Pending' | 'In Progress' | 'Signed' | 'Paid' | 'Rejected';
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const referralSubmissionSchema = new Schema<IReferralSubmission>(
  {
    referrerName: {
      type: String,
      required: true,
      trim: true,
    },
    referrerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    referrerPhone: {
      type: String,
      trim: true,
    },
    referrerUpiOrBank: {
      type: String,
      required: true,
      trim: true,
    },
    clientBusinessName: {
      type: String,
      required: true,
      trim: true,
    },
    clientContactName: {
      type: String,
      required: true,
      trim: true,
    },
    clientEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    clientPhone: {
      type: String,
      trim: true,
    },
    projectScope: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Signed', 'Paid', 'Rejected'],
      default: 'Pending',
      required: true,
    },
    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent Next.js hot-reloading from crashing by checking if the model already exists
const ReferralSubmission: Model<IReferralSubmission> =
  mongoose.models.ReferralSubmission ||
  mongoose.model<IReferralSubmission>("ReferralSubmission", referralSubmissionSchema);

export default ReferralSubmission;
