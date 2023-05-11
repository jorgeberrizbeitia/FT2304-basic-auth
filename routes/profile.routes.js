const express = require('express');
const router = express.Router();

const { isLoggedIn, isAdmin } = require("../middlewares/auth.middlewares.js")

// ... aqui van rutas completamente privadas. solo accesibles a usuarios registrados
router.get("/", isLoggedIn, (req, res, next) => {

  console.log("quien me hace la llamada", req.session.user)

  res.render("profile/dashboard.hbs")
})

router.get("/admin", isLoggedIn, isAdmin, (req, res, next) => {
  console.log(req.session.user)
  res.render("profile/admin-dashboard.hbs")
})

router.get("/patata", isLoggedIn, (req, res, next) => {
  // ruta de prueba para ramas

  console.log(res.locals)
  console.log("patata sin guardar")
})


module.exports = router;