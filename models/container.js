class ContainerProductos {
  constructor(options) {
    this.table = "productos";
    this.knex = require("knex")(options);
    this.createTable();
  }

  async createTable() {
    const existTable = await this.knex.schema.hasTable(this.table);
    if (!existTable) {
      await this.knex.schema.createTable(this.table, (t) => {
        t.increments("id").primary();
        t.string("title", 100);
        t.float("price");
        t.string("thumbnail", 100);
      });
    }
  }

  async add(objeto) {
    await this.knex(this.table).insert(objeto);
    const productos = await this.knex.select().table(this.table);
    return productos;
  }

  async getAll() {
    const productos = await this.knex.select().table(this.table);
    return productos;
  }
}

class ContainerChat{
  constructor(options) {
    this.table = "chat";
    this.knex = require("knex")(options);
    this.createTable();
  }

  async createTable() {
    const existTable = await this.knex.schema.hasTable(this.table);
    if (!existTable) {
      await this.knex.schema.createTable(this.table, (t) => {
        t.increments("id").primary();
        t.string("usuario", 100);
        t.string("mensaje", 100);
        t.datetime("fecha");
      });
    }
  }

  async add(objeto) {
    await this.knex(this.table).insert(objeto);
    const productos = await this.knex.select().table(this.table);
    return productos;
  }

  async getAll() {
    const productos = await this.knex.select().table(this.table);
    return productos;
  }
}

module.exports = { ContainerProductos, ContainerChat };
