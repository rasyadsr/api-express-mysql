var express = require("express");
var router = express.Router();
const Validator = require("fastest-validator");
const { Product } = require("../models");

const v = new Validator();

router.get("/", async (req, res) => {
  const products = await Product.findAll();
  return res.json(products);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  let product = await Product.findByPk(id);
  return res.json(product || {});
});

router.post("/", async (req, res) => {
  const schema = {
    name: "string",
    brand: "string",
    description: "string|optional",
  };

  const validate = v.validate(req.body, schema); // return ini adalah array

  if (validate.length) {
    // kalau ada error
    return res.status(400).json(validate);
  }

  const product = await Product.create(req.body);

  res.json(product);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  let product = await Product.findByPk(id);

  if (!product) {
    return res.json({
      message: "Product not found",
    });
  }

  const schema = {
    name: "string|optional",
    brand: "string|optional",
    description: "string|optional",
  };

  const validate = v.validate(req.body, schema); // return ini adalah array

  if (validate.length) {
    // kalau ada error
    return res.status(400).json(validate);
  }

  product = await product.update(req.body);

  res.json({
    message: "Berhasil mengupdate",
    data: product,
  });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  let product = await Product.findByPk(id);

  if (!product) {
    return res.json({
      message: "Product not found",
    });
  }

  await product.destroy();

  res.json({
    message: "Product berhasil di hapus",
  });
});

module.exports = router;
