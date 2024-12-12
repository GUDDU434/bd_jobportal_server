// models/job.js
const mongoose = require("mongoose");

const job = new mongoose.Schema(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, default: true },
    company: { type: String, required: true },
    ipAddress: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("job", job);
