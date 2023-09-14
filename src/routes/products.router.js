import { Router } from "express";
import fs from "fs";
import __dirname, { uploader } from "../utils.js";
import ProductManager from "../dao/db/manager/products.js";
const path = __dirname + "/productos.json";

const productManager = new ProductManager();
const router = Router();

//Ruta raiz donde devuelve todos los productos
router.get("/api/products", async (req, res) => {
  /* Manejo de archivo
  let productos = await fs.promises.readFile(path, "utf-8");
  productos = await JSON.parse(productos);
  */
  const { limit = 10, page = 1, query, sort } = req.query;
  try {
    const products = await productManager.getProductsQuery(
      limit,
      page,
      query,
      sort
    );
    res.status(200).send({ status: "success", payload: products });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//Ruta con params pid, donde devuelve el producto
router.get("/api/products/:pid", async (req, res) => {
  //Manejo de archivo
  /* let pid = req.params.pid;
  let productos = await fs.promises.readFile(path, "utf-8");
  productos = await JSON.parse(productos);
  const index = productos.findIndex((e) => e.id == pid);
  if (index === -1) {
    return res
      .status(400)
      .send({ status: "error", error: "Producto no encontrado" });
  } else {
    res.send({ status: "success", payload: productos[index] });
  } */
  try {
    const pid = req.params.pid;
    const product = await productManager.getProductById(pid);
    if (!product) {
      throw new Error("No existe el producto");
    }
    res.status(200).send({ status: "success", product: product });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

//Ruta para agregar productos si uso del midleware upload
/* router.post("/api/products", async (req, res) => {
  let product = req.body;
  if (
    !product.title ||
    !product.description ||
    !product.code ||
    !product.price ||
    !product.status ||
    !product.stock ||
    !product.category ||
    !product.thumbnails
  ) {
    return res
      .status(400)
      .send({ status: "error", error: "Valores incompletos" });
  }

  const productsFile = await fs.promises.readFile(path, "utf-8");

  let products = await JSON.parse(productsFile);

  products.length === 0
    ? (product.id = 1)
    : (product.id = products[products.length - 1].id + 1);

  products.push(product);
  await fs.promises.writeFile(path, JSON.stringify(products));

  res.send({ status: "success", message: "Se agrego el producto" });
}); */

router.put(
  "/api/products/:pid",
  uploader.array("thumbnails"),
  async (req, res) => {
    let files = req.files;
    if (!req.files) {
      return res
        .status(500)
        .send({ status: "error", error: "No se pudo guardar las imagenes" });
    }
    const arreglo = [];
    const thumbs = files.map((e) => {
      arreglo.push(e.path);
      return arreglo;
    });

    console.log("tiempo: ", new Date().toLocaleDateString("ko-KR"));
    try {
      const pid = req.params.pid;
      const updateProduct = req.body;
      if (!arreglo.length == 0) {
        updateProduct.thumbnails = arreglo;
      }
      const updatedProduct = await productManager.updateProduct(
        pid,
        updateProduct
      );
      res
        .status(200)
        .send({ status: "success", updateProduct: updatedProduct });
    } catch (error) {
      res.status(400).send({ error: error.message });
    }
    //Manejo con archivo
    /* let pid = req.params.pid;
  let producto = req.body;
  producto.id = pid;
  let productos = await fs.promises.readFile(path, "utf-8");
  productos = await JSON.parse(productos);
  const index = productos.findIndex((e) => e.id == pid);

  if (index === -1) {
    return res
      .status(400)
      .send({ status: "error", error: "Producto no encontrado" });
  } else {
    productos[index] = producto;
    await fs.promises.writeFile(path, JSON.stringify(productos));
    res.send({
      status: "success",
      payload: productos[index],
      message: "Producto actualizado",
    });
  } */
  }
);

router.delete("/api/products/:pid", async (req, res) => {
  const pid = req.params.pid;
  try {
    if (!pid || pid === "") {
      throw new Error("Debe ingresar un ID");
    }

    const productDeleted = await productManager.deleteProduct(pid);
    res.status(200).send({ status: "success", productDeleted: productDeleted });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
  //Manejo de archivos
  /*   let pid = req.params.pid;
  let producto = req.body;
  producto.id = pid;
  let productos = await fs.promises.readFile(path, "utf-8");
  productos = await JSON.parse(productos);
  const index = productos.findIndex((e) => e.id == pid);

  if (index === -1) {
    return res
      .status(400)
      .send({ status: "error", error: "Producto no encontrado" });
  } else {
    res.send({
      status: "success",
      payload: productos[index],
      message: "Producto Eliminado",
    });
    productos.splice(index, 1);

    await fs.promises.writeFile(path, JSON.stringify(productos));
  } */
});

//Ruta para agregar productos con el Uso de midleware Uploads
router.post("/api/products", uploader.array("thumbnails"), async (req, res) => {
  let files = req.files;
  if (!req.files) {
    return res
      .status(500)
      .send({ status: "error", error: "No se pudo guardar las imagenes" });
  }
  const arreglo = [];
  const thumbs = files.map((e) => {
    arreglo.push(e.path);
    return arreglo;
  });

  try {
    const { title, description, code, price, stock, category, thumbnail } =
      req.body;
    const products = await productManager.getProducts();
    if (products.some((item) => item.code === code)) {
      throw new Error("El código ya existe");
    }
    if (!title || !description || !code || !price || !stock || !category) {
      throw new Error("Faltan completar datos");
    }
    if (thumbnail && !Array.isArray(thumbnail)) {
      return res.send({ error: "El campo de imágenes debe ser un array" });
    }

    if ((thumbnail && thumbnail.length === 0) || thumbnail === "") {
      return res.send({ error: "Falta ingresar una o más imágenes" });
    }

    const newProduct = {
      title,
      description,
      code,
      price,
      stock,
      category,
    };

    newProduct.status = true;
    newProduct.thumbnails = arreglo;
    await productManager.addProduct(newProduct);
    res.status(200).send({ status: "success", newProduct: newProduct });
  } catch (err) {
    res.status(400).send({ error: err.message });
  }

  //Manejo de archivos
  /* let files = req.files;
  if (!req.files) {
    return res
      .status(500)
      .send({ status: "error", error: "No se pudo guardar las imagenes" });
  }
  const arreglo = [];
  const thumbs = files.map((e) => {
    arreglo.push(e.path);
    return arreglo;
  });

  let product = req.body;
  console.log(product);
  if (
    !product.title ||
    !product.description ||
    !product.code ||
    !product.price ||
    !product.status ||
    !product.stock ||
    !product.category
  ) {
    return res.status(400).send({
      status: "error",
      error: "Valores incompletos",
      payload: product,
    });
  }
  product.thumbnails = arreglo;
  const productsFile = await fs.promises.readFile(path, "utf-8");
  let products = await JSON.parse(productsFile);
  products.length === 0
    ? (product.id = 1)
    : (product.id = products[products.length - 1].id + 1);
  products.push(product);
  await fs.promises.writeFile(path, JSON.stringify(products));
  res.send({
    status: "success",
    message: "Se agrego el producto",
    payload: product,
  }); */
});

export default router;
