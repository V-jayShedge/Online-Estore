const router=require('express').Router()
const products=require('../models/productModel')

router.get('/addtocart/:pname',(req,res)=>{ 
    const pname=req.params.pname
   products.findOne({pname:pname},(err,doc)=>{
    
       if(err){
        console.log(err)
       } 
           if(typeof req.session.cart =="undefined"){
               req.session.cart=[];
               req.session.cart.push({
                   pname:doc.pname,
                   qty:1,
                   price:doc.price,
                   image:'/img/' + doc.image
               })
           }
           else{
               var cart=req.session.cart
               var newItem=true 
            for(var i=0; i < cart.length;i++){

                if(cart[i].pname == pname){
                    cart[i].qty++
                    newItem=false
                    break;
                }
            }
                if(newItem){
                    cart.push({
                        pname:doc.pname,
                        qty:1,
                        price:doc.price,
                        image:'/img/' + doc.image
                    })
                }
           }
       
           res.redirect('/')
      
   })
})


//get checkout page
router.get('/checkout',(req,res)=>{
  if(req.session.cart && req.session.cart.length == 0){
      delete req.session.cart
      req.flash('error_msg','Add products to check out')
    res.redirect('/cart/checkout')
  }else{
      res.render('checkout',{cart:req.session.cart}) 
  }

})

//get update cart
router.get('/update/:product',(req,res)=>{
    var p=req.params.product
   //console.log(p)
    var cart=req.session.cart
    var action=req.query.action

    for(var i=0;i<cart.length;i++){
        if(cart[i].pname==p){
            switch(action){
                case 'add':
                cart[i].qty++
                break;

                case 'remove':
                cart[i].qty--
                if(cart[i].qty < 1) cart.splice(i,1)
                break;

                case 'clear':
                cart.splice(i,1)
                if(cart.length == 0) delete req.session.cart
                break;

                default:
                    console.log('problem in updating cart')
                    break;
            }
            break;
        }
    }
    req.flash('success_msg','product updated successfully')
    res.redirect('/cart/checkout')
})

 

router.get('/clearcart',(req,res)=>{
    delete req.session.cart
    req.flash('success_msg','Your cart is cleared')
    res.redirect('/cart/checkout')
})

router.get('/buynow',(req,res)=>{
  
  res.send('hdsdsjdhjsh')
})






module.exports=router