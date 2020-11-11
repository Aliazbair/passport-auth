const path = require('path')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

// init app
const app = express()

// passport config
require('./config/passport')(passport)

// DB CONFIG
const db = require('./config/key').MONGOURL

// CONNECT TO DB
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('mongodb connected'))
  .catch((err) => console.log(err))

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// set static folder
app.use(express.static(path.join(__dirname, 'public')))

// bodyparser
app.use(express.urlencoded({ extended: false }))

// express session
app.use(
  session({
    secret: 'secret session',
    resave: true,
    saveUninitialized: true,
  })
)

// passport middleware
app.use(passport.initialize())
app.use(passport.session())

// connect flash
app.use(flash())

// Global Vars
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')

  next()
})

// load the routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/user'))

// set port
const PORT = process.env.PORT || 5000

// listen to port
app.listen(PORT, console.log(`server runing in port ${PORT}`))
