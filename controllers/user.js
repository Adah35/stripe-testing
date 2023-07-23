const User = require('../models/users')

const createUser = async (req, res) => {
    const { username, email, password } = req.body

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'all fields are required' })
        }
        const user = await User.create({ username, email, password })

        return res.json({ message: 'user created' })
    } catch (error) {
        return res.json(error.message)
    }
}

const getUsers = async (req, res) => {
    try {
        const user = await User.find()
        res.json(user)
    } catch (error) {
        res.json(error)
        console.log(error)
    }
}

module.exports = { createUser, getUsers }