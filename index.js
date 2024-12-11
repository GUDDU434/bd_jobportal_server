const { GoogleGenerativeAI } = require("@google/generative-ai"); //"@google/generative-ai";
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const genAI = new GoogleGenerativeAI(process.env.Gemini_API_Key);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req, res) => {
  res.send("Hello World! Gemini");
});

app.post("/generate", async (req, res) => {
  try {
    const { prompt } = req.body;
    let result = await model.generateContent(prompt);
    result = result.response.text();

    res.send({ result: result });
  } catch (error) {
    // console.error(error);
    res.send({ error: error });
  }
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running on port ${8000}`);
});
