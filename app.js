const express = require('express');
const connectDB = require('./config/mongodb');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./route/userRoutes.js');

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use('/web', userRoutes);

const PORT = process.env.MONGODB_PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})