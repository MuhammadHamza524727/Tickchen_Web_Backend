const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');
require('dotenv').config();
const cookieParser = require("cookie-parser");
connectDB()

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.use('/api/reservations', require("./routes/reservationRoutes"));
app.use('/api/admin/reservation_list',require('./routes/reservationRoutes'))
app.use('/api/admin/reservations',require('./routes/reservationRoutes'))
app.use('/api/admin/reservations/rejected',require('./routes/reservationRoutes'))

app.use('/api/user',require('./routes/userRoutes'))

app.use("/api/user",require('./routes/reservationRoutes'))
app.use("/api/authentication",require('./routes/reservationRoutes'))

app.use("/get-reservation",require('./routes/reservationRoutes'))

app.use("/api/user-order",require('./routes/UserOrderRoutes'))
app.use("api/user",require('./routes/UserOrderRoutes'))

app.use("/api/users", require('./routes/userRoutes'));

app.use("/api/pay",require('./routes/pay.routes') );


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
