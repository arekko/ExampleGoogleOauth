
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const keys = require('../config/keys');
const mongoose = require('mongoose');
const User = require('../models/user-model');


passport.serializeUser((user, done) => {
  done(null, user.id) // mongo record _id
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user)
  })

});


passport.use(
  new GoogleStrategy({
  //options for the strategy
    clientID: keys.google.clientID,
    clientSecret: keys.google.clientSecret,
    callbackURL: '/auth/google/redirect'

  }, (accessToken, refreshToken, profile, done) => {
    //passport callback function
    // console.log(`acessToken ${accessToken}`);
    // console.log(`refreshToken ${refreshToken}`);
    // Check if user already exsist in our db
    User.findOne({googleid: profile.id})
      .then(currentUser => {
        if(!currentUser) {      //if record not found it return null
          new User({
            googleid: profile.id,
            username: profile.displayName
          }).save().then((newUser) => {
            done(null, newUser)
          });
        } else {
          done(null, currentUser)
        }
      })




    // done(null, profile)
  })
);

//TODO: make the same things with facebook and twitter