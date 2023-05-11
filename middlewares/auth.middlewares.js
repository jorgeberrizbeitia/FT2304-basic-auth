function isLoggedIn(req, res, next) {
  // middleware para proteger rutas privadas
  // solo se ejecuta en rutas que queremos que sean privadas

  if (req.session.user === undefined) {
    // el usuario no tiene sesión activa
    res.redirect("/")
  } else {
    next() // continua con la ruta
  }
}

function updateLocals(req, res, next) {
  // Esta funcion crea una variable accesible en HBS para visualizar enlaces dependiendo de si el usuario está activo o no
  // SE ejecuta en TODAS las llamadas

  // res.locals.patata = "probando una nueva variable local"

  // deberiamos crear una variable local booleano
  if (req.session.user === undefined) {
    res.locals.isUserActive = false
  } else {
    res.locals.isUserActive = true
  }
  // en caso de tener diferentes roles y enlaces de roles, el condicional arriba tendria que incluir variables locales para mostrar/ocultar esos enlaces

  next() // haz la ejecución anterior y continua con la ruta

}

function isAdmin(req, res, next) {

  if (req.session.user.role === "admin") {
    next() // continua con la ruta
  } else {
    res.redirect("/") // no tienes acceso
  }

}

// SOLO PODEMOS EXPORTAR UN ELEMENTO

module.exports = {
  isLoggedIn: isLoggedIn,
  updateLocals: updateLocals,
  isAdmin: isAdmin
}
