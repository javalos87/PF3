import { Router } from "express";
import fs from "fs";
import __dirname from "../utils.js";
import Carts from "../dao/db/manager/carts.js";
import Products from "../dao/db/manager/products.js";

const path = __dirname + "/dao/fs/carritos.json";
const router = Router();
const cartsDB = new Carts();
const productsDB = new Products();

//Ruta raiz donde devuelve todos los productos
router.get("/api/carts", async (req, res) => {
  try {
    let productos = await fs.promises.readFile(path, "utf-8");
    let productosdb = await cartsDB.getAll();
    productos = productosdb || (await JSON.parse(productos));
    res.send({ status: "success", payload: productos });
  } catch (error) {
    res.send({ status: "error", error: error });
  }
});

//Ruta con params pid, donde devuelve el carrito
router.get("/api/carts/:cid", async (req, res) => {
  try {
    const result = await cartsDB.getById(req.params.cid);
    return res.send({ status: "success", payload: result });
  } catch (error) {
    return res.send({ status: "error", error: "Carrito no encontrado" });
  }
  // File System
  /* let cid = req.params.cid;
  let carritos = await fs.promises.readFile(path, "utf-8");
  carritos = await JSON.parse(carritos);
  const index = carritos.findIndex((e) => e.id == cid);
  if (index === -1) {
    
    return res
      .status(400)
      .send({ status: "error", error: "Carrito no encontrado" });
  } else {
    res.send({ status: "success", payload: carritos[index] });
  } */
});

//Ruta para agregar carritos
router.post("/api/carts", async (req, res) => {
  /*  const cartsFile = await fs.promises.readFile(path, "utf-8");
  let cart = { products: [] };

  let carts = await JSON.parse(cartsFile);
  carts.length === 0
    ? (cart.id = 1)
    : (cart.id = carts[carts.length - 1].id + 1);
  carts.push(cart);
  await fs.promises.writeFile(path, JSON.stringify(carts)); */
  let result = await cartsDB.saveCart();
  res.send({
    status: "success",
    message: "Se agrego el carrito",
    payload: result,
  });
});

router.post("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const getCartByID = await cartsDB.getById(req.params.cid);
    if (!getCartByID) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const getProductById = await productsDB.getProductById(req.params.pid);

    if (!getProductById) {
      return res.status(404).send({ error: "Producto no encontrado" });
    }

    const addedToCart = await cartsDB.addProductCart(
      req.params.cid,
      req.params.pid
    );

    res.status(200).send({ status: "success", addedToCart: addedToCart });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }

  /* 
  let cid = req.params.cid;
  let carritos = await fs.promises.readFile(path, "utf-8");
  carritos = await JSON.parse(carritos);
  const index = carritos.findIndex((e) => e.id == cid);

  // si no existe el cid se termina y devuelve 400
  if (index === -1) {
    return res
      .status(400)
      .send({ status: "error", error: "Carrito no encontrado" });
  }
  // si cid existe -> chequear si existe el pid-> Si existe aumentar en 1 el quantity -> Sino agregar push un nuevo objecto al arreglo
  //const newProd = carritos[cid].products;

  const indexPid = carritos[index].products.findIndex(
    (e) => e.id === req.params.pid
  );

  // si no existe el producto en el carrito se agrega el producto
  if (indexPid === -1) {
    let product = { id: req.params.pid, quantity: 1 };
    carritos[index].products.push(product);
    await fs.promises.writeFile(path, JSON.stringify(carritos));
    return res.send({
      status: "success",
      message: "El producto se agrego al carrito",
      payload: carritos[index],
    });
  } else {
    ++carritos[index].products[indexPid].quantity;
    await fs.promises.writeFile(path, JSON.stringify(carritos));
    res.send({ status: "success", payload: carritos[index] });
  } */
});

router.delete("/api/carts/:cid/products/:pid", async (req, res) => {
  try {
    const getCartByID = await cartsDB.getById(req.params.cid);

    if (!getCartByID) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }

    const exist = getCartByID.products.find(
      (e) => e.product._id == req.params.pid
    );

    if (!exist) {
      return res
        .status(404)
        .send({ error: "Producto no encontrado en el carrito" });
    }
    await cartsDB.deleteProdInCart(req.params.cid, req.params.pid);
    res.status(200).send({
      status: "success",
      info: "El producto fue eliminado del carrito",
    });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.delete("/api/carts/:cid", async (req, res) => {
  try {
    const existCart = await cartsDB.getById(req.params.cid);
    if (!existCart) {
      return res
        .status(404)
        .send({ Status: "error", message: "Carrito no encontrado" });
    }
    const emptyCart = await cartsDB.delProdsInCart(req.params.cid);
    res.status(200).send({ status: "success", emptyCart: emptyCart });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.put("/api/carts/:cid", async (req, res) => {
  const { body } = req;
  const { cid } = req.params;
  try {
    const existCart = cartsDB.getCartByID(+cid);
    if (!existCart) {
      return res
        .status(404)
        .send({ Status: "error", message: "No exite el carrito" });
    }
    body.forEach(async (item) => {
      const existProd = await productsDB.getProductById(+item.idx);
      if (!existProd) {
        return res
          .status(404)
          .send({ Status: "error", message: `Prod ${item.idx} not found` });
      }
    });

    const newCart = await cartsDB.insertArrayProds(+cid, body);
    res.status(200).send({ status: "success", newCart: newCart });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
});
router.put("api/carts/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    const getCartByID = await cartsDB.getCartByID(+cid);
    if (!getCartByID) {
      return res.status(404).send({ error: "Carrito no encontrado" });
    }
    const exist = getCartByID.products.find((prod) => prod._id === +pid);
    if (!exist) {
      return res
        .status(404)
        .send({ error: "Producto no encontrado en el carrito" });
    }

    const updateQuantity = await cartsDB.modQuantity(+cid, +pid, +quantity);
    res.status(200).send({ status: "success", payload: updateQuantity });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

export default router;
