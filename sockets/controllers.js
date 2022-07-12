// data de productos
// const optSqlite = require("../options/sqliteOpt");
// const optMysql = require("../options/mysqlOpt");

// const { ContainerProductos, ContainerChat } = require("../models/container");
const util = require("util");

const { schema, normalize, denormalize } = require("normalizr");
const Producto = require("../models/producto");
const Chat = require("../models/chat");

const { ContainerMongo } = require("../models/containerMongo");

const productosData = new ContainerMongo(Producto);
const chatData = new ContainerMongo(Chat);

// normalizacion
const authorSchema = new schema.Entity("authors");
const messageSchema = new schema.Entity(
  "mensajes",
  { author: authorSchema },
  { idAttribute: "_id" }
);
const global = new schema.Entity("global", {
  messages: [messageSchema],
});

function print(objeto) {
  console.log(util.inspect(objeto, false, 12, true));
}

const socketController = (socket) => {
  // aca tambien puedo poner una bienvenida al usuario que se conecta

  // apenas se conecta mando los productos
  productosData.getAll().then((prods) => {
    socket.emit("enviar-producto", prods);
  });
  // y mensajes que ya tengo
  chatData.getAll().then((chat) => {
    // aca tengo que enviar pero normalizado

    const messages = JSON.stringify(chat);
    const data = { id: "mensajes", messages };

    // console.log("Objeto Normalizado"); JSON Normalizado
    const dataNormalized = normalize(data, global);
    // print(dataNormalized);

    // console.log("Objeto Desnormalizado");
    // const dataDeNormalized = denormalize(
    //   dataNormalized.result,
    //   global,
    //   dataNormalized.entities
    // );
    // print(dataDeNormalized);
    // const chatFront = JSON.parse(dataDeNormalized.messages);
    // console.log(chatFront);

    // socket.emit("enviar-mensaje", chat);
    socket.emit("enviar-mensaje", dataNormalized);
  });

  // escuchando al cliente
  socket.on("enviar-producto", (payload, retorno) => {
    productosData.add(payload).then((prods) => {
      retorno(prods);
      socket.broadcast.emit("enviar-producto", prods);
    });
  });

  // escucho al cliente en otro evento
  socket.on("enviar-mensaje", (payload, retorno) => {
    chatData.add(payload).then((chat) => {
      retorno(chat);
      socket.broadcast.emit("enviar-mensaje", chat);
    });
  });
};

module.exports = socketController;
