// Import the necessary modules
const { default: axios } = require("axios");
const Job = require("../modal/jobs.modal");

const getJobRecomendation = async (req, res) => {
  try {
    const { prompt } = req.body;
    // let result = await model.generateContent(prompt);
    // result = result.response.text();

    let result1 = await axios.get(
      "https://www.googleapis.com/customsearch/v1",
      {
        params: {
          key: process.env.GOOGLE_SEARCH_API_KEY,
          cx: process.env.GOOGLE_SEARCH_ENGINE_ID,
          q: prompt,
        },
      }
    );

    result1 = result1.data;

    res.status(200).send({ data: result1, message: "Success", code: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Bookmark a new job
const bookmarkJob = async (req, res) => {
  try {
    // Extract the IP address from the request
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Create a new job with the IP address included
    const jobData = { ...req.body, ipAddress };
    const job = new Job(jobData);
    const savedJob = await job.save();

    res.status(201).json({
      data: savedJob,
      message: "Job bookmarked successfully",
      code: 201,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bookmarked jobs
const getBookmarkedJobs = async (req, res) => {
  try {
    const jobs = await Job.find();
    res
      .status(200)
      .json({ data: jobs, message: "Jobs fetched successfully", code: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a job by ID
const removeBookmarkedJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res
      .status(200)
      .json({ message: "Job removed successfully", data: null, code: 200 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export the controllers
module.exports = {
  getJobRecomendation,
  bookmarkJob,
  getBookmarkedJobs,
  removeBookmarkedJob,
};
