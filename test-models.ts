import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(".env") });

async function checkModels() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.log("FAILED: GEMINI_API_KEY not found in .env.local");
    return;
  }
  
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
    const data = await response.json();
    console.log("SUCCESS");
    if (data.models) {
      const validModels = data.models
        .filter((m: any) => m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent"))
        .map((m: any) => m.name.replace("models/", ""));
      console.log(validModels.join("\n"));
    } else {
      console.log(data);
    }
  } catch (error) {
    console.error("FAILED", error);
  }
}

checkModels();
