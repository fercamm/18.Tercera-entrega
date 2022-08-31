const express = require("express");
const { productosDao } = require('./dao/daos.js');

const { Router } = express;

let router = new Router();

router.get('/productos', async function (req, res) {
  const productos = await productosDao.getProductos()
  res.send(productos)
});

router.get('/lista_productos', async function (req, res) {
  const productos = await productosDao.getProductos()
  // res.send(productos)
  let tieneDatos;
  if (productos.length > 0) {
    tieneDatos = true
  } else {
    tieneDatos = false
  }
  res.render('main', { productos: productos, listExists: tieneDatos });
});

router.get("/productos/:id", async (req, res) => {
  const producto = await productosDao.getProducto(req, res);
  if (!producto){
    res.send("No existe el producto.");
  }else{
    res.send(producto);
  }
  
});

router.post("/productos", function (req, res) {
  productosDao.nuevoProducto(req);
  res.send("Producto Añadido");
});

router.put("/productos/:id", async (req, res) => {
  const update = await productosDao.actualizarProducto(req);
  if (update)
    res.send("Producto actualizado");
  else
    res.send("No existe el producto.");
});

router.delete("/productos/:id", async (req, res) => {
  const deleted = await
    productosDao.borrarProducto(req);
  if (deleted)
    res.send("Producto Borrado");
  else
    res.send("No existe el producto.");
});

module.exports = router;