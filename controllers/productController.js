const Product = require("../models/product");
const Brand = require("../models/brand");
const Category = require("../models/category");
var fs = require('fs');
var path = require('path');

const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const multer  = require('multer')


const storage= multer.diskStorage({
  destination:"uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },

})
const upload = multer({ storage: storage });
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

exports.product_create_get = asyncHandler(async (req, res, next) => {
  // Get all authors and genres, which we can use for adding to our book.
  const [ allBrand,allCatageory] = await Promise.all([
    Brand.find().exec(),
    Category.find().exec(),
  ]);

  res.render("product_form", {
    title: "Create Product",
    brands: allBrand,
    categeories: allCatageory,
  });
});

// POST request for creating Book.
exports.product_create_post = [upload.single('image'),
  // Convert the genre to an array.
  // (req, res, next) => {
  //   if (!(req.body.category instanceof Array)) {
  //     if (typeof req.body.category === "undefined") req.body.category = [];
  //     else req.body.category = new Array(req.body.category);
  //   }
  //   next();
  // },
  // Validate and sanitize fields.
  body("name", "name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand", "brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("quantity", "quantity must not be empty").trim().isLength({ min: 1 }).escape(),
  // body("image","image should not be empty").trim().isLength({min:5}).escape(),
  body("category","category must not be empty").trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.

  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      image: {data:fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),contentType:req.file.mimetype},
      category: req.body.category,
      brand: req.body.brand,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      const [allCatageory, allBrands] = await Promise.all([
        Category.find().exec(),
        Brand.find().exec(),
      ]);

      // Mark our selected genres as checked.
      for (const category of allCatageory) {
        if ((product.category === undefined) || (product.category._id=== category._id)) {
          category.checked = "true";
        }
      }

      res.render("product_form", {
        title: "Create Product",
        brands: allBrands,
        categeories: allCatageory,
        product: product,
        errors: errors.array(),
      });
    } else {
      // Data from form is valid. Save book.
      await product.save();
      res.redirect(product.url);
    }
  }),
];

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
exports.product_update_get = asyncHandler(async (req, res, next) => {
  // Get book, authors and genres for form.
  const [product, allCatageory, allBrands] = await Promise.all([
    Product.findById(req.params.id).populate("category").populate("brand").exec(),
    Category.find().exec(),
    Brand.find().exec(),
  ]);

  if (product === null) {
    // No results.
    const err = new Error("product not found");
    err.status = 404;
    return next(err);
  }

  // Mark our selected genres as checked.
  for (const category of allCatageory) {
    if ((product.category === undefined) || (product.category._id=== category._id)) {
      category.checked = "true";
    }
  }

  res.render("product_form", {
    title: "Update Product",
    brands: allBrands,
    categeories: allCatageory,
    product: product,
  });
});

// POST request to update Book.
exports.product_update_post = [upload.single('image'),


  body("name", "name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand", "brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("quantity", "quantity must not be empty").trim().isLength({ min: 1 }).escape(),
  // body("image","image should not be empty").trim().isLength({min:5}).escape(),
  body("category","category must not be empty").trim().isLength({ min: 1 }).escape(),
  // Process request after validation and sanitization.

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    // Create a Book object with escaped and trimmed data.
    const product = new Product({
      name: req.body.name,
      description: req.body.description,
      quantity: req.body.quantity,
      image: {data:fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),contentType:req.file.mimetype},
      category: req.body.category,
      brand: req.body.brand,
    });

    if (!errors.isEmpty()) {
   // Get all authors and genres for form.
   const [allCatageory, allBrands] = await Promise.all([
    Category.find().exec(),
    Brand.find().exec(),
  ]);

  // Mark our selected genres as checked.
  for (const category of allCatageory) {
    if ((product.category === undefined) || (product.category._id=== category._id)) {
      category.checked = "true";
    }
  }

  res.render("product_form", {
    title: "Create Product",
    brands: allBrands,
    categeories: allCatageory,
    product: product,
    errors: errors.array(),
  });
      return;
    } else {
      // Data from form is valid. Update the record.
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        description: req.body.description,
        quantity: req.body.quantity,
        image: {data:fs.readFileSync(path.join(__dirname + '/../uploads/' + req.file.filename)),contentType:req.file.mimetype},
        category: req.body.category,
        brand: req.body.brand,
      });
      // Redirect to book detail page.
      res.redirect(updatedProduct.url);
    }
  }),
];

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
