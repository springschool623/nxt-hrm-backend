const express = require('express')
const Department = require('../models/Department')
const Employee = require('../models/Employee') // Import model Employee
const router = express.Router()

// API để lấy danh sách tất cả departments và đếm số employees
router.get('/list', async (req, res) => {
  try {
    // Lấy danh sách tất cả các departments
    const departments = await Department.find()
    // Map qua từng department để đếm số lượng employees
    const departmentsWithEmployeeCount = await Promise.all(
      departments.map(async (department) => {
        // Đếm số lượng employees trong department hiện tại
        const employeeCount = await Employee.countDocuments({
          department: department.departmentName,
          status: { $ne: 'inactive' },
        })

        // Trả về thông tin department kèm số lượng employees
        return {
          ...department.toObject(), // Sử dụng _doc để lấy dữ liệu thực tế của document
          totalEmployee: employeeCount,
        }
      })
    )

    // Trả về response thành công với danh sách departments kèm số lượng employees
    res.status(200).json(departmentsWithEmployeeCount)
  } catch (error) {
    console.error('Error fetching departments:', error) // Logging lỗi nếu có
    res.status(500).json({ message: 'Error fetching departments', error })
  }
})

// API để lấy thông tin nhân viên theo Employee ID
router.get('/:departmentName', async (req, res) => {
  try {
    const { departmentName } = req.params

    // Tìm department theo Department Name
    const department = await Department.findOne({ departmentName })

    if (!department) {
      return res.status(404).json({ message: 'Department not found' })
    }

    res.status(200).json(department)
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve department', error })
  }
})

// API để thay đổi quyền người dùng
router.put('/set-manager', async (req, res) => {
  const { departmentName, manager } = req.body

  try {
    // Tìm user dựa trên employeeId
    const department = await Department.findOne({ departmentName })
    if (!department) {
      return res.status(404).json({ message: 'Department not found' })
    }

    department.manager = manager
    await department.save()

    res.status(200).json({ message: 'Manager set successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to set manager', error })
  }
})

// API để xóa toàn bộ departments
router.delete('/deleteAll', async (req, res) => {
  try {
    await Department.deleteMany() // Xóa toàn bộ departments
    res.status(200).json({ message: 'All departments have been deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete departments', error })
  }
})

module.exports = router
