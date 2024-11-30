const UserController = require("../controller/users");
const express = require("express");

const router = express.Router();
const api = process.env.API_URL;

router.post(`${api}/signup`, UserController.singUp);
router.post(`${api}/login`, UserController.login);

module.exports = router;
