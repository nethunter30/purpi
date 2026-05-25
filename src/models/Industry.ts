import mongoose, { Document, Model, Schema } from "mongoose";

export interface IIndustry extends Document {
  id: string; // URL slug, e.g. "small-medium-business"
  title: string;
  description: string;
  iconName: string;
  link: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const industrySchema = new Schema<IIndustry>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    iconName: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      default: "/solutions",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent hot-reload from crashing on double registration
const Industry: Model<IIndustry> =
  mongoose.models.Industry || mongoose.model<IIndustry>("Industry", industrySchema);

export default Industry;
