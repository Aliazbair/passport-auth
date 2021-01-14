const router = require('express').Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

const User = require('../models/User')

router.get('/login', (req, res) => {
  res.render('login')
})
router.get('/register', (req, res) => {
  res.render('register')
})

// Register handle
router.post('/register', async (req, res) => {
  // get the fields
  const { name, email, password, password2 } = req.body

  // chech the errors
  let errors = []

  // check the require fields
  if (!name || !email || !password || !password2) {
    errors.push({ message: 'please fill in all fields' })
  }

  // check the password is match
  if (password !== password2) {
    errors.push({ message: 'password do not match' })
  }

  // check pass lenght
  if (password.lenght < 6) {
    errors.push({ message: 'password should be at least 6 character' })
  }

  // check the errros
  if (errors.length > 0) {
    // render the register form and pass errors and data
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    })
  } else {
    // validation passed
    const user = await User.findOne({ email: email })
    if (user) {
      // user exists
      errors.push({ message: 'Email is aleady registred' })
      res.render('register', {
        errors,
        name,
        email,
        password,
        password2,
      })
    } else {
      // create the new user
      const newUser = new User({
        name,
        email,
        password,
      })

      // Hash password
      byrtpt.genSalt(10, (err, salt) =>
      bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err
          // set password to hashed
          newUser.password = hash
          // save user in db
          newUser.save()
          req.flash('success_msg', 'You are now regisetred and can log in')
          res.redirect('/users/login')
        })
      )
    }
  }
})

//  login handle
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashbord',
    failureRedirect: '/users/login',
    failureFlash: true,
  })(req, res, next)
})

// handel logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You are logged out')
  res.redirect('/users/login')
})

module.exports = router
