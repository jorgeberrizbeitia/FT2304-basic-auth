const express = require('express');
const router = express.Router();

// ... aqui van rutas completamente privadas. solo accesibles a usuarios registrados
router.get("/", (req, res, next) => {
  res.render("profile/dashboard.hbs")
})


module.exports = router;