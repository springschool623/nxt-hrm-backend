const express = require('express')
const router = express.Router()
const LeaveType = require('../models/LeaveType')

// API để lấy danh sách tất cả user roles
router.get('/list', async (req, res) => {
  try {
    const leaveTypes = await LeaveType.find() // Fetch all user roles from the database
    res.status(200).json(leaveTypes) // Send the user roles as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leave types', error })
  }
})

module.exports = router
