const { request, response } = require("express");
const { faker } = require("@faker-js/faker");

const productosFaker = async (req = request, res = response) => {
  const productos = [];
  for (let i = 1; i <= 5; i++) {
    const element = {
      id: i,
      nombre: faker.commerce.product(),
      precio: faker.commerce.price(),
      foto: `https://picsum.photos/id/${faker.datatype.number({
        min: 1,
        max: 200,
      })}/150/80`,
    };
    productos.push(element);
  }
  res.json({
    msg: "ok",
    data: productos,
  });
};

module.exports = {
  productosFaker,
};
