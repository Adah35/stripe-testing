require('dotenv').config()
const express = require('express')
const connectDB = require('./config/dbConn')
const { default: mongoose } = require('mongoose')
const app = express()
const path = require('path')
const Subscription = require('./models/subscription')
const stripe = require('stripe')(process.env.STRIPE_ID)
const port = 3500

const YOUR_DOMAIN = 'http://localhost:3500'
app.use('/', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectDB()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'checkout.html'))
})

// app.use('/', require('./routes/routes'))

app.post('/create-checkout-session', async (req, res) => {
    const { planId, email } = req.body;
    console.log(req.body)
    try {
        const customer = await stripe.customers.create({
            email: email,
            // Add any additional customer information here if needed
        });
        console.log(customer.id)
        const prices = await stripe.prices.list({
            lookup_keys: [req.body.planId],
            expand: ['data.product'],
        });
        console.log(prices)
        const session = await stripe.checkout.sessions.create({
            billing_address_collection: 'auto',
            line_items: [
                {
                    price: prices.data[0].id,
                    // For metered billing, do not pass quantity
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
        });
        // Save subscription information to your database
        // const newSubscription = new Subscription({
        //     customerId: customer.id,
        //     subscriptionId: subscription.id,
        //     planId: planId,
        // });
        // await newSubscription.save();

        res.redirect(303, session.url);
    } catch (err) {
        console.error('Error creating subscription:', err.message);
        res.status(500).json({ error: 'An error occurred while creating the subscription' });
    }
});

app.post('/create-portal-session', async (req, res) => {
    try {
        // For demonstration purposes, we're using the Checkout session to retrieve the customer ID.
        // Typically this is stored alongside the authenticated user in your database.
        const { session_id } = req.body;
        console.log(session_id)
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

        // This is the url to which the customer will be redirected when they are done
        // managing their billing with the portal.
        const returnUrl = YOUR_DOMAIN;

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: checkoutSession.customer,
            return_url: returnUrl,
        });

        res.redirect(303, portalSession.url);
    } catch (err) {
        console.log('Error creating subscription:', err.message)
        res.status(500).json({ error: 'An error occurred while creating the subscription' });
    }
});







app.all('*', (req, res) => {
    res.status(404)
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'public', '404.html'))
    } else if (req.accepts('json')) {
        res.json({ message: '404 not found' })
    } else {
        res.type('txt').send('404 not found')
    }
})


mongoose.connection.on('open', () => {

    app.listen(port, () => {
        console.log(`app running on port ${port}`)
    })
})

mongoose.connection.once('error', (error) => {
    res.json({ message: error.message })
})