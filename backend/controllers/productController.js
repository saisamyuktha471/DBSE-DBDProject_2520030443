const Product = require("../models/Product");


// ======================================================
// GET ALL PRODUCTS - CUSTOMER
// ======================================================

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      order: [["id", "ASC"]],
    });

    return res.status(200).json(products);

  } catch (error) {
    console.error("Get Products Error:", error);

    return res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};


// ======================================================
// GET SINGLE PRODUCT BY ID - CUSTOMER
// ======================================================

const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    return res.status(200).json(product);

  } catch (error) {
    console.error("Get Product Error:", error);

    return res.status(500).json({
      message: "Failed to fetch product",
    });
  }
};


// ======================================================
// CREATE PRODUCT - ADMIN
// ======================================================

const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      stock,
      image,
      description,
      rating,
    } = req.body;

    // Validate required fields
    if (!name || !category || price === undefined) {
      return res.status(400).json({
        message: "Name, category and price are required",
      });
    }

    // Validate price
    if (Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    // Validate stock
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    const product = await Product.create({
      name,
      category,
      price: Number(price),
      stock: stock !== undefined ? Number(stock) : 0,
      image: image || null,
      description: description || null,
      rating: rating !== undefined ? Number(rating) : 0,
    });

    return res.status(201).json({
      message: "Product created successfully",
      product,
    });

  } catch (error) {
    console.error("Create Product Error:", error);

    return res.status(500).json({
      message: "Failed to create product",
    });
  }
};


// ======================================================
// UPDATE PRODUCT - ADMIN
// ======================================================

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      category,
      price,
      stock,
      image,
      description,
      rating,
    } = req.body;

    // Find product
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Validate price
    if (price !== undefined && Number(price) < 0) {
      return res.status(400).json({
        message: "Price cannot be negative",
      });
    }

    // Validate stock
    if (stock !== undefined && Number(stock) < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    // Update only provided fields
    if (name !== undefined) {
      product.name = name;
    }

    if (category !== undefined) {
      product.category = category;
    }

    if (price !== undefined) {
      product.price = Number(price);
    }

    if (stock !== undefined) {
      product.stock = Number(stock);
    }

    if (image !== undefined) {
      product.image = image;
    }

    if (description !== undefined) {
      product.description = description;
    }

    if (rating !== undefined) {
      product.rating = Number(rating);
    }

    await product.save();

    return res.status(200).json({
      message: "Product updated successfully",
      product,
    });

  } catch (error) {
    console.error("Update Product Error:", error);

    return res.status(500).json({
      message: "Failed to update product",
    });
  }
};


// ======================================================
// DELETE PRODUCT - ADMIN
// ======================================================

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Find product
    const product = await Product.findByPk(id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Delete product
    await product.destroy();

    return res.status(200).json({
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error("Delete Product Error:", error);

    return res.status(500).json({
      message: "Failed to delete product",
    });
  }
};


// ======================================================
// EXPORT ALL FUNCTIONS
// ======================================================

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};