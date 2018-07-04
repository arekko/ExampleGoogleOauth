
const express = require('express');
const authrouters = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const passportSetup = require('./config/passport-setup');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const keys = require('./config/keys');
const passport = require('passport')
const app = express();

// Connect to mongodb
mongoose.connect(keys.mongodb.dbURI, () => console.log('connected to mongodb'));


app.use(cookieSession({
  maxAge: 24 * 60 * 60 * 1000,
  keys: [keys.session.cookieKey]
}));

// initialize passport

app.use(passport.initialize());
app.use(passport.session());



// Set view engine
app.set('view engine', 'ejs');


app.use('/auth', authrouters);
app.use('/profile', profileRoutes);



app.get('/', (req, res) => {
  res.render('home', {user: req.user})
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`app listening port ${PORT} `));