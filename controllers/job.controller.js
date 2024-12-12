// Import the necessary modules
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Job = require("../modal/jobs.modal");

const getJobRecomendation = async (req, res) => {
  const { prompt } = req.body;

  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction:
      '1. **Input Validation**:\n   - Check if the user input is related to a job search query (e.g., it contains keywords like "jobs," "developer," "hiring," or a specific job title and location).\n   - If the input is unrelated, respond with an error message:\n     ```json\n     { "error": "Invalid input. Please provide a job-related query." }\n     ```\n\n2. **Process the Query**:\n   - If the input is valid, proceed to fetch job-related information based on the query.\n\n3. **Response Format**:\n   - The response should be in JSON format as an array of objects. Minimum 10 objects.\n   - Each object must contain the following details:\n     - `title`: The job title.\n     - `company`: The name of the hiring company.\n     - `location`: The job location.\n     - `description`: A brief description of the job role.\n',
  });

  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };

  try {
    const chatSession = model.startChat({
      generationConfig,
    });

    const result = await chatSession.sendMessage(prompt);
    let responseJson = JSON.parse(result.response.text());

    if (Array.isArray(responseJson)) {
      res
        .status(200)
        .send({ data: responseJson, status: 200, message: "Success" });
    } else {
      res.status(400).send({ ...responseJson, status: 400, message: "Error" });
    }
  } catch (err) {
    res.status(500).send({ error: err });
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
      status: 201,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all bookmarked jobs
const getBookmarkedJobs = async (req, res) => {
  try {
    // Extract the IP address from the request
    const ipAddress = req.ip || req.connection.remoteAddress;

    // Find all jobs with the IP address
    const jobs = await Job.find({ ipAddress });
    res
      .status(200)
      .json({ data: jobs, message: "Jobs fetched successfully", status: 200 });
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
      .json({ message: "Job removed successfully", data: null, status: 200 });
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
