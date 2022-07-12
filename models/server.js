const express = require("express");
const cors = require("cors");

// controlador para el socket
const socketController = require("../sockets/controllers");

const { dbConnection } = require("../data/configMongo");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.server = require("http").createServer(this.app);
    this.io = require("socket.io")(this.server);
    this.fakerPath = "/api/productos-test";

    this.paths = {};

    // conectar a la BD
    this.conectarDB();

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();

    // Sockets
    this.sockets();
  }

  async conectarDB() {
    await dbConnection();
  }

  sockets() {
    this.io.on("connection", socketController);
  }

  middlewares() {
    // CORS
    this.app.use(cors());

    // Lectura y parseo del body
    this.app.use(express.json());

    // Directorio Público
    this.app.use(express.static("public"));
  }

  routes() {
    this.app.use(this.fakerPath, require("../routes/fakerRoutes"));
  }

  listen() {
    this.server.listen(this.port, () => {
      console.log("Servidor corriendo en puerto", this.port);
    });
  }
}

module.exports = Server;
