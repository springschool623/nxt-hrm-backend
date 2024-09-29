const Department = require('../models/Department')

const initializeDepartments = async () => {
  try {
    const departments = [
      'Marketing',
      'Accounts',
      'App Development',
      'Web Development',
      'Support',
    ]

    // Lặp qua từng role và kiểm tra xem có role nào đã tồn tại chưa
    for (const department of departments) {
      const existingDepartment = await Department.findOne({
        departmentName: department,
      })

      if (!existingDepartment) {
        // Nếu role chưa tồn tại, thêm vào
        await Department.create({ departmentName: department })
      } else {
      }
    }
  } catch (error) {
    console.error('Error initializing departments:', error)
  }
}

module.exports = initializeDepartments
