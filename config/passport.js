const localStrategy=require('passport-local').Strategy
const mongoose=require('mongoose')
const adminloginModel=require('../models/adminModel')

module.exports=
    function(passport){
        passport.use(
            new localStrategy({usernameField:'email'},(email,password,done)=>{
                //match user 
                adminloginModel.findOne({email:email})
                .then(user=>{
                    if(!user){
                        return done(null,false,{message:'Email does not exist'})
                    }
                    else if(user.password !== password){
                        return done(null,false,{message:'password not match'})
                    }
                    else{
                        return done(null,user)
                    }
                }
               
                )
            })
        )
        passport.serializeUser(function(user, done) {
            done(null, user.id);
          });
        
          passport.deserializeUser(function(id, done) {
            adminloginModel.findById(id, function(err, user) {
              done(err, user);
            });
          });
    }
