const { GoogleGenerativeAI } =require("@google/generative-ai");
const dotenv=require("dotenv");
const User=require("../models/User")
const ContentHistory = require("../models/ContentHistory");
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const generateStory = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.status(400).send("Prompt is required.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    // console.log("Response object:", response);
    const text = await response.text();
console.log("whole text is",text);
const content=text;
// console.log("Content is ",content);
// console.log("Whole text is", text);
// console.log("Content is", content);
// console.log("User is", req.user?._id);

// if (!req.user || !req.user._id) {
//   return res.status(400).send("User ID is missing from the request.");
// }

const newContent = await ContentHistory.create({
  user: req.user._id,
  content,
});

const userFound = await User.findById(req.user._id);
if (!userFound) {
  return res.status(404).send("User not found.");
}

// console.log("User found is", userFound);
userFound.history.push(newContent._id);
userFound.apiRequestCount+=1;
await userFound.save();

res.status(200).json(content);
  } catch (error) {
    res.status(500).send("Error generating content: " + error.message);
  }
 
};

module.exports = {
  generateStory,
};
