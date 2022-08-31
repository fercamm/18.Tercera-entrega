const express = require("express");
const { carritosDao } = require('./dao/daos.js');
const twilio = require('twilio')
const nodemailer = require('nodemailer');
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
require('dotenv').config({ path: appDir + '/.env' })
const logger = require('../logger');


const { Router } = express;

let router = new Router();

router.post("/carrito", async (req, res) => {//crear carrito
  const carrito = await carritosDao.crearCarrito(req)
  res.json(carrito);
  res.status(200).end();
});

router.delete("/carrito/:id_carrito", (req, res) => { //borrar carrito
  const index = carritosDao.borrarCarrito(req);
  if (index == null) {
    return res.status(404).json({ msg: "Carrito no encontrado" });
  }
  res.status(200).end();
});

router.get("/carrito/:id_carrito/productos", async (req, res) => {//lista los productos del carrito
  const carrito = await carritosDao.getCarrito(req, res)
  if (carrito == null) {
    return res.send("No existe el carrito")
  }
  res.json(carrito);
});

router.get("/lista_carrito/:id_carrito", async (req, res) => {//lista los productos del carrito en hbs
  const carrito = await carritosDao.getCarrito(req, res)
  let tieneDatos;
  const productos = JSON.parse(carrito.productos)
  if (productos.length > 0) {
    tieneDatos = true
  } else {
    tieneDatos = false
  }
  res.render('carts', { carrito: carrito, productos: productos, listExists: tieneDatos });
});

router.get("/finalizar_compra/:id_carrito", async (req, res) => { //boton manda email, wsp, sms
  const carrito = await carritosDao.getCarrito(req, res)
  let tieneDatos;
  const productos = JSON.parse(carrito.productos)
  if (productos.length > 0) {
    tieneDatos = true
  } else {
    tieneDatos = false
  }

  //WSP

  const accountSid = 'AC14764d5cd5e57cf1354d44f8d9fd77d0'
  const authToken = 'f908c3af9ccc133e47482993b827fba5'

  let contenido = 'Has finalizado la compra. Tu lista de productos: \r\n'
  productos.forEach((producto) => {
    contenido += producto.name + ' $' + producto.price + ' ' + '\r\n'
  });

  const client = twilio(accountSid, authToken)
  try {
    const message = await client.messages.create({
      body: contenido,
      from: 'whatsapp:+14155238886',
      to: 'whatsapp:+5491134047670'
    })
    // console.log(message)
    logger.info(message);
  } catch (error) {
    // console.log(error)
    logger.error(error);
  };

  // SMS

  const accountSidsms = 'AC3b31e13c3b94f9ac09e61fea944c5e64'
  const authTokensms = '84d06738dcd9a84fd2ecd629c5de88b4'

  let content = 'Has finalizado la compra. Tu lista de productos: \r\n'
  productos.forEach((producto) => {
    content += producto.name + ' $' + producto.price + ' ' + '\r\n'
  });

  const cliente = twilio(accountSidsms, authTokensms)

  try {
    const message = await cliente.messages.create({
      body: content,
      from: '+19513570609',
      to: '+541137839891'
    })
    // console.log(message)
    logger.info(message);
  } catch (error) {
    // console.log(error)
    logger.error(error);
  }
  //GMAIL
  const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
      user: 'nico.alejandro20@gmail.com',
      pass: 'elfsrazyfzdpsfin'
    }
  });

  let contents = 'Has finalizado la compra. Tu lista de productos: \r\n'
  productos.forEach((producto) => {
    contents += producto.name + ' $' + producto.price + ' ' + '\r\n'
  });

  transport.sendMail({
    from: 'Nico <nico.alejandro20@gmail.com>',
    to: 'nico.alejandro20@gmail.com',
    html: contents,
    subject: 'Lista de productos comprados',
  }).then((result) => {
    // console.log(result);
    logger.info(result);
  }).catch(e => {
    logger.error(e)
});
});

router.post("/carrito/:id_carrito/productos/:id_producto", async (req, res) => {//agrega productos al carrito
  const carrito = await carritosDao.nuevoProducto(req);
  if (carrito) {
    res.json(carrito);
  } else {
    res.json('No se pudo agregar el producto al carrito');
  }
});

router.delete("/carrito/:id_carrito/productos/:id_producto", async (req, res) => { //borrar un producto del carrito por su id de carrito y de producto
  const index = await carritosDao.borrarProducto(req);
  if (index == null) {
    return res.status(404).json({ msg: "Carrito no encontrado" });
  }
  res.status(200).end();
});

module.exports = router;