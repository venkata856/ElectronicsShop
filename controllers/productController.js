const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances, authors and genre counts (in parallel)
  const [numProducts, numBrand, numCategory] = await Promise.all([
    Product.countDocuments({}).exec(),
    Brand.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local Inventory Home",
    product_count: numProducts,
    brand_count: numBrand,
    category_count: numCategory,
  });
});

exports.product_create_get = function (req, res, next) {
  res.send("not yet implemented");
};

// POST request for creating Book.
exports.product_create_post = function (req, res, next) {
  res.send("not yet implemented");
};

// GET request to delete Book.
exports.product_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances for specific book
  const product = await Product.findById(req.params.id).exec();

  if (product === null) {
    res.redirect("/catalog/");
  }

  res.render("product_delete", {
    title: product.title,
    product: product,
  });
});

// POST request to delete Book.
exports.product_delete_post = asyncHandler(async (req, res, next) => {
  await Product.findByIdAndRemove(req.body.productid);
  res.redirect("/catalog/products");
});

// GET request to update Book.
exports.product_update_get = function (req, res, next) {
  res.send("not yet implemented");
};

// POST request to update Book.
exports.product_update_post = function (req, res, next) {
  res.send("not yet implemented");
};

// GET request for one Book.
exports.product_detail = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances for specific book
  const product = await Product.findById(req.params.id)
    .populate("category")
    .populate("brand")
    .exec();

  if (product === null) {
    // No results.
    const err = new Error("Book not found");
    err.status = 404;
    return next(err);
  }

  res.render("product_detail", {
    title: product.title,
    product: product,
  });
});

// GET request for list of all Book items.
exports.product_list = asyncHandler(async (req, res, next) => {
  const allProducts = await Product.find({}, "name category brand")
    .sort({ name: 1 })
    .populate("category")
    .populate("brand")
    .exec();

  res.render("product_list", {
    title: "Product List",
    product_list: allProducts,
  });
});
