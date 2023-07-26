const dotenv = require('dotenv')
dotenv.config()
const express = require('express')
const connectDB = require('./config/dbConn')
const { default: mongoose } = require('mongoose')
const app = express()
const path = require('path')
const Subscription = require('./models/subscription')
const { subscribe } = require('diagnostics_channel')
const stripe = require('stripe')(process.env.STRIPE_ID)
const port = 3500

const YOUR_DOMAIN = 'https://my-stripe-app.onrender.com'
app.use('/', express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
connectDB()

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/', require('./routes/routes'))
app.use('/auth', require('./routes/auth'))

app.post('/create-checkout-session', async (req, res) => {
    const { planId, customerId } = req.body;
    console.log(customerId)
    try {
        // Create a new Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: planId,
                    quantity: 1,
                },
            ],
            customer: customerId,
            success_url: `${YOUR_DOMAIN}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
        });
        const subscription = new Subscription({
            customerId: customerId,
            planId: planId,
            status: 'active',
            subscriptionId: session.id,
        });

        try {
            await subscription.save();
        } catch (err) {
            console.error('Error saving subscription:', err);
        }
        res.redirect(303, session.url);
    } catch (err) {
        console.error('Error creating subscription:', err.message);
        res.redirect(303, '/');
        // res.status(500).json({ error: 'An error occurred while creating the subscription' });
    }
});
app.post('/customer-portal', async (req, res) => {
    const { session_id, customer_id } = req.body
    const subscribtion = await Subscription.findOne({ subscriptionId: session_id }).exec()
    const customerId = subscribtion ? subscribtion.customerId : customer_id
    console.log(customerId)
    try {
        const returnUrl = YOUR_DOMAIN;

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: returnUrl,

        });

        res.redirect(303, portalSession.url);
    } catch (err) {
        console.log('Error creating subscription:', err.message)
        res.redirect(303, '/');
    }
});


app.post(
    '/webhooks',
    express.raw({ type: 'application/json' }),
    async (req, res) => {
        let data;
        let eventType;
        let status
        // Check if webhook signing is configured.
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

        if (webhookSecret) {
            // Retrieve the event by verifying the signature using the raw body and secret.
            let event;
            let signature = req.headers["stripe-signature"];

            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    webhookSecret
                );
            } catch (err) {
                console.log(`⚠️  Webhook signature verification failed.`);
                return res.sendStatus(400);
            }
            // Extract the object from the event.
            data = event.data;
            eventType = event.type;
        } else {
            // Webhook signing is recommended, but if the secret is not configured in `config.js`,
            // retrieve the event data directly from the request body.
            data = req.body.data;
            eventType = req.body.type;
        }
        // Handle the event
        switch (eventType) {
            case 'checkout.session.completed':
                subscription = data.object;
                status = subscription.status;
                const customerId = data.object.customer;
                const planId = data.object.display_items[0].plan.id;
                const currentPeriodEnd = new Date(data.object.current_period_end * 1000); // Convert to Date format

                console.log(`Subscription status is ${status}.`);
                console.log(subscription)

                const subscription = new Subscription({
                    customerId: customerId,
                    planId: planId,
                    status: status,
                    subscriptionId: subscription.id,
                    currentPeriodEnd: currentPeriodEnd,
                });

                try {
                    await subscription.save();
                } catch (err) {
                    console.error('Error saving subscription:', err);
                }
                break


            default:
                // Unexpected event type
                console.log(`Unhandled event type ${eventType}.`);
        }
        // Return a 200 res to acknowledge receipt of the event
        res.send();
    }
);




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
