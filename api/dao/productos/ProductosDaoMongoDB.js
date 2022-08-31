const ProductoDB = require('../../../models/prodmongo');

let ProductosDaoMongoDB = class ProductosDaoMongoDB {

  getProductos = async (req, res) => {
    let productos = await 
    ProductoDB.find({}).lean()
      .then((productos) => {
          return productos
      })
      return productos
  }

  getProducto = async (req, res) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null
    }
    const producto = await
    ProductoDB.find({ "_id": id })
      .then((producto) => {
        return producto
      })
      return producto
  }

  nuevoProducto = (req, res) => {
    let producto = new ProductoDB({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      code: req.body.code,
      thumbnail: req.body.thumbnail,
      stock: req.body.stock
    })
    producto.save((err, prod) => {
    })
  }

  actualizarProducto = async (req, res) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null
    }
    let { name, price, description, code, thumbnail, stock } = req.body;
    const update = await
    ProductoDB.updateOne({ "_id": id }, { 'name': name, 'price': price, 'thumbnail': thumbnail, 'description': description, 'code': code, 'stock': stock })
      .then((update) => {
        return update
      })
      return update
  }

  borrarProducto = async (req, res) => {
    const { id } = req.params;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return null
    }
    const deleted = await
    ProductoDB.deleteOne({ "_id": id })
      .then((deleted) => {
        return deleted
      })
      return deleted
  }
}

module.exports = ProductosDaoMongoDB