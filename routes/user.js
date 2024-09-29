const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/User') // Đường dẫn tới model User
const Employee = require('../models/Employee') // Đường dẫn tới model Employee
const UserRole = require('../models/UserRole')

// API để lấy danh sách tất cả người dùng kèm thông tin người dùng
router.get('/list', async (req, res) => {
  try {
    // Tìm tất cả người dùng
    const users = await User.find()

    // Lặp qua từng người dùng để tìm thông tin Employee tương ứng
    const usersWithEmployeeInfo = await Promise.all(
      users.map(async (user) => {
        const employee = await Employee.findOne({
          employeeId: user.employeeId,
          status: { $ne: 'inactive' },
        })
        const userRole = await UserRole.findOne({
          userRoleType: user.userRoleType,
        })
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
            roleLevel: userRole.roleLevel,
          }
        } else {
          return {
            ...user.toObject(),
            employeeInfo: null, // Nếu không tìm thấy Employee thì đặt là null
            roleLevel: userRole.roleLevel,
          }
        }
      })
    )

    res.status(200).json(usersWithEmployeeInfo) // Trả về danh sách người dùng kèm thông tin người dùng
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

    // Tìm user dựa trên email
    const userRole = await UserRole.findOne({ userRoleType: user.userRoleType })
    if (!userRole) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Tìm employee dựa trên employeeId của user
    const employee = await Employee.findOne({ employeeId: user.employeeId })
    if (!employee) {
      return res.status(401).json({ message: 'Employee not found' })
    }

    // Kiểm tra nếu employee có status là inactive
    if (employee.status === 'inactive') {
      return res.status(403).json({ message: 'Account is inactive' })
    }

    // So sánh mật khẩu nhập vào với mật khẩu đã mã hóa
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' })
    }

    // Tạo JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        employeeId: user.employeeId,
        userRoleType: user.userRoleType,
        roleLevel: userRole.roleLevel,
        password: user.password,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1h',
      }
    )

    // Trả về token và employeeID cho client
    return res.status(200).json({
      token,
      userRoleType: user.userRoleType,
      employeeId: user.employeeId, // Thêm employeeID ở đây
      roleLevel: userRole.roleLevel,
      password: user.password,
      email: user.email,
    })
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error })
  }
})

// API để lấy thông tin người dùng theo Employee ID
router.get('/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params

    // Tìm người dùng theo Employee ID
    const user = await User.findOne({ employeeId })

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.status(200).json(user)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve user', error })
  }
})

// API để thay đổi mật khẩu
router.put('/change-password', async (req, res) => {
  const { employeeId, password } = req.body

  try {
    // Tìm user dựa trên employeeId
    const user = await User.findOne({ employeeId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    // Kiểm tra xem mật khẩu mới có giống với mật khẩu cũ không
    const isNewPasswordSameAsOld = await bcrypt.compare(password, user.password)
    if (isNewPasswordSameAsOld) {
      return res
        .status(400)
        .json({ message: 'New password must be different from old password' })
    }

    // Mã hóa mật khẩu mới
    const hashedNewPassword = await bcrypt.hash(password, 10)

    // Cập nhật mật khẩu mới trong cơ sở dữ liệu
    user.password = hashedNewPassword
    await user.save()

    res.status(200).json({ message: 'Password changed successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to change password', error })
  }
})

// API để thay đổi quyền người dùng
router.put('/set-role', async (req, res) => {
  const { employeeId, userRoleType } = req.body

  try {
    // Tìm user dựa trên employeeId
    const user = await User.findOne({ employeeId })
    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    user.userRoleType = userRoleType
    await user.save()

    res.status(200).json({ message: 'User role set successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to set user role', error })
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
