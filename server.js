const express = require('express');
const cors = require('cors');
const stripe = require('stripe');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'Data.json');

function readDB() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading Data.json:', error);
    return { Users: [] };
  }
}

function writeDB(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing Data.json:', error);
  }
}

function generateId() {
  return Math.random().toString(36).substring(2, 14);
}

function calculateSubEndDate(plan) {
  const end = new Date();
  if (plan === 'month') {
    end.setMonth(end.getMonth() + 1);
  } else if (plan === 'year') {
    end.setFullYear(end.getFullYear() + 1);
  }
  return end.toISOString();
}

// json-server compatible: list all users
app.get('/Users', (req, res) => {
  try {
    const db = readDB();
    res.json(db.Users || []);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json([]);
  }
});

// json-server compatible: get single user
app.get('/Users/:id', (req, res) => {
  try {
    const db = readDB();
    const user = db.Users?.find((u) => u.id === req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// json-server compatible: create user
app.post('/Users', (req, res) => {
  try {
    const db = readDB();
    if (!db.Users) db.Users = [];

    const newUser = {
      WatchHistory: [],
      WatchLater: [],
      Favourites: [],
      IsSubscribe: false,
      SubscriptionEndDate: null,
      ...req.body,
      id: req.body.id || generateId(),
    };

    db.Users.push(newUser);
    writeDB(db);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !['month', 'year'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan. Must be "month" or "year".' });
    }

    const priceMap = {
      month: 500,
      year: 5000,
    };

    const session = await stripeClient.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: plan === 'month' ? 'Monthly Subscription' : 'Yearly Subscription',
            },
            unit_amount: priceMap[plan],
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:4200/success?plan=${plan}`,
      cancel_url: 'http://localhost:4200/subscription',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error.message);
    res.status(500).json({ error: error.message || 'Failed to create checkout session' });
  }
});

app.post('/activate-subscription', async (req, res) => {
  try {
    const { plan, userId } = req.body;

    if (!plan || !['month', 'year'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan. Must be "month" or "year".' });
    }

    if (!userId) {
      return res.status(400).json({ error: 'User id is required' });
    }

    const db = readDB();
    const user = db.Users?.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.IsSubscribe = true;
    user.SubscriptionEndDate = calculateSubEndDate(plan);

    writeDB(db);

    res.json({
      success: true,
      message: `Subscription activated for ${plan} plan`,
      user,
    });
  } catch (error) {
    console.error('Error activating subscription:', error);
    res.status(500).json({ error: 'Failed to activate subscription' });
  }
});

app.post('/cancel-subscription', (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User id is required' });
    }

    const db = readDB();
    const user = db.Users?.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.IsSubscribe = false;
    user.SubscriptionEndDate = null;

    writeDB(db);

    res.json({
      success: true,
      message: 'Subscription cancelled',
      user,
    });
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
