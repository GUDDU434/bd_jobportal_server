const JobRoutes = require("express").Router();
const jobController = require("../controllers/job.controller");

JobRoutes.post("/recomendation", jobController.getBookmarkedJobs);
JobRoutes.post("/bookmark-job", jobController.bookmarkJob);
JobRoutes.get("/bookmarked-jobs", jobController.getBookmarkedJobs);
JobRoutes.delete("/bookmark-job/:id", jobController.removeBookmarkedJob);

module.exports = JobRoutes;