const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/estore',{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify: false})
.then(()=>console.log('db connected'))
.catch(err=>console.log(err))


const adminSchema=mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const adminloginModel=mongoose.model('adminlogs',adminSchema)
module.exports=adminloginModel