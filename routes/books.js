const express = require('express');

const {getAllBooks, getSingleBookById, getAllIssuedBooks, addNewBook, updateBookById,deleteBook} = require('../controllers/book-controller');

const router = express.Router();

//controllers
router.get("/", getAllBooks); 
router.get("/issued",getAllIssuedBooks);
router.get("/:id",getSingleBookById);
router.post("/",addNewBook);
router.post("/:id",updateBookById);
router.delete("/:id",deleteBook);

module.exports=router;