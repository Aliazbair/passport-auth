const localStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const User = require('../models/User')

module.exports = function (passport) {
  passport.use(
    new localStrategy({ usernameField: 'email' }, (email, password, done) => {
      // match user
      User.findOne({ email: email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: 'That email is not registred' })
          }
          // match the password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err

            if (isMatch) {
              return done(null, user)
            } else {
              return done(null, false, { message: 'password incorrect' })
            }
          })
        })
        .catch((err) => console.log(err))
    })
  )

  // serialzeusers
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  // deserializeuser
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}
