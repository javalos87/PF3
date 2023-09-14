import mongoose from "mongoose";
const cartsCollection = "Carts";
const cartsSchema = new mongoose.Schema({
  products: {
    type: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    default: [],
  },
});
cartsSchema.pre("findOne", function () {
  this.populate("products.product");
});
export const cartsModel = mongoose.model(cartsCollection, cartsSchema);
