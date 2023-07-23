const express = require('express')
const { getUsers, getSingleUser, updateUser, deleteUser, createUser } = require('../controller/User')
const router = express.Router()

router.route('/').get(getUsers)
router.route('/').post(createUser)
router.route('/:id').patch(updateUser)
router.route('/:id').delete(deleteUser)

router.route('/:id').get(getSingleUser)

module.exports = router