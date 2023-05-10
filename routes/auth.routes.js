const express = require('express');
const router = express.Router();

const User = require("../models/User.model.js")
const bcrypt = require("bcryptjs")
// ... aqui nuestras rutas de auth


// GET "/auth/signup" => Renderizar un formulario de registro
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs")
})


// POST "/auth/signup" => Recibir la info del usuario y crearlo en la BD
router.post("/signup", async (req, res, next) => {
  console.log(req.body)

  // OPCIONALMENTE podemos destructurar los valores de los campos
  const { username, email, password } = req.body

  // Validaciónes de Servidor (Backend)

  // Que todos los campos tengan informacion (correo y contraseña)
  if (email === "" || password === "") {
    console.log("el email o la contraseña estan vacios")
    res.render("auth/signup.hbs", {
      errorMessage: "Los campos de email y contraseña son obligatorios",
      // previousData: req.body // ejemplo de enviar los valores anteriores luego del error
    })
    return // cuando esto ocurra, deten la ejecución de la ruta (funcion) 
  }

  // validación de contraseña
  const regexPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
  if (regexPattern.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage: "La contraseña no es suficientemente fuerte. Necesita al menos, una mayuscula, una minuscula, un caracter especial y minimo 8 caracteres.",
    })
    return // cuando esto ocurra, deten la ejecución de la ruta (funcion) 
  }

  try {
    // que no existan usuarios con el mismo correo electronico
    const foundUser = await User.findOne({ email: email })
    // si consigue el usuario. foundUser será el usuario
    // si no lo consigue el usuario. foundUser será null
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Ya existe un usuario con ese correo electronico",
      })
      return // cuando esto ocurra, deten la ejecución de la ruta (funcion) 
    } // todo probar la ruta cuando tengamos usuarios en la BD

    // vamos a encriptar la contraseña
    const salt = await bcrypt.genSalt(12)
    const hashPassword = await bcrypt.hash(password, salt)
    console.log(hashPassword)

    // ya todo bien! vamos a crear el usuario en la BD
    await User.create({
      username: username,
      email: email,
      password: hashPassword
    })

    // TEST (si todo sale bien)
    res.redirect("/auth/login")

  } catch (error) {
    next(error)
  }
})


// GET "/auth/login" => Renderizar el formulario de acceso a la pagina


// POST "/auth/login" => Recibir las credenciales del usuario y validar su identidad (autenticación)


module.exports = router;