require('dotenv').config();

const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Split Text
function splitText(response) {
    const maxLength = 2000;
    let chunks = [];
    for (let i = 0; i < response.length; i += maxLength) {
        chunks.push(response.substring(i, i + maxLength));
    }
    return chunks; // return an array
}

// GEMINI PRO TEXT MODEL
async function runGeminiPro(prompt) {
    // For text-only input, use the gemini-pro model
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
  
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text;
}

// GEMINI PRO VISION MODEL (later)
function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString("base64"),
            mimeType
        },
    };
}

async function runGeminiProVision(prompt, path, mimeType) {
    // For text-and-image input (multimodal), use the gemini-pro-vision model
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
  
    const imageParts = [
        fileToGenerativePart(path, mimeType)
    ];
  
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();
    return text;
  }
  
  

// export
module.exports = { runGeminiPro, splitText, runGeminiProVision };