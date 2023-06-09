const express = require('express');
const router = express.Router();

const { updateLocals } = require("../middlewares/auth.middlewares.js")

// quiero que en TODAS la rutas se actualice la variable local isUserActive
router.use(updateLocals)

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

const authRouter = require("./auth.routes.js")
router.use("/auth", authRouter)

const profileRouter = require("./profile.routes.js")
router.use("/profile", profileRouter)

module.exports = router;
