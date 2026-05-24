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

export interface Feature {
    title: string;
    description: string;
}

export interface WhatWeDoSection {
    title: string;
    description: string;
    points: string[];
}

export interface PricingPlan {
    id: string;
    name: string;
    description: string;
    price: string;
    period?: string;
    features: string[];
    highlighted?: boolean;
}

export interface ProcessStep {
    step: number;
    title: string;
    description: string;
}

export interface SecurityFeature {
    title: string;
    description: string;
    icon?: string;
}

export interface ServerPlatform {
    id: string;
    name: string;
    slug: string;
    shortDescription: string;
    features: string[];
    configCode?: string;
}

export interface ToolSection {
    id: string;
    title: string;
    description: string;
    tools: string[];
}

export interface Product {
    id: string;
    name: string;
    slug: string;
    categorySlug: string;
    subcategorySlug: string;
    title?: string;
    subtitle?: string;
    description?: string;
    image?: string;
    heroImage?: string;
    overview?: string;
    bulletList?: BulletList;
    features?: Feature[];
    securityFeatures?: SecurityFeature[];
    processSteps?: ProcessStep[];
    pricingPlans?: PricingPlan[];
    serverPlatforms?: ServerPlatform[];
    faqs?: FAQ[];
    tags?: string[];
    toolSections?: ToolSection[];
    whatWeDo?: WhatWeDoSection[];
    seoTitle?: string;
    seoDescription?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IProductDoc extends Omit<Product, "id">, Document {}

const faqSchema = new Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true }
}, { _id: false });

const bulletListSchema = new Schema({
  heading: { type: String, required: true },
  points: [{ type: String }]
}, { _id: false });

const featureSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const securityFeatureSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String }
}, { _id: false });

const processStepSchema = new Schema({
  step: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }
}, { _id: false });

const pricingPlanSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  period: { type: String },
  features: [{ type: String }],
  highlighted: { type: Boolean, default: false }
}, { _id: false });

const serverPlatformSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String },
  slug: { type: String },
  shortDescription: { type: String },
  features: [{ type: String }],
  configCode: { type: String }
}, { _id: false });

const toolSectionSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  tools: [{ type: String }]
}, { _id: false });

const whatWeDoSectionSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  points: [{ type: String }]
}, { _id: false });

const productSchema = new Schema<IProductDoc>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categorySlug: { type: String, required: true },
  subcategorySlug: { type: String, required: true },
  title: { type: String },
  subtitle: { type: String },
  description: { type: String },
  image: { type: String },
  heroImage: { type: String },
  overview: { type: String },
  bulletList: bulletListSchema,
  features: [featureSchema],
  securityFeatures: [securityFeatureSchema],
  processSteps: [processStepSchema],
  pricingPlans: [pricingPlanSchema],
  serverPlatforms: [serverPlatformSchema],
  faqs: [faqSchema],
  tags: [{ type: String }],
  toolSections: [toolSectionSchema],
  whatWeDo: [whatWeDoSectionSchema],
  seoTitle: { type: String },
  seoDescription: { type: String }
}, { timestamps: true });

// Force re-compilation of Product model in development to pick up schema updates
if (mongoose.models && mongoose.models.Product) {
  delete (mongoose.models as any).Product;
}

const ProductModel: Model<IProductDoc> =
  mongoose.model<IProductDoc>("Product", productSchema);

export default ProductModel;