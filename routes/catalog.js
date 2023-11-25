const express = require("express");
const router = express.Router();

// Require controller modules.
const brand_controller = require("../controllers/brandController");
const product_controller = require("../controllers/productController");
const category_controller = require("../controllers/categoryController");

// GET catalog home page.
router.get("/", product_controller.index);

// GET request for creating a Book. NOTE This must come before routes that display Book (uses id).
router.get("/product/create", product_controller.product_create_get);

// POST request for creating Book.
router.post("/product/create", product_controller.product_create_post);

// GET request to delete Book.
router.get("/product/:id/delete", product_controller.product_delete_get);

// POST request to delete Book.
router.post("/product/:id/delete", product_controller.product_delete_post);

// GET request to update Book.
router.get("/product/:id/update", product_controller.product_update_get);

// POST request to update Book.
router.post("/product/:id/update", product_controller.product_update_post);

// GET request for one Book.
router.get("/product/:id", product_controller.product_detail);

// GET request for list of all Book items.
router.get("/products", product_controller.product_list);

/// AUTHOR ROUTES ///

// GET request for creating Author. NOTE This must come before route for id (i.e. display author).
router.get("/brand/create", brand_controller.brand_create_get);

// POST request for creating Author.
router.post("/brand/create", brand_controller.brand_create_post);

// GET request to delete Author.
router.get("/brand/:id/delete", brand_controller.brand_delete_get);

// POST request to delete Author.
router.post("/brand/:id/delete", brand_controller.brand_delete_post);

// GET request to update Author.
router.get("/brand/:id/update", brand_controller.brand_update_get);

// POST request to update Author.
router.post("/brand/:id/update", brand_controller.brand_update_post);

// GET request for one Author.
router.get("/brand/:id", brand_controller.brand_detail);

// GET request for list of all Authors.
router.get("/brands", brand_controller.brand_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/category/create", category_controller.category_create_get);

//POST request for creating Genre.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete Genre.
router.get("/category/:id/delete", category_controller.category_delete_get);

// POST request to delete Genre.
router.post("/category/:id/delete", category_controller.category_delete_post);

// GET request to update Genre.
router.get("/category/:id/update", category_controller.category_update_get);

// POST request to update Genre.
router.post("/category/:id/update", category_controller.category_update_post);

// GET request for one Genre.
router.get("/category/:id", category_controller.category_detail);

// GET request for list of all Genre.
router.get("/categories", category_controller.category_list);

module.exports = router;
