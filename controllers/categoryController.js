const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
exports.category_create_get = (req, res, next) => {
  res.render("category_form", { title: "Create Category" });
};

//POST request for creating Genre.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const categoryExists = await Category.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (categoryExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(categoryExists.url);
      } else {
        await category.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(category.url);
      }
    }
  }),
];

// GET request to delete Genre.
exports.category_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances for specific book
  const [category, products] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }).exec(),
  ]);

  if (category === null) {
    res.redirect("/catalog/");
  }

  res.render("category_delete", {
    title: category.title,
    category: category,
    product_list: products,
  });
});

// POST request to delete Genre.
exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, products] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }).exec(),
  ]);

  if (products.length > 1) {
    res.render("category_delete", {
      title: category.title,
      category: category,
      product_list: products,
    });
    return;
  } else {
    await Category.findByIdAndRemove(req.body.categoryid);
    res.redirect("/catalog/categories");
  }
});

// GET request to update Genre.
exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).exec();

  if (category === null) {
    // No results.
    const err = new Error("Brand Not found");
    err.status = 404;
    return next(err);
  }
  res.render("category_form", {
    title: "update Category",
    category: {
      name: category.name,
    },
  });
});

// POST request to update Genre.
exports.category_update_post = [
  // Validate and sanitize the name field.
  body("name", "category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const category = new Category({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
      });
      // Redirect to genre detail page.
      res.redirect(updatedCategory.url);
    }
  }),
];

// GET request for one Genre.
exports.category_detail = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const [category, allProducts] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Product.find({ category: req.params.id }, "name").exec(),
  ]);

  if (category === null) {
    // No results.
    const err = new Error("category not found");
    err.status = 404;
    return next(err);
  }

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    products_list: allProducts,
  });
});

// GET request for list of all Genre.
exports.category_list = asyncHandler(async (req, res, next) => {
  const allCatagory = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Category List",
    category_list: allCatagory,
  });
});
