const User = require('../models/users')
const stripe = require('stripe')(process.env.STRIPE_ID)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// Create a new customer in Stripe

const signUp = async (req, res) => {
    const { email, password, username } = req.body;
    console.log(password)
    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash the password before saving to the database
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);


        // Save the customer ID and user details to your database
        const user = new User({
            email: email,
            password: passwordHash,
            stripeCustomerId: null,
        });

        await user.save();
        console.log(user.id, 'aaaaaaaaaaa')
        // Create a new customer in Stripe
        const customer = await stripe.customers.create({
            email: email,
            name: username,
            metadata: {
                'userId': user.id,
                'username': username,
            }
        });

        user.stripeCustomerId = customer.id

        console.log(customer)
        await user.save();


        res.json({ message: 'Signup successful!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
};

// Login Route
const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Check if the provided password matches the stored password hash
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Generate a JWT token for authentication
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
        const customerId = user.stripeCustomerId

        res.json({ token, customerId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Something went wrong' });
    }
}



module.exports = { signUp, login }
