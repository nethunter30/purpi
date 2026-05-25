import mongoose, { Document, Model, Schema } from "mongoose";

export interface IResult {
  metric: string;
  before: string;
  after: string;
}

export interface ICaseStudy extends Document {
  id: string; // URL slug, e.g. "pulsefit-global"
  title: string;
  client: string;
  category: string;
  subCategory: string;
  description: string;
  challenge: string;
  solution: string;
  impact: string;
  impactLabel: string;
  image: string;
  techStack: string[];
  results: IResult[];
  milestones: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const resultSchema = new Schema<IResult>(
  {
    metric: { type: String, required: true, trim: true },
    before: { type: String, required: true, trim: true },
    after: { type: String, required: true, trim: true },
  },
  { _id: false }
);

const caseStudySchema = new Schema<ICaseStudy>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    client: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    subCategory: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    challenge: { type: String, required: true, trim: true },
    solution: { type: String, required: true, trim: true },
    impact: { type: String, required: true, trim: true },
    impactLabel: { type: String, required: true, trim: true },
    image: { type: String, required: true, trim: true },
    techStack: { type: [String], default: [] },
    results: { type: [resultSchema], default: [] },
    milestones: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const CaseStudy: Model<ICaseStudy> =
  mongoose.models.CaseStudy ||
  mongoose.model<ICaseStudy>("CaseStudy", caseStudySchema);

export default CaseStudy;
