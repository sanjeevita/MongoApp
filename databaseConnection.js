const mongoose = require('mongoose')

function DbConnection(){
    const DB_URL = process.env.MONGO_URL;

    mongoose.connect(DB_URL);
    const db = mongoose.connection; //provides an object that represents the connections and provides methods to listen for connection events

    db.on("error",console.log.bind(console,"Connection Error!"))
    db.once("open",function(){
        console.log("DB Connected!");
    })
}

module.exports=DbConnection;