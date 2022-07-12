const { Schema, model } = require("mongoose");

const ProductoSchema = Schema({
  title: {
    type: String,
    required: [true, "Title requerido"],
  },
  price: {
    type: Number,
  },
  thumbnail: {
    type: String,
  },
});

module.exports = model("Producto", ProductoSchema);
