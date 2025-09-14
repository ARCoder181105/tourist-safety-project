require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require('http'); // Required for socket.io

const app = express();
const server = http.createServer(app); // Create an HTTP server from the Express app

// Initialize socket.io
const io = require('./utils/socket').init(server);
io.on('connection', socket => {
  console.log('Client connected to WebSocket:', socket.id);
});

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/sos", require("./routes/sos"));

app.use("/api/users", require("./routes/users")); // <-- ADD THIS LINE

// Placeholder routes
app.use("/api/reports", require("./routes/reports"));
app.use("/api/fir", require("./routes/fir"));
app.use("/api/zones", require("./routes/zones"));

app.use("/api/dashboard", require("./routes/dashboard")); // <-- ADD THIS LINE

const PORT = process.env.PORT || 5001;
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        server.listen(PORT, () => console.log(`✅ Backend server with WebSocket running on port ${PORT}`));
    })
    .catch(err => console.error(err));