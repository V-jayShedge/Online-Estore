const express=require('express')
const expressEjsLayout=require('express-ejs-layouts')
const bodyParser=require('body-parser')
const flash=require('connect-flash')
const session=require('express-session')
const passport=require('passport')
const {ensureAuthenticate}=require('./config/authentication')
const app=express()



//passport authentication
require('./config/passport')(passport)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//view engine setup
app.set('view engine','ejs')
app.use(expressEjsLayout)
app.use(express.static('public'))



//session
app.use(session({
    secret:'bigsecret',
    resave:true,
    saveUninitialized:true
}))


app.use(passport.initialize())
app.use(passport.session())
app.use(flash())


//global variables
app.get('*',(req,res,next)=>{
    res.locals.cart=req.session.cart
    next()
})
//global vars
app.use((req,res,next)=>{
    res.locals.success_msg=req.flash('success_msg')
    res.locals.error_msg=req.flash('error_msg')
    res.locals.error=req.flash('error')
    next()
})

//Userviews Routes
const cart=require('./routes/cart')
const indexRoute=require('./routes/index')


//Adminviews Routes
const adminloginRoute=require('./routes/Admin/adminlogin')


//set routes
app.use('/',indexRoute)
app.use('/cart',cart)
app.use('/Adminlog',adminloginRoute)

const PORT=process.env.PORT || 3000

app.listen(PORT,()=>console.log(`server running on port ${PORT}`))