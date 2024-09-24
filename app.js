require('dotenv').config() // Nạp các biến môi trường từ file .env

const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const employeeRoutes = require('./routes/employee')

const app = express()

// Lấy PORT và MONGO_URI từ biến môi trường
const PORT = process.env.PORT || 5000
const MONGO_URI = process.env.MONGO_URI

// Middleware để parse dữ liệu JSON
app.use(bodyParser.json())

// Các route liên quan đến nhân viên
app.use('/api/employees', employeeRoutes)

// Kết nối tới MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Failed to connect to MongoDB', error)
  })

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
