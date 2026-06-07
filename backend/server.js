const express = require('express');
const dotenv = require('dotenv').config();
const cors = require('cors');
const { initDB } = require('./connect/database');
const { errorHandler } = require('./middlewares/errorMiddleware');

const port = process.env.PORT || 5000;

initDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));
