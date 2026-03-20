const express = require("express");
const router = express.Router();
const UsersCtrl = require("./controllers");

router.get("/", UsersCtrl.getUsers);
router.post("/", UsersCtrl.createUser);

module.exports = router;