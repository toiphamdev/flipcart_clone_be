const Product = require("../models/product");
const Category = require("../models/category");

const slugify = require("slugify");
exports.addProduct = (req, res) => {
  const { name, price, description, quantity, category } = req.body;
  let productPictures = [];
  if (req.files.length > 0) {
    productPictures = req.files.map((file) => {
      return { img: file.filename };
    });
  }
  const product = new Product({
    name,
    slug: slugify(name),
    price,
    description,
    quantity,
    productPictures,
    category,
    createdBy: req.user._id,
  });

  product.save((error, product) => {
    if (error) {
      res.status(400).json({ error });
    }
    if (product) {
      res.status(201).json({ product });
    }
  });
};

exports.getProductBySlug = (req, res) => {
  const { slug } = req.params;
  Category.findOne({ slug: slug })
    .select("_id")
    .exec((error, category) => {
      if (error) return res.status(200).json({ error });
      if (category) {
        Product.find({ category: category._id }).exec((error, products) => {
          if (error) return res.status(200).json({ error });
          if (products.length > 0)
            res.status(200).json({
              products,
              productsByPrice: {
                under2m: products.filter((product) => product.price < 2000000),
                under5m: products.filter(
                  (product) =>
                    product.price > 2000000 && product.price < 5000000
                ),
                under10m: products.filter(
                  (product) =>
                    product.price > 5000000 && product.price < 10000000
                ),
                under20m: products.filter(
                  (product) =>
                    product.price > 10000000 && product.price < 20000000
                ),
                over20m: products.filter((product) => product.price > 20000000),
              },
            });
        });
      }
      // res.status(200).json({ category });
    });
};

exports.getProductDetailsById = (req, res) => {
  const { productId } = req.params;
  if (productId) {
    Product.findOne({ _id: productId }).exec((error, product) => {
      if (error) return res.status(400).json({ error });
      if (product) return res.status(200).json({ product });
    });
  } else {
    res.status(400).json({ error: "Params is required" });
  }
};

exports.deleteProductById = (req, res) => {
  const { productId } = req.body.payload;
  if (productId) {
    Product.deleteOne({ _id: productId }).exec((error, result) => {
      if (error) return res.status(400).json({ error });
      if (result) return res.status(202).json({ result });
    });
  } else {
    res.status(400).json({ error: "Params is required" });
  }
};
exports.getProducts = async (req, res) => {
  const products = await Product.find({ createdBy: req.user._id })
    .select("_id name price quantity slug description productPictures category")
    .populate({ path: "category", select: "_id name" })
    .exec();

  res.status(200).json({ products });
};
