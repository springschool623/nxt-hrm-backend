const express = require('express')
const router = express.Router()
const Employee = require('../models/Employee')

// API thêm nhân viên mới
router.post('/add', async (req, res) => {
  try {
    const { name, email, phone, joinDate, role, avatar, socialLinks } = req.body

    // Lấy employeeId lớn nhất hiện tại
    const lastEmployee = await Employee.findOne().sort({ employeeId: -1 })

    // Tạo employeeId mới theo định dạng EMPXXXX
    let newEmployeeId = 'EMP0001' // Giá trị mặc định nếu không có nhân viên nào

    if (lastEmployee && lastEmployee.employeeId) {
      // Lấy phần số từ employeeId cuối cùng và tăng nó lên
      const lastIdNum =
        parseInt(lastEmployee.employeeId.replace('EMP', '')) || 0
      const newIdNum = lastIdNum + 1
      newEmployeeId = `EMP${newIdNum.toString().padStart(4, '0')}` // Đảm bảo có 4 chữ số
    }

    // Tạo một nhân viên mới từ dữ liệu được gửi
    const employee = new Employee({
      name,
      email,
      employeeId: newEmployeeId, // Dùng employeeId tự động sinh ra
      phone,
      joinDate,
      role,
      avatar, // Thêm avatar
      socialLinks, // Thêm các đường dẫn mạng xã hội
    })

    // Lưu vào MongoDB
    await employee.save()
    res.status(200).json({ message: 'Employee added successfully', employee })
  } catch (error) {
    res.status(500).json({ message: 'Failed to add employee', error })
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
