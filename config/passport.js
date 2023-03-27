
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const flash = require('express-flash')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const client = require('./mongo');
const dbName= 'w2Apps';




passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        // Find the user with the given email
        const user = await User.findOne({ email:email });
        console.log(user)
        // If the user doesn't exist, return a message
        if (!user) {
          console.log('no user created')
          return done(null, false, { message: 'Invalid email or password.' });
        }
        
        // Compare the given password with the user's hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        
        // If the password is incorrect, return a message
        if (!isMatch) {
          return done(null, false, { message: 'Invalid email or password.' });
        }
        
        // If everything is correct, return the user object
        console.log('i think it worked')
        return done(null, user);
      } catch (error) {
        console.log(error)
        done(error);
      }
    }
  )
)

//google strat below here
passport.use(new GoogleStrategy ({
  clientID:process.env.GGLCID,
  clientSecret:process.env.GGLSEC,
  callbackURL:'/auth/google/callback',
  proxy:true
},
async (accessToken, refreshToken, profile, done) => {
  const newUser = {       
    providerID: profile.id,
    provider: "google",
    email:profile.emails[0].value,
    displayName: profile.displayName,
    firstName:profile.name.givenName,
    lastName:profile.name.familyName,
    password:"",
    isAdmin:false,
   
      }
      try{
        console.log()
        let user = await User.findOne({email:profile.emails[0].value})
        if(user){
          console.log('if user true')
          done(null,user)
        }else{
          console.log('if user false')
          user = await User.create(newUser)
          done(null,user)
        }
      }catch (err){
        console.error(err)
      }
    })  
    )
    
    passport.serializeUser((user, done)=> {     
      done(null, user._id)
    })
    passport.deserializeUser(( id, done)=>{        
      User.findById(id, (err, user)=> done(err,user))    
    })
  
  
    module.exports = passport