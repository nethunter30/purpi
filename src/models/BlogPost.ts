import mongoose, { Document, Model, Schema } from "mongoose";

export interface IBlogPost extends Document {
  id: string; // URL slug, e.g. "serverless-nextjs15"
  title: string;
  excerpt: string;
  content: string; // Markdown text
  category: mongoose.Types.ObjectId | any;
  date: string; // E.g. "May 18, 2026"
  readTime: string; // E.g. "6 min read"
  author: {
    name: string;
    role: string;
    avatar: string; // Cloudinary secure_url or default
  };
  image: string; // Cover image (Cloudinary secure_url)
  tags: string[];
  featured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
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
    excerpt: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    readTime: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      name: { type: String, required: true, trim: true },
      role: { type: String, required: true, trim: true },
      avatar: { type: String, default: "" },
    },
    image: {
      type: String,
      required: true,
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
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
const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>("BlogPost", blogPostSchema);

export default BlogPost;
