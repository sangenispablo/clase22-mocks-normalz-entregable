const { Router } = require("express");

const router = Router();

const { productosFaker } = require("../controllers/fakerController");

router.get("/", productosFaker);

module.exports = router;
