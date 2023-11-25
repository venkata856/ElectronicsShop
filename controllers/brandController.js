const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.brand_create_get = (req, res, next) => {
  res.render("brand_form", { title: "Create Brand" });
};

// POST request for creating Author.
exports.brand_create_post = [
  // Validate and sanitize the name field.
  body("name", "brand name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("ceo_name", "Ceo Name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const brand = new Brand({
      name: req.body.name,
      ceo_name: req.body.ceo_name,
      started: req.body.started,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("brand_form", {
        title: "Create Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      const brandExists = await Brand.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (brandExists) {
        // Genre exists, redirect to its detail page.
        res.redirect(brandExists.url);
      } else {
        await brand.save();
        // New genre saved. Redirect to genre detail page.
        res.redirect(brand.url);
      }
    }
  }),
];

// GET request to delete Author.
exports.brand_delete_get = asyncHandler(async (req, res, next) => {
  // Get details of books, book instances for specific book
  const [brand, products] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Product.find({ brand: req.params.id }).exec(),
  ]);

  if (brand === null) {
    res.redirect("/catalog/");
  }

  res.render("brand_delete", {
    title: brand.title,
    brand: brand,
    product_list: products,
  });
});

// POST request to delete Author.
exports.brand_delete_post = asyncHandler(async (req, res, next) => {
  const [brand, products] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Product.find({ brand: req.params.id }).exec(),
  ]);

  if (products.length > 1) {
    res.render("brand_delete", {
      title: brand.title,
      brand: brand,
      product_list: products,
    });
    return;
  } else {
    await Brand.findByIdAndRemove(req.body.brandid);
    res.redirect("/catalog/brands");
  }
});

// GET request to update Author.
exports.brand_update_get = asyncHandler(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id).exec();

  if (brand === null) {
    // No results.
    const err = new Error("Brand Not found");
    err.status = 404;
    return next(err);
  }
  res.render("brand_form", {
    title: "update Brand",
    brand: {
      name: brand.name,
      ceo_name: brand.ceo_name,
      started: brand.startedDate,
    },
  });
});

// POST request to update Author.
exports.brand_update_post = [
  // Validate and sanitize the name field.
  body("name", "brand name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("ceo_name", "Ceo Name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("started", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    const brand = new Brand({
      name: req.body.name,
      ceo_name: req.body.ceo_name,
      started: req.body.started,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("brand_form", {
        title: "update Brand",
        brand: brand,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        ceo_name: req.body.ceo_name,
        started: req.body.started,
      });
      // Redirect to genre detail page.
      res.redirect(updatedBrand.url);
    }
  }),
];

// GET request for one Author.
exports.brand_detail = asyncHandler(async (req, res, next) => {
  // Get details of author and all their books (in parallel)
  const brandDetail = await Brand.findById(req.params.id).exec();

  if (brandDetail === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render("brand_detail", {
    title: "Brand Detail",
    brand: brandDetail,
  });
});

// GET request for list of all Authors.
exports.brand_list = asyncHandler(async (req, res, next) => {
  const allBrands = await Brand.find().sort({ name: 1 }).exec();
  res.render("brand_list", {
    title: "Brand List",
    brand_list: allBrands,
  });
});
