import mongoose, { Document, Model, Schema } from "mongoose";

import { ICategory } from "./Category";


export interface ISubcategory extends Document {
    name: string;
    slug: string;
    description: string;
    image: string;
    isActive: boolean;
    category: ICategory["_id"];
}

const SubcategorySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        image: { type: String },
        isActive: { type: Boolean, default: true },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    },
    { timestamps: true }
);

// Prevent Next.js hot-reloading from crashing by checking if the model already exists
const Subcategory: Model<ISubcategory> =
  mongoose.models.Subcategory || mongoose.model<ISubcategory>("Subcategory", SubcategorySchema);

export default Subcategory;