import { Schema, model } from "mongoose";

const productSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  userId: { type: String, required: true },
  price: { type: String, required: true },
  category: { type: String, required: true },
  company: { type: String, required: true },
});

export const productModel = model("products", productSchema);
