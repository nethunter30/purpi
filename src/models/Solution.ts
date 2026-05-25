import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISolution extends Document {
  id: string; // URL slug, e.g. "small-business-it"
  title: string;
  description: string;
  image: string;
  iconName: string;
  features: string[];
  startingPrice: string;
  learnMoreUrl: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const solutionSchema = new Schema<ISolution>(
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
    image: {
      type: String,
      required: true,
      trim: true,
    },
    iconName: {
      type: String,
      required: true,
      trim: true,
    },
    features: {
      type: [String],
      required: true,
      default: [],
    },
    startingPrice: {
      type: String,
      required: true,
      trim: true,
    },
    learnMoreUrl: {
      type: String,
      required: true,
      default: "/#contact",
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

// Prevent Next.js hot-reloading from crashing by checking if the model already exists
const Solution: Model<ISolution> =
  mongoose.models.Solution || mongoose.model<ISolution>("Solution", solutionSchema);

export default Solution;
