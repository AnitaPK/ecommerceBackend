// server.js
const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const authRoute =  require('./routes/userRoute')
const categoryRoute = require('./routes/categoryRoute');
const productRoute = require('./routes/productRoute');
const cartRoute = require('./routes/cartRoutes');
const brandRoute = require('./routes/brandRoutes')
const bodyParser = require('body-parser');
const path = require('path');

// Load config
dotenv.config({ path: './.env' });

// Connect to database
connectDB();

const app = express();

// Init middleware
app.use(express.json());

const cors = require('cors');

// parse application/x-www-form-urlencoded
app.use(cors());
app.use(cors(
//     {
//     origin: 'http://localhost:3000', 
//     methods: ['GET', 'POST', 'PUT', 'DELETE'], 
//     credentials: true 
// }
));

app.use(bodyParser.urlencoded({ extended: true }));

// Define routes
app.use('/api/auth',authRoute);
app.use('/api/categories', categoryRoute);
app.use('/api/brand', brandRoute);
app.use('/api/products', productRoute);
app.use('/api/cart', cartRoute);

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

