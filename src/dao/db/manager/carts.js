import { cartsModel } from "../models/carts.js";
import Products from "../manager/products.js";

const productsManager = new Products();

export default class Carts {
  constructor() {}

  getAll = async () => {
    try {
      const carts = await cartsModel.find();
      return carts.map((cart) => cart.toObject());
    } catch (error) {
      return console.log(error.message);
    }
  };
  getById = async (id) => {
    try {
      const cart = await cartsModel.findOne({ _id: id });
      return cart;
    } catch (error) {
      return console.log(error.message);
    }
  };
  saveCart = async (cart) => {
    try {
      const result = await cartsModel.create(cart);
      return result;
    } catch (error) {
      return console.log(error.message);
    }
  };
  addProductCart = async (cid, pid) => {
    try {
      const result = await cartsModel.findOne({ _id: cid });

      const exist = result.products.find((e) => e.product._id == pid);

      const product = await productsManager.getProductById(pid);
      if (!exist) {
        let productAdd = { product: product._id, quantity: 1 };
        await cartsModel.updateOne(
          { _id: cid },
          { $push: { products: productAdd } }
        );
      } else {
        await cartsModel.updateOne(
          { _id: cid, "products._id": exist._id },
          { $inc: { "products.$.quantity": 1 } }
        );
      }
      return result;
    } catch (error) {
      return console.log(error.message);
    }
  };
  deleteProdInCart = async (cid, pid) => {
    try {
      const cart = await cartsModel.findOne({ _id: cid });
      const filter = cart.products.filter((item) => item.product._id != pid);
      const deleteProduct = await cartsModel.updateOne(
        { _id: cid },
        { products: filter }
      );
      return deleteProduct;
    } catch (error) {
      console.log(error.message);
    }
  };
  delProdsInCart = async (cid) => {
    try {
      console.log("aca");
      const filter = { _id: cid };
      const update = { $set: { products: [] } };
      const updateCart = await cartsModel.findOneAndUpdate(filter, update, {
        new: true,
      });
      return updateCart;
    } catch (error) {
      console.log(error.message);
    }
  };
  modQuantity = async (cid, pid, quantity) => {
    try {
      // Filtrar por el índice del carrito y el índice del producto
      const filter = { _id: cid, "products._id": pid };
      // Actualizar la cantidad del producto específico
      const update = { $set: { "products.$.quantity": quantity } };

      const updatedCart = await cartsModel.findOneAndUpdate(filter, update, {
        new: true,
      }); // new: true devuelve el documento actualizado
      return updatedCart;
    } catch (error) {
      console.log(error.message);
    }
  };
}
