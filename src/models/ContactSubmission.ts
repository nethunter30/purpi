import mongoose, { Document, Model, Schema } from "mongoose";

export interface IContactSubmission extends Document {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const contactSubmissionSchema = new Schema<IContactSubmission>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
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
const ContactSubmission: Model<IContactSubmission> =
  mongoose.models.ContactSubmission || 
  mongoose.model<IContactSubmission>("ContactSubmission", contactSubmissionSchema);

export default ContactSubmission;
