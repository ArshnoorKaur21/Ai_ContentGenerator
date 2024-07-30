const express = require("express");
const openAIRouter= express.Router();
const { generateStory } = require("../controllers/AIController");
const isAuthenticated = require("../middlewares/isAuthenticated");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");

openAIRouter.post("/generate-content",isAuthenticated,checkApiRequestLimit, generateStory);

module.exports = openAIRouter;
