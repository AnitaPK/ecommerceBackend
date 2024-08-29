// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoute =  require('./routes/userRoute')
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute')
// Load config
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Init middleware
app.use(express.json());

const cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(cors())

// Define routes
app.use('/api/auth',authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/products', productRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

