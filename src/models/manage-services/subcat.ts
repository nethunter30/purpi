import mongoose, { Schema, Document, Model } from "mongoose";
import { SubCategory } from "./categories";

export interface ISubCategoryDoc extends Omit<SubCategory, "id">, Document {}

const faqSchema = new Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const bulletListSchema = new Schema({
  heading: { type: String, default: "" },
  points: [{ type: String }]
}, { _id: false });

const subCategorySchema = new Schema<ISubCategoryDoc>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  categorySlug: { type: String, required: true },
  bulletList: bulletListSchema,
  images: [{ type: String }]
}, { timestamps: true });

const SubCategoryModel: Model<ISubCategoryDoc> =
  mongoose.models.SubCategory || mongoose.model<ISubCategoryDoc>("SubCategory", subCategorySchema);

export default SubCategoryModel;
export type { SubCategory };
