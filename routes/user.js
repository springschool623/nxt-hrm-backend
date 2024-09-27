const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const router = express.Router()

// API để lấy danh sách tất cả người dùng
router.get('/list', async (req, res) => {
  try {
    const users = await User.find() // Tìm tất cả người dùng trong bảng User
    res.status(200).json(users)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error })
  }
})

// API đăng nhập
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    // Tìm user dựa trên email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.userRoleType },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )

    // Trả về token cho client
    return res.status(200).json({ token })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
})

// API để xóa toàn bộ người dùng
router.delete('/deleteAll', async (req, res) => {
  try {
    await User.deleteMany() // Xóa toàn bộ người dùng trong bảng User
    res.status(200).json({ message: 'All users have been deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete users', error })
  }
})

module.exports = router
