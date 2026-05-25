import mongoose, { Schema, Document, Model } from "mongoose";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export interface BulletList {
  heading: string;
  points: string[];
}

export interface SubCategory {
  id: string;
  name: string;
  slug: string;
  categorySlug: string;
  bulletList?: BulletList;
  faqs?: FAQ[];
  images?: string[];
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string;
  faqs?: FAQ[];
  subcategories?: SubCategory[];
}

export interface ICategoryDoc extends Omit<Category, "id">, Document {}

const faqSchema = new Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const categorySchema = new Schema<ICategoryDoc>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  image: { type: String, required: true },
  faqs: [faqSchema]
}, { timestamps: true });

const CategoryModel: Model<ICategoryDoc> = 
  mongoose.models.Category || mongoose.model<ICategoryDoc>("Category", categorySchema);

export default CategoryModel;
