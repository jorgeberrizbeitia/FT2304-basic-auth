const express = require('express');
const router = express.Router();

// ... aqui nuestras rutas de auth

// GET "/auth/signup" => Renderizar un formulario de registro
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs")
})


// POST "/auth/signup" => Recibir la info del usuario y crearlo en la BD
router.post("/signup", (req, res, next) => {
  console.log(req.body)


  // TEST (si todo sale bien)
  res.redirect("/")

})


// GET "/auth/login" => Renderizar el formulario de acceso a la pagina


// POST "/auth/login" => Recibir las credenciales del usuario y validar su identidad (autenticación)


module.exports = router;