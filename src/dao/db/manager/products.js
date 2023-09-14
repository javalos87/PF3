import { productsModel } from "../models/products.js";

class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct = async (product) => {
    try {
      await productsModel.create(product);
    } catch (error) {
      console.log(error.message);
    }
  };

  getProducts = async (limit) => {
    try {
      if (limit) {
        const prodsLimit = await productsModel.find().lean().limit(limit);
        return prodsLimit;
      }

      const getProducts = await productsModel.find().lean();
      return getProducts;
    } catch (error) {
      console.log(error.message);
    }
  };
  getProductsQuery = async (limit, page, query, sort) => {
    try {
      sort === "asc" && (sort = 1);
      sort === "des" && (sort = -1);

      //Ejemplo {"category": "una categoria"}
      const filter = query ? JSON.parse(query) : {};
      const queryOptions = { limit: limit, page: page, lean: true };

      if (sort === 1 || sort === -1) {
        queryOptions.sort = { price: sort };
      }

      const getProducts = await productsModel.paginate(filter, queryOptions);
      getProducts.isValid = !(page <= 0 || page > getProducts.totalPages);
      getProducts.prevLink =
        getProducts.hasPrevPage &&
        `http://localhost:8080/api/products?page=${getProducts.prevPage}&limit=${limit}`;
      getProducts.nextLink =
        getProducts.hasNextPage &&
        `http://localhost:8080/api/products?page=${getProducts.nextPage}&limit=${limit}`;

      getProducts.status = getProducts ? "success" : "error";

      return getProducts;
    } catch (error) {
      console.log(error.message);
    }
  };

  deleteProduct = async (id) => {
    try {
      return await productsModel.deleteOne({ _id: id });
    } catch (error) {
      console.log(error.message);
    }
  };

  updateProduct = async (id, product) => {
    const { title, description, code, price, stock, category, thumbnails } =
      product;
    try {
      return await productsModel.updateOne(
        { _id: id },
        {
          title: title,
          description: description,
          code: code,
          price: price,
          stock: stock,
          category: category,
          thumbnails: thumbnails,
        }
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  getProductById = async (pid) => {
    try {
      const product = productsModel.findOne({ _id: pid });
      return product;
    } catch (error) {
      console.log(error.message);
    }
  };
}

export default ProductManager;
