const express = require('express')
const router = express.Router()
const Employee = require('../models/Employee')

// API thêm nhân viên mới
router.post('/add', async (req, res) => {
  try {
    const { name, email, employeeId, phone, joinDate, role } = req.body

    // Tạo một nhân viên mới từ dữ liệu được gửi
    const employee = new Employee({
      name,
      email,
      employeeId,
      phone,
      joinDate,
      role,
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

// API để cập nhật thông tin nhân viên dựa trên Employee ID
router.put('/update/:employeeId', async (req, res) => {
  try {
    const { employeeId } = req.params
    const updateData = req.body

    // Tìm nhân viên theo Employee ID và cập nhật
    const updatedEmployee = await Employee.findOneAndUpdate(
      { employeeId },
      updateData,
      { new: true }
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
