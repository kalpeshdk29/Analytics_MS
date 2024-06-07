const mongoose = require("mongoose");

const connectDB = async ()=>{
try{
const connect = await mongoose.connect(process.env.DATABASE_URL)
console.log("Analytics DataBase is connected: ", connect.connection.host, connect.connection.name);
}
catch(err){
    console.log(err);
}
};

module.exports = connectDB;