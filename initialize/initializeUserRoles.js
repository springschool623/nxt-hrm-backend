const UserRole = require('../models/UserRole') // Đường dẫn tới file model UserRole

const initializeRoles = async () => {
  try {
    const roles = [
      { userRoleType: 'Super Admin', roleLevel: 0 },
      { userRoleType: 'Admin', roleLevel: 1 },
      { userRoleType: 'HR', roleLevel: 2 },
      { userRoleType: 'Employee', roleLevel: 3 },
    ]

    // Lặp qua từng role và kiểm tra xem có role nào đã tồn tại chưa
    for (const role of roles) {
      const existingRole = await UserRole.findOne({
        userRoleType: role.userRoleType,
      })

      if (!existingRole) {
        // Nếu role chưa tồn tại, thêm vào với roleLevel
        await UserRole.create({
          userRoleType: role.userRoleType,
          roleLevel: role.roleLevel,
        })
      } else {
        // Cập nhật roleLevel nếu đã tồn tại nhưng roleLevel khác
        if (existingRole.roleLevel !== role.roleLevel) {
          existingRole.roleLevel = role.roleLevel
          await existingRole.save()
        }
      }
    }
  } catch (error) {
    console.error('Error initializing roles:', error)
  }
}

module.exports = initializeRoles
