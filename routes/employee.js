const express = require('express')
const router = express.Router()
const Employee = require('../models/Employee') // Adjust the path as necessary
const User = require('../models/User') // Adjust the path as necessary
const bcrypt = require('bcrypt') // For password hashing
const UserRole = require('../models/UserRole') // Điều chỉnh đường dẫn nếu cần

// Utility function to generate a random password
function generateRandomPassword(length = 8) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?'
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    password += chars[randomIndex]
  }
  return password
}

// API để thêm nhân viên mới
router.post('/add', async (req, res) => {
  try {
    const { name, email, phone, joinDate, role, avatar } = req.body

    // Kiểm tra xem email đã tồn tại trong bảng User hay chưa
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'Email đã được sử dụng bởi một người dùng khác.' })
    }

    // Lấy employeeId lớn nhất hiện tại
    const lastEmployee = await Employee.findOne().sort({ employeeId: -1 })

    // Tạo employeeId mới theo định dạng EMPXXXX
    let newEmployeeId = 'EMP0001' // Giá trị mặc định nếu không có nhân viên nào

    if (lastEmployee && lastEmployee.employeeId) {
      const lastIdNum =
        parseInt(lastEmployee.employeeId.replace('EMP', '')) || 0
      const newIdNum = lastIdNum + 1
      newEmployeeId = `EMP${newIdNum.toString().padStart(4, '0')}` // Đảm bảo có 4 chữ số
    }

    // Tạo một nhân viên mới từ dữ liệu được gửi
    const employee = new Employee({
      name,
      email,
      employeeId: newEmployeeId,
      phone,
      joinDate,
      role,
      avatar,
    })

    // Lưu nhân viên vào cơ sở dữ liệu
    await employee.save()

    // Tạo mật khẩu ngẫu nhiên
    const plainPassword = generateRandomPassword(8)

    // Hiển thị mật khẩu trước khi băm
    console.log('Generated password before hashing:', plainPassword)

    // Băm mật khẩu trước khi lưu
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(plainPassword, saltRounds)

    // Lấy vai trò Employee từ bảng UserRole
    const employeeRole = await UserRole.findOne({ userRoleType: 'Employee' })
    if (!employeeRole) {
      return res.status(500).json({
        message: 'Không tìm thấy vai trò Employee trong bảng UserRole.',
      })
    }

    // Tạo một tài khoản người dùng mới cho nhân viên
    const user = new User({
      employeeId: newEmployeeId,
      email,
      password: hashedPassword,
      userRoleType: employeeRole._id, // Sử dụng ObjectId đã lấy
    })

    // Lưu tài khoản người dùng vào cơ sở dữ liệu
    await user.save()

    res.status(200).json({
      message: 'Nhân viên và tài khoản người dùng đã được thêm thành công',
      employee,
    })
  } catch (error) {
    console.error('Lỗi khi thêm nhân viên và tài khoản người dùng:', error)
    res.status(500).json({
      message: 'Thêm nhân viên và tài khoản thất bại',
      error: error.message,
    })
  }
})

// API để lấy danh sách tất cả nhân viên
router.get('/list', async (req, res) => {
  try {
    const employees = await Employee.find()
    res.status(200).json(employees)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve employees', error })
  }
})

// API để lấy thông tin nhân viên theo Employee ID
router.get('/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params

    // Tìm nhân viên theo Employee ID
    const employee = await Employee.findOne({ employeeId })

    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    res.status(200).json(employee)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve employee', error })
  }
})

// API để cập nhật thông tin nhân viên dựa trên Employee ID
router.put('/update/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params
    const updateData = req.body

    // Tìm nhân viên theo Employee ID và cập nhật
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId },
      updateData,
      { new: true } // Trả về dữ liệu mới sau khi cập nhật
    )

    if (!updatedEmployee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    res
      .status(200)
      .json({ message: 'Employee updated successfully', updatedEmployee })
  } catch (error) {
    res.status(500).json({ message: 'Failed to update employee', error })
  }
})

// API để xóa nhân viên dựa trên Employee ID
router.delete('/delete/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params

    // Xóa nhân viên theo Employee ID
    const deletedEmployee = await Employee.findOneAndDelete({ employeeId })

    if (!deletedEmployee) {
      return res.status(404).json({ message: 'Employee not found' })
    }

    res
      .status(200)
      .json({ message: 'Employee deleted successfully', deletedEmployee })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee', error })
  }
})

module.exports = router
