import mongoose, { Document, Model, Schema } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    description: string;
    image: string;
    isActive: boolean;
}

const CategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        image: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Prevent Next.js hot-reloading from crashing by checking if the model already exists
const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>("Category", CategorySchema);

export default Category;