require('dotenv').config() // Nạp các biến môi trường từ file .env

const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const employeeRoutes = require('./routes/employee')
const userRoleRoutes = require('./routes/user_role')
const userRoutes = require('./routes/user')
const leaveRequestRoutes = require('./routes/leave_request')
const departmentRoutes = require('./routes/department')
const employeeRoleRoutes = require('./routes/employee_role')
const leaveTypeRoutes = require('./routes/leave_type')
const initializeRoles = require('./initialize/initializeUserRoles') // Import script khởi tạo roles
const createSuperAdmin = require('./initialize/initializeSuperAdmin') // Import script khởi tạo roles
const initializeDepartments = require('./initialize/initializeDepartments') // Import script khởi tạo roles
const initializeEmployeeRoles = require('./initialize/initializeEmployeeRoles') // Import script khởi tạo roles
const initializeLeaveTypes = require('./initialize/initializeLeaveTypes') // Import script khởi tạo roles

const app = express()

// Lấy PORT và MONGO_URI từ biến môi trường
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

// Bật CORS cho toàn bộ ứng dụng
app.use(cors())

// Middleware để parse dữ liệu JSON
app.use(bodyParser.json())

// Các route liên quan đến nhân viên
app.use('/api/employees', employeeRoutes)
app.use('/api/user-roles', userRoleRoutes)
app.use('/api/users', userRoutes)
app.use('/api/leave-requests', leaveRequestRoutes)
app.use('/api/departments', departmentRoutes)
app.use('/api/employee-roles', employeeRoleRoutes)
app.use('/api/leave-types', leaveTypeRoutes)

// Kết nối tới MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')

    // Khởi tạo các roles sau khi kết nối database thành công
    initializeRoles() // Gọi hàm khởi tạo roles
    createSuperAdmin()
    initializeDepartments()
    initializeEmployeeRoles()
    initializeLeaveTypes()
  })
  .catch((error) => {
    console.log('Failed to connect to MongoDB', error)
  })

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
