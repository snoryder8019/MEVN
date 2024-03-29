const mongoose = require('mongoose');
const connectDB = async ()  => {
    try {
const conn = await mongoose.connect(
   "mongodb+srv://"+process.env.MONGOUSER+":"+encodeURIComponent(process.env.MONGOPASS)+"@cluster0.tpmae.mongodb.net/"+config.DB_NAME+"?retryWrites=true&w=majority"
   , {
    useNewUrlParser : true,
    useUnifiedTopology: true,
   
})
console.log(`mongo connected:`+ conn.connection.host)
    } catch (err){
    console.log(err)
    process.exit(1)
}
}
module.exports = connectDB;