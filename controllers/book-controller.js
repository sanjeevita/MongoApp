const {bookModel,userModel} = require('../models');
const issuedBook = require('../dto/book-dto');

exports.getAllBooks = async(req,res) =>{
    const books = await bookModel.find();
    if(books.length===0){
        return res.status(404).json({
            success:false,
            MessageChannel:"No books found"
        })
     }

     return res.status(200).json({ 
        success:true,
        data:books
    })  
}

exports.getSingleBookById = async (req,res) => {
    //const book = books.find((book) => book.id === req.params.id);
    const {id}=req.params;
    const book = await bookModel.findById(id);
    if (!book)
        return res
        .status(404)
        .send({ success: false, message: "book does not exist" });
    return res.status(200).send({ success: true, data: book });
}

exports.getAllIssuedBooks = async (req,res)=>{

    const users = await userModel.find({
        issuedBook : {$exists : true}
    }).populate("issuedBook");

    const issuedBooks = users.map((each)=>new issuedBook(each));


    if(issuedBooks.length === 0){
        return res.status(404).json({success: false, message: "No books issued yet."});
    }
    
    return res.status(200).json({success: true, data: issuedBooks})
}

exports.addNewBook = async (req,res)=>{
    const {data} = req.body;

    if(!data){
        return res.status(400).json({
            success:false,
            message: "no data provided for book"
        });
    }
    // const existingBook = await bookModel.findOne({ name: data.name, author: data.author });
    // if (existingBook) {
    //     return res.status(400).json({
    //         success: false,
    //         message: "Book with the same name and author already exists"
    //     });
    // }

    await bookModel.create(data);

    const allBooks = await bookModel.find();
    return res.status(200).json({
        success:true,
        data: allBooks
    });

    
}

// exports.updateBookById = async(req,res)=>{
//     const {id}=req.params;
//     const {data}=req.body;

//     if(!data){
//         return res.status(400).json({
//             success:false,
//             message: "no data provided for book"
//         });
//     }

//     const updatedBook = await bookModel.findOneAndUpdate({_id: id},{ $set: data },{new: true})

//     return res.status(200).json({
//         success:true,
//         data: updatedBook
//     })
// }

exports.updateBookById = async  (req, res)=>{
    const {id} = req.params;
    const {data} = req.body;

    if(!data){
        return res.status(400).json({
            success:false,
            message: "no data provided for book"
        });
    }
    const updatedBook = await bookModel.findOneAndUpdate({
        _id: id,
    },
         data,
         {
        new: true,
    })

    return res.status(200).json({
        success: true,
        data: updatedBook
    })
}

exports.deleteBook = async(req,res)=>{
    const {id}=req.params;
    const book = await bookModel.deleteOne({
        _id:id,
    })
    if(!book){
        return res.status(404).json({
            success:false,
            message:"book not found"
        })
    }
    return res.status(200).json({
        success:true,
        message:"book has been deleted"
    })
}

//module.exports = {getAllBooks,getSingleBookById}