require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Log request duration
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.url} - ${duration} ms`);
  });
  next();
});

// Check if the server is running
app.get("/start", (req, res) => {
  res.send("Welcome to BD JOB PORTAL SERVER v1.0.0 testing");
});

// Job Portal API routes
app.use("/jobs", require("./routes/job.routes"));

// Listen on the specified port
const port = process.env.PORT || 8000;
require("./config/db");
app.listen(port, () => {
  console.log(`Server is running on port ${8000}`);
});
