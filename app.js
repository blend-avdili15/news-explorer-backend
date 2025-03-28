require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const { errors } = require("celebrate");

const { requestLogger, errorLogger } = require("./middlewares/logger");
const errorHandler = require("./middlewares/error-handler");
const mainRouter = require("./routes/index");

const app = express();

const { PORT = 3002, MONGO_URI } = process.env;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Connected to DB"))
  .catch(console.error);

const allowedOrigins = [
  "http://localhost:3000",
  "https://news-explorer-ph5r.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(helmet());

// Logging Middleware
app.use(requestLogger);

// Crash Test Route (For Debugging)
app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

// Mount Routes
app.use("/api", mainRouter);

// Error Logging & Handling
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
