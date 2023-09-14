import { Router } from "express";
import ProductManager from "../dao/db/manager/products.js";
import CartManager from "../dao/db/manager/carts.js";

const viewsRouter = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

viewsRouter.get("/chat", async (req, res) => {
  res.render("chat", { style: "chat.css", title: "Chat con Websocket" });
});

viewsRouter.get("/products", async (req, res) => {
  const { limit, page, sort, query } = req.query;
  try {
    const {
      docs,
      hasPrePage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink,
    } = await productManager.getProductsQuery(limit, page, sort, query);

    res.render("products", {
      style: "styles.css",
      title: "Productos",
      in: true,
      docs,
      hasPrePage,
      hasNextPage,
      prevPage,
      nextPage,
      prevLink,
      nextLink,
    });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

viewsRouter.get("/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.render("products", { products, styles: { styles } });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
  try {
    const cart = await cartManager.getById(req.params.cid);
    if (!cart) return res.status(404).send({ error: "Carrito no encontrado" });
    res.render("carts", cart);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

export default viewsRouter;
