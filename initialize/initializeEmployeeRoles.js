const EmployeeRole = require('../models/EmployeeRole')
const Department = require('../models/Department')

const initializeEmployeeRoles = async () => {
  try {
    // Lấy danh sách tất cả các phòng ban
    const departments = await Department.find()

    // Định nghĩa các vai trò ứng với từng phòng ban
    const departmentRoles = {
      Marketing: [
        'Marketing Manager',
        'Content Creator',
        'SEO Specialist',
        'Social Media Manager',
        'Market Research Analyst',
      ],
      Accounts: [
        'Accountant',
        'Accounts Payable Clerk',
        'Financial Analyst',
        'Payroll Specialist',
        'Budget Analyst',
      ],
      'App Development': [
        'Mobile App Developer',
        'UI/UX Designer',
        'QA Tester',
        'DevOps Engineer',
        'Product Manager',
      ],
      'Web Development': [
        'Front-end Developer',
        'Back-end Developer',
        'Full-stack Developer',
        'Web Designer',
        'Web Project Manager',
      ],
      Support: [
        'Customer Support Representative',
        'Technical Support Specialist',
        'Help Desk Analyst',
        'IT Support Engineer',
        'Support Team Lead',
      ],
    }

    // Lặp qua tất cả các phòng ban để tạo các vai trò
    for (const department of departments) {
      const roles = departmentRoles[department.departmentName] // Lấy danh sách vai trò cho từng phòng ban

      if (roles) {
        for (const role of roles) {
          // Kiểm tra xem vai trò đó đã tồn tại chưa
          const existingEmployeeRole = await EmployeeRole.findOne({
            roleName: role,
            department: department.departmentName, // Liên kết vai trò với phòng ban
          })

          if (!existingEmployeeRole) {
            // Nếu vai trò chưa tồn tại, tạo mới
            await EmployeeRole.create({
              roleName: role,
              department: department.departmentName,
            })
          }
        }
      }
    }

    console.log('Employee roles initialized successfully based on departments.')
  } catch (error) {
    console.error('Error initializing employee roles:', error)
  }
}

module.exports = initializeEmployeeRoles
