const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/User') // Đường dẫn tới model User
const Employee = require('../models/Employee') // Đường dẫn tới model Employee

// API để lấy danh sách tất cả người dùng kèm thông tin nhân viên
router.get('/list', async (req, res) => {
  try {
    // Tìm tất cả người dùng
    const users = await User.find()

    // Lặp qua từng người dùng để tìm thông tin Employee tương ứng
    const usersWithEmployeeInfo = await Promise.all(
      users.map(async (user) => {
        const employee = await Employee.findOne({ employeeId: user.employeeId })
        if (employee) {
          return {
            ...user.toObject(), // Chuyển đổi User sang Object
            employeeInfo: {
              avatar: employee.avatar,
              name: employee.name,
              email: employee.email,
              role: employee.role,
              createdAt: employee.createdAt,
            },
          }
        } else {
          return {
            ...user.toObject(),
            employeeInfo: null, // Nếu không tìm thấy Employee thì đặt là null
          }
        }
      })
    )

    res.status(200).json(usersWithEmployeeInfo) // Trả về danh sách người dùng kèm thông tin nhân viên
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve users', error })
  }
})

module.exports = router

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
    return res.status(200).json({ token, userRoleType: user.userRoleType })
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
