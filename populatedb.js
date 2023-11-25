#! /usr/bin/env node

console.log(
  'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Brand = require("./models/brand");
const Product = require("./models/product");
const Category = require("./models/category");

const brands = [];
const products = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createBrands();
  await createProducts();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function categoryCreate(index, name) {
  const category = new Category({ name: name });
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function brandCreate(index, b_name, c_name, d_started) {
  const brandDetail = { name: b_name, ceo_name: c_name };
  if (d_started != false) brandDetail.started = d_started;

  const brand = new Brand(brandDetail);

  await brand.save();
  brands[index] = brand;
  console.log(`brand added: ${b_name} ${c_name}`);
}

async function productCreate(
  index,
  name,
  description,
  image,
  brand,
  category,
  quantity
) {
  const productdetail = {
    name: name,
    description: description,
    image: image,
    quantity: quantity,
    brand: brand,
    category: category,
  };

  const product = new Product(productdetail);
  await product.save();
  products[index] = product;
  console.log(`Added product: ${name}`);
}

async function createCategories() {
  console.log("Adding category");
  await Promise.all([
    categoryCreate(0, "Electronics"),
    categoryCreate(1, "Gifting"),
    categoryCreate(2, "Pets"),
    categoryCreate(3, "Food"),
  ]);
}

async function createBrands() {
  console.log("Adding authors");
  await Promise.all([
    brandCreate(0, "Apple", "Rothfuss", "1973-06-06"),
    brandCreate(1, "Samsung", "Bova", "1932-11-8"),
    brandCreate(2, "Advantage11", "Asimov", "1920-01-02"),
    brandCreate(3, "Visa", "Billings", "1920-04-23"),
    brandCreate(4, "Haldirams", "Jones", "1971-12-16"),
  ]);
}

async function createProducts() {
  console.log("Adding products");
  await Promise.all([
    productCreate(
      0,
      "Iphone 15 Pro",
      "Iphone 15 pro is the product of apple which is same as 14 pro but name changed and price is same. fools will buy it",
      "NA",
      brands[0],
      categories[0],
      14
    ),
    productCreate(
      1,
      "Samsung galaxy 500 pro",
      "samsung phone is also use less but people buy it not sure what is the reason but it exists. fools will buy it",
      "NA",
      brands[0],
      categories[0],
      28
    ),
    productCreate(
      2,
      "visa gift card ",
      "people still buy it even though they already have credit cards. stupid people they pay me some tax on it lol...",
      "NA",
      brands[3],
      categories[1],
      50
    ),
    productCreate(
      3,
      "Dog pizza",
      "This is just a pizza for dogs .lol dogs can eat anything why they need pizza. stupid people they don't want to feed hungry people but dogs",
      "NA",
      brands[2],
      categories[2],
      12
    ),
    productCreate(
      4,
      "Moong dal",
      "deep fried lentils sold in north america for the 4 time the price in india",
      "NA",
      brands[4],
      categories[3],
      900
    ),
    productCreate(
      5,
      "Mac book pro ",
      "Just a laptop but people want it to buy for no reason just in case they want to show off",
      "NA",
      brands[0],
      categories[0],
      14
    ),
    productCreate(
      6,
      "Urad dal",
      "deep fried lentils sold in north america for the 4 time the price in india",
      "NA",
      brands[4],
      categories[3],
      900
    ),
  ]);
}
