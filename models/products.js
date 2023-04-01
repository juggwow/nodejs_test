const mongoose = require('mongoose')

let url = "mongodb+srv://pattana:dak19nad@cluster0.bjmgs.mongodb.net/test";


//เชื่อมต่อ
mongoose.connect(url,{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).catch(err=>console.log(err))

//ออกแบบ schema
let productSchema = mongoose.Schema({
    name:String,
    price:Number,
    image:String,
    description:String
})

//สร้าง model
let Product = mongoose.model("product",productSchema)

module.exports = Product
// module.exports.saveProduct = function(model,document){
//     model.save(document)
// }