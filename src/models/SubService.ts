import mongoose, { Document, Model, Schema } from "mongoose";

export interface ISubService extends Document {
  serviceId: mongoose.Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  whatWeOffer: string[];
  benefits: string[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const subServiceSchema = new Schema<ISubService>(
  {
    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    whatWeOffer: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const SubService: Model<ISubService> =
  mongoose.models.SubService || mongoose.model<ISubService>("SubService", subServiceSchema);

export default SubService;
