const express = require('express');
const {userModel,bookModel} = require('../models');
const {getAllUsers,getSingleUserById,addUser, deleteUser,updateUserById,getSubscriptionDetailsById} = require("../controllers/user-controller")
const router = express.Router();

router.get("/",getAllUsers);
router.get("/subscription/:id",getSubscriptionDetailsById);
router.get("/:id",getSingleUserById);
router.post("/",addUser);
router.delete("/:id",deleteUser);
router.post("/:id",updateUserById);

module.exports=router