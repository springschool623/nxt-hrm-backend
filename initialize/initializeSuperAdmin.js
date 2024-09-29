const User = require('../models/User') // Đường dẫn tới file model User
const UserRole = require('../models/UserRole') // Đường dẫn tới file model UserRole
const Employee = require('../models/Employee') // Đường dẫn tới file model UserRole
const bcrypt = require('bcrypt')

// Function to create a Super Admin account
const createSuperAdmin = async () => {
  try {
    const superAdminEmail = 'abc@gmail.com'

    // Kiểm tra xem tài khoản Super Admin đã tồn tại chưa
    const existingSuperAdmin = await User.findOne({ email: superAdminEmail })

    if (!existingSuperAdmin) {
      // Tìm hoặc tạo vai trò Super Admin trong bảng UserRole
      let superAdminRole = await UserRole.findOne({
        userRoleType: 'Super Admin',
      })
      if (!superAdminRole) {
        superAdminRole = new UserRole({ userRoleType: 'Super Admin' })
        await superAdminRole.save()
      }

      // Tạo mật khẩu ngẫu nhiên
      const plainPassword = generateRandomPassword(12)
      const hashedPassword = await bcrypt.hash(plainPassword, 10)

      // Tạo tài khoản Super Admin
      const superAdmin = new User({
        employeeId: 'SUPERADMIN0001', // Mã đặc biệt cho Super Admin
        email: superAdminEmail,
        password: hashedPassword,
        userRoleType: 'Super Admin', // Gán vai trò Super Admin
      })

      // Tạo tài khoản Super Admin
      const superAdminInfo = new Employee({
        name: 'Nguyen Xuan Truong',
        email: superAdminEmail,
        employeeId: 'SUPERADMIN0001',
        phone: '02881129211',
        joinDate: Date.now(),
        role: 'CEO',
        department: '',
        avatar: '',
        status: 'active',
      })

      // Lưu tài khoản Super Admin vào cơ sở dữ liệu
      await superAdmin.save()
      await superAdminInfo.save()

      console.log(`Super Admin created with email: ${superAdminInfo}`)
      console.log(`Password: ${plainPassword}`) // Hiển thị mật khẩu (nên lưu trữ hoặc gửi đi một cách an toàn)
    } else {
      console.log('Super Admin account already exists.')
    }
  } catch (error) {
    console.error('Error creating Super Admin:', error)
  }
}

// Utility function to generate a random password
function generateRandomPassword(length = 12) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?'
  let password = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length)
    password += chars[randomIndex]
  }
  return password
}

module.exports = createSuperAdmin
