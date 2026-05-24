import mongoose, { Schema, Document, Model } from "mongoose";
import { SubCategory } from "./categories";

export interface ISubCategoryDoc extends Omit<SubCategory, "id">, Document {}

const faqSchema = new Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const bulletListSchema = new Schema({
  heading: { type: String, required: true },
  points: [{ type: String }]
}, { _id: false });

const subCategorySchema = new Schema<ISubCategoryDoc>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categorySlug: { type: String, required: true },
  bulletList: bulletListSchema,
  faqs: [faqSchema],
  images: [{ type: String }]
}, { timestamps: true });

const SubCategoryModel: Model<ISubCategoryDoc> =
  mongoose.models.SubCategory || mongoose.model<ISubCategoryDoc>("SubCategory", subCategorySchema);

export default SubCategoryModel;
export type { SubCategory };
