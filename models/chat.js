const { Schema, model } = require("mongoose");

const ChatSchema = Schema({
  author: {
    id: { type: String },
    nombre: { type: String },
    apellido: { type: String },
    edad: { type: Number },
    alias: { type: String },
    avatar: { type: String },
  },
  mensaje: {
    type: String,
  },
  fecha: {
    type: Date,
  },
});

module.exports = model("Chat", ChatSchema);
