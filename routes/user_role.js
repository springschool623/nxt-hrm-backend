const express = require('express')
const router = express.Router()
const UserRole = require('../models/UserRole') // Thêm model nếu chưa có

// API để lấy danh sách tất cả user roles
router.get('/list', async (req, res) => {
  try {
    const userRoles = await UserRole.find() // Fetch all user roles from the database
    res.status(200).json(userRoles) // Send the user roles as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user roles', error })
  }
})

module.exports = router
