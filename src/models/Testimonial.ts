import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role: string;
  text: string;
  userId: string;
  stars: number;
  status: "pending" | "approved";
  createdAt: Date;
  updatedAt: Date;
}

const testimonialSchema = new Schema<ITestimonial>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    userId: {
      type: String,
      required: true,
      trim: true,
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ["pending", "approved"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent Next.js hot-reloading from crashing by checking if the model already exists
const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", testimonialSchema);

export default Testimonial;
