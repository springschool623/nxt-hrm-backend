const express = require('express')
const EmployeeRole = require('../models/EmployeeRole')
const Department = require('../models/Department')
const router = express.Router()

// API để lấy danh sách tất cả employee roles
router.get('/list', async (req, res) => {
  try {
    const employeeRoles = await EmployeeRole.find() // Lấy tất cả các vai trò nhân viên từ cơ sở dữ liệu
    res.status(200).json(employeeRoles) // Trả về danh sách các vai trò nhân viên dưới dạng JSON
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee roles', error })
  }
})

// API để xóa toàn bộ employee roles
router.delete('/deleteAll', async (req, res) => {
  try {
    await EmployeeRole.deleteMany() // Xóa toàn bộ các vai trò nhân viên
    res.status(200).json({ message: 'All employee roles have been deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete employee roles', error })
  }
})

// API để lấy roleName dựa vào department
router.get('/by-department/:department', async (req, res) => {
  try {
    const { department } = req.params
    const roles = await EmployeeRole.find({ department }).select('roleName') // Tìm các vai trò dựa vào department và chỉ chọn roleName
    if (!roles.length) {
      return res
        .status(404)
        .json({ message: 'No roles found for the specified department' })
    }
    res.status(200).json(roles) // Trả về danh sách roleName
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error fetching roles by department', error })
  }
})

module.exports = router
