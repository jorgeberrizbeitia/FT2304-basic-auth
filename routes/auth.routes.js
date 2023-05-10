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
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs")
})

// POST "/auth/login" => Recibir las credenciales del usuario y validar su identidad (autenticación)
router.post("/login", async (req, res, next) => {
  console.log(req.body)

  // OPCIONALMENTE podemos hacer destructuración del req.body

  // validacion que todos los campos esten llenos
  if (req.body.email === "" || req.body.password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Los campos de email y contraseña son obligatorios",
    })
    return // cuando esto ocurra, deten la ejecución de la ruta (funcion) 
  }

  try {
    // validar que el usuario existe en la base de datos
    const foundUser = await User.findOne({email: req.body.email})
    if (foundUser === null) {
      res.render("auth/login.hbs", {
        errorMessage: "Usuario no registrado con ese correo",
      })
      return // cuando esto ocurra, deten la ejecución de la ruta (funcion) 
    }
    console.log(foundUser)
    
  
    // validar que la contraseña sea la correcta
    const isPasswordCorrect = await bcrypt.compare(req.body.password, foundUser.password)
    console.log(isPasswordCorrect)
    if (isPasswordCorrect === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Contraseña no valida",
        // email: req.body.email // ejemplo de pasar los datos que ya habia escrito el usuario
      })
      return // cuando esto ocurra, deten la ejecución de la ruta (funcion) 
    }

    // a a partir de este punto ya hemos autenticado al usuario
    // 1. crear una sesion activa del usuario
    // 2. constantemente verificar en las rutas privadas que el usuario tenga dicha sesion activa
    // todo crea la sesión

    req.session.user = foundUser; // se crea la sesión
    // A partir de este momento tendremos acceso a req.session.user para saber quien está haciendo las llamadas al servidor

    req.session.save(() => {
      // Despues de que la sesión se crea correctamente, entonces redirije a una pagina privada
      res.redirect("/profile")
    })

    
  } catch (error) {
    next(error)
  }
})

// GET "/auth/logout" => Cerrar (Destruir) la sesión activa
router.get("/logout", (req, res, next) => {

  // esta linea borra la sesión activa del usuario
  req.session.destroy(() => {

    // que ocurre luego de borrar la sesión
    res.redirect("/")

  })

})

module.exports = router;