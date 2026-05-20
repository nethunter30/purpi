import mongoose, { Document, Model, Schema } from "mongoose";

export interface ITeamMember extends Document {
  name: string;
  role: string;
  image: string;
  bgColor: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>(
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
    image: {
      type: String,
      required: true,
      trim: true,
    },
    bgColor: {
      type: String,
      required: true,
      trim: true,
      default: "#8a35e5", // Default vibrant purple
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent Next.js hot-reloading from crashing by checking if the model already exists
const TeamMember: Model<ITeamMember> =
  mongoose.models.TeamMember || mongoose.model<ITeamMember>("TeamMember", teamMemberSchema);

export default TeamMember;
