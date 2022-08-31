const CarritoDB = require('../../../models/cartmongo');
const logger = require('../../../logger');


let CarritosDaoMongoDB = class CarritosDaoMongoDB {

  crearCarrito = async (req, res) => {
    let carritoNuevo = {
      fecha: new Date(),
      productos: JSON.stringify([])
    }
    const carritos_id = await
      CarritoDB.insertMany(carritoNuevo)
        .then(function (result) {
          // console.log(result)
          logger.info(result)
          return result
        })
    const carrito = await
      CarritoDB.find({ "_id": carritos_id })
        .then((carrito) => {
          return carrito
        })
    return carrito
  }

  borrarCarrito = (req, res) => {
    const { id_carrito } = req.params
    if (!id_carrito.match(/^[0-9a-fA-F]{24}$/)) {
      return null
    }
    CarritoDB.deleteOne({ "_id": id_carrito })
      .then(() => {
        // console.log('carrito borrado')
        logger.info('carrito borrado')
      })
  }

  getCarrito = async (req, res) => {
    const { id_carrito } = req.params;
    if (!id_carrito.match(/^[0-9a-fA-F]{24}$/)) {
      return null
    }
    const carrito = await
      CarritoDB.findOne({ "_id": id_carrito })
        .then((carrito) => {
          return carrito
        })
    return carrito
  }

  nuevoProducto = async (req, res) => {
    const { id_carrito } = req.params;
    const { id_producto } = req.params;
    if (!id_carrito.match(/^[0-9a-fA-F]{24}$/)) {
      return null
    }
    if (!id_producto.match(/^[0-9a-fA-F]{24}$/)) {
      return null
    }
    const producto = await ProductoDB.findOne({ "_id": id_producto })
      .then((producto) => {
        return producto
      })
    if (producto) {
      const carrito = await CarritoDB.findOne({ "_id": id_carrito })
        .then((carrito) => {
          return carrito
        })
      if (carrito) {
        let productos = JSON.parse(carrito.productos)
        productos.push(producto)
        carrito.productos = JSON.stringify(productos)
        const updated = await CarritoDB.findOne({ "_id": id_carrito }).updateOne(({
          productos: carrito.productos
        }))
          .then((updated) => {
            return updated
          })
        //Si se pudo modificar devuelvo el carrito
        if (updated) {
          return carrito
        } else {//Si no se pudo modificar (algun error), devuelvo null
          return null
        }
      } else {//Si no se encontro el carrito, return null
        return null
      }
    } else {//Si no se encontro el producto, return null
      return null
    }
  }

  borrarProducto = async (req, res) => {
    const { id_carrito } = req.params;
    const { id_producto } = req.params;
    if (!id_carrito.match(/^[0-9a-fA-F]{24}$/)) {
      return null
    }
    if (!id_producto.match(/^[0-9a-fA-F]{24}$/)) {
      return null
    }
    const producto = await ProductoDB.findOne({ "_id": id_producto })
      .then((producto) => {
        return producto
      })
    if (producto) {
      const carrito = await CarritoDB.findOne({ "_id": id_carrito })
        .then((carrito) => {
          return carrito
        })
      if (carrito) {
        let productos = JSON.parse(carrito.productos)
        const index = productos.findIndex((producto) => producto.id == id_producto);
        productos.splice(index, 1);
        carrito.productos = JSON.stringify(productos)
        const updated = await CarritoDB.findOne({ "_id": id_carrito }).updateOne(({
          productos: carrito.productos
        }))
          .then((updated) => {
            return updated
          })
        if (updated) {
          return carrito
        } else {//Si no se pudo modificar (algun error), devuelvo null
          return null
        }
      } else {//Si no se encontro el carrito, return null
        return null
      }
    } else {//Si no se encontro el producto, return null
      return null
    }
  }
}

module.exports = CarritosDaoMongoDB