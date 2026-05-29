import mongoose, { Document, Model, Schema } from "mongoose";
import { ISubcategory } from "./Subcategory";
import { ICategory } from "./Category";

// ─── Shared ────────────────────────────────────────────────
export type SectionMeta = {
  sectionHeading: string;
  sectionDescription: string;
};

export type CodeBlock = {
  language: string;
  code: string;
  filename?: string;
};

// ─── 1. Product Details ────────────────────────────────────
export type ProductDetails = {
  title: string;
  description: string;
  points?: string[];
  codeBlocks?: CodeBlock[];
};

// ─── 2. What We Do ─────────────────────────────────────────
export type WhatWeDoCard = {
  icon: string;
  title: string;
  description: string;
  points?: string[];
};

export type WhatWeDoSection = SectionMeta & {
  cards: WhatWeDoCard[];
};

// ─── 3. Security ───────────────────────────────────────────
export type SecurityCard = {
  icon: string;
  title: string;
  description: string;
};

export type SecuritySection = SectionMeta & {
  cards: SecurityCard[];
};

// ─── 4. Process ────────────────────────────────────────────
export type ProcessCard = {
  step?: number;
  title: string;
  description: string;
};

export type ProcessSection = SectionMeta & {
  cards: ProcessCard[];
};

// ─── 5. Pricing ────────────────────────────────────────────
export type PriceCard = {
  title: string;
  tagline: string;
  price: number;
  billingCycle: string;
  priceTagline?: string;
  points: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

export type PricingSection = SectionMeta & {
  cards: PriceCard[];
};

// ─── 6. FAQ ────────────────────────────────────────────────
export type FaqItem = {
  question: string;
  answer: string;
};

export type FaqSection = SectionMeta & {
  items: FaqItem[];
};

// ─── Root ProductSections ──────────────────────────────────
export type ProductSections = {
  productDetails: ProductDetails;
  whatWeDo?: WhatWeDoSection;
  security?: SecuritySection;
  process?: ProcessSection;
  pricing?: PricingSection;
  faq?: FaqSection;
};

// ─── Mongoose Document Interface ───────────────────────────
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  subcategory: ISubcategory["_id"];
  category: ICategory["_id"];
  sections: ProductSections;
  order: number;
}

// ─── Sub-Schemas ───────────────────────────────────────────

const CodeBlockSchema = new Schema(
  {
    language: { type: String, required: true },
    code: { type: String, required: true },
    filename: { type: String },
  },
  { _id: false }
);

const ProductDetailsSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    points: [{ type: String }],
    codeBlocks: [CodeBlockSchema],
  },
  { _id: false }
);

const SectionMetaFields = {
  sectionHeading: { type: String, required: true },
  sectionDescription: { type: String, required: true },
};

const WhatWeDoCardSchema = new Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    points: [{ type: String }],
  },
  { _id: false }
);

const WhatWeDoSectionSchema = new Schema(
  {
    ...SectionMetaFields,
    cards: [WhatWeDoCardSchema],
  },
  { _id: false }
);

const SecurityCardSchema = new Schema(
  {
    icon: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const SecuritySectionSchema = new Schema(
  {
    ...SectionMetaFields,
    cards: [SecurityCardSchema],
  },
  { _id: false }
);

const ProcessCardSchema = new Schema(
  {
    step: { type: Number },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const ProcessSectionSchema = new Schema(
  {
    ...SectionMetaFields,
    cards: [ProcessCardSchema],
  },
  { _id: false }
);

const PriceCardSchema = new Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, required: true },
    price: { type: Number, required: true },
    billingCycle: { type: String, required: true },
    priceTagline: { type: String },
    points: [{ type: String, required: true }],
    highlighted: { type: Boolean, default: false },
    ctaLabel: { type: String, default: "Get Started" },
    ctaHref: { type: String },
  },
  { _id: false }
);

const PricingSectionSchema = new Schema(
  {
    ...SectionMetaFields,
    cards: [PriceCardSchema],
  },
  { _id: false }
);

const FaqItemSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
  },
  { _id: false }
);

const FaqSectionSchema = new Schema(
  {
    ...SectionMetaFields,
    items: [FaqItemSchema],
  },
  { _id: false }
);

const ProductSectionsSchema = new Schema(
  {
    productDetails: { type: ProductDetailsSchema, required: true },
    whatWeDo: { type: WhatWeDoSectionSchema },
    security: { type: SecuritySectionSchema },
    process: { type: ProcessSectionSchema },
    pricing: { type: PricingSectionSchema },
    faq: { type: FaqSectionSchema },
  },
  { _id: false }
);

// ─── Root Product Schema ────────────────────────────────────
const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    image: { type: String },
    isActive: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    subcategory: { type: Schema.Types.ObjectId, ref: "Subcategory", required: true },
    sections: { type: ProductSectionsSchema, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Prevent Next.js hot-reloading from crashing by checking if the model already exists
const Product: Model<IProduct> =
  (mongoose.models.Product as Model<IProduct>) || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
