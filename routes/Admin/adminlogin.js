const router=require('express').Router()
const passport=require('passport')
const adminloginmodel=require('../../models/adminModel')
const productModel=require('../../models/productModel')
const { check, validationResult } = require('express-validator');
const {ensureAuthenticate}=require('../../config/authentication')
const fs=require('fs')

const multer=require('multer')


const Storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/img')
    },
    filename:function(req,file,cb){
        cb(null, new Date().getTime().toString()+ "_" + file.originalname) 
    }
})

const upload=multer({storage:Storage})





//get Adminlogin
router.get('/',(req,res)=>{
    res.render('./Admin_views/adminlogin')
})


//post Adminlogin
router.post('/',(req,res,next)=>{
    passport.authenticate('local',{
        successRedirect:'/Adminlog/dashboard',
        failureRedirect:'/Adminlog', 
        failureFlash:true,
    }
    )(req,res,next)
   
   })
//Add products

router.get('/addproducts',ensureAuthenticate,(req,res)=>{
    res.render('./Admin_views/add_product')
})

router.post('/addproducts',ensureAuthenticate,upload.single('img'),
(req,res)=>{

    const {productname,description,price}=req.body
    const img=req.file.filename

if(!productname || !description || !price || !img )
{
    console.log('enter all fielld')

}


  else{
      const products=new productModel({
            pname:productname,
            description:description,
            image:img,
            price:price
        })
       products.save()
       .then((data)=>{
          
           if(data==null){
               console.log('data empty')
           }        
          
       })
       .catch(err=>console.log(err)) 
    
  }
        res.render('./Admin_views/add_product',{success_msg:'added successfully'})    
    
   
})





//VIEW PRODUCTS
router.get('/viewproducts',ensureAuthenticate,(req,res)=>{
  productModel.find()
  .then((data)=>{
 res.render('./Admin_views/view_products',{products:data})
      
  })
   
})

router.get('/edit/:id',(req,res)=>{
    const id=req.params.id
    productModel.findById({_id:id})
    .then(data=>{
        res.render('./Admin_views/editproduct',{
          records:data
        })
    })
   
})
router.post('/update/',upload.single('img'),(req,res)=>{
    const id=req.body.id
    const {productname,description,price}=req.body
  
        const update=productModel.findByIdAndUpdate({_id:id},{
            pname:productname,
            description:description,
            price:price,
        })
        if(req.file){
            const img=req.file.filename
            update.image=img
            console.log(img)
        }
        update.save()
        .then(data=>{
            
        })
    

    
    
   
})

//deleting products

router.get('/delete/:id',(req,res)=>{

    const id=req.params.id
    productModel.findByIdAndDelete({_id:id})
    .then(data=>{
       
        try {
            fs.unlinkSync( 'public/img/'+data.image);
            res.redirect('/Adminlog/viewproducts')
          } catch (err) {
            // handle the error
            console.log(err)
            res.redirect('/adminlog/dashboard')
          }
    }).catch(err=>console.log(err))
  
   
            
})



router.get('/logout',ensureAuthenticate,(req,res)=>{
        req.logout()
        req.flash('success_msg','You have logout successfully')
        res.redirect('/adminlog')
})

router.get('/dashboard',ensureAuthenticate,(req,res)=>{
    res.render('./Admin_views/dashboard')
})
module.exports=router