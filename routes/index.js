const express=require('express')
const router=express.Router()
const productModel=require('../models/productModel')

router.get('/',(req,res)=>{
 productModel.find({})
 .then(data=>{

    var productchunks=[]
    var chunksize=3
    for(var i=0;i<data.length;i+=chunksize)
    {
        productchunks.push(data.slice(i,i+chunksize))
    }
    res.render('index',{products:productchunks}) 
 })
 .catch(err=>console.log(err))
  
})


module.exports=router