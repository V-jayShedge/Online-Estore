

module.exports=function(){

    const mongoose=require('mongoose')
    mongoose.connect('mongodb://localhost/estore',{useNewUrlParser:true,useUnifiedTopology:true})
    .then(()=>console.log('db connected'))
    .catch(err=>console.log(err))
}