import mongoose, { Document, Model, Schema } from "mongoose";

/**
 * Generic, reusable Mongoose model factory.
 *
 * Pass in a name, a schema definition, and options — get back a hot-reload-safe
 * Mongoose model. Avoids repeating the `mongoose.models.X || mongoose.model(...)`
 * guard every time you add a new collection (Blog, Category, Tag, etc.)
 */
export function createModel<T extends Document>(
  modelName: string,
  schemaDefinition: any,
  schemaOptions: any = { timestamps: true }
): Model<T> {
  const schema = new Schema<T>(schemaDefinition, schemaOptions);

  // Prevent Next.js hot-reloading from crashing by checking if the model already exists
  return (mongoose.models[modelName] as Model<T>) || mongoose.model<T>(modelName, schema);
}
