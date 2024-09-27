const UserRole = require('../models/UserRole') // Đường dẫn tới file model UserRole

const initializeRoles = async () => {
  try {
    const roles = ['Super Admin', 'Admin', 'HR', 'Employee']

    // Lặp qua từng role và kiểm tra xem có role nào đã tồn tại chưa
    for (const role of roles) {
      const existingRole = await UserRole.findOne({ userRoleType: role })

      if (!existingRole) {
        // Nếu role chưa tồn tại, thêm vào
        await UserRole.create({ userRoleType: role })
      } else {
      }
    }
  } catch (error) {
    console.error('Error initializing roles:', error)
  }
}

module.exports = initializeRoles
