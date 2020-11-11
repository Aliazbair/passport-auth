const { authUser } = require('../config/auth')
const router = require('express').Router()

router.get('/', (req, res) => {
  res.render('welcome')
})
router.get('/dashbord', authUser, (req, res) => {
  res.render('dashbord', {
    user: req.user,
  })
})
router.get('/profile/:id', authUser, (req, res) => {
  res.render('profile', {
    user: req.user,
  })
})
router.post('/profile/:id',authUser, (req, res) => {
  const id = req.params.id
  res.redirect('/dashbord')
})

module.exports = router
