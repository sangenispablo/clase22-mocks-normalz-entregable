class ContainerMongo {

  constructor(modelo) {
    this.modelo = modelo;
  }

  async add(objeto) {
    const newObjeto = new this.modelo(objeto);
    await newObjeto.save();
    const objetos = await this.modelo.find();
    return objetos;
  }

  async getAll() {
    const objetos = await this.modelo.find();
    return objetos;
  }
}

module.exports = { ContainerMongo };
