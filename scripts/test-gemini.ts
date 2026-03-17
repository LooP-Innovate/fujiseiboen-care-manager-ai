import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Clean keys that might have VITE_ prefix if loaded via dotenv
const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const modelName = process.env.VITE_VERTEX_MODEL || process.env.VERTEX_MODEL || 'gemini-1.5-pro';

async function testConnection() {
  console.log('--- Gemini Connection Diagnostic ---');
  console.log('Model:', modelName);
  console.log('API Key Length:', apiKey?.length);
  
  if (!apiKey) {
    console.error('Error: API Key is missing!');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  
  try {
    console.log('Fetching model info...');
    const model = genAI.getGenerativeModel({ model: modelName });
    
    console.log('Sending test prompt...');
    const result = await model.generateContent("Hello, are you working?");
    const response = await result.response;
    console.log('Response Success:', response.text());
    console.log('SUCCESS: API connection works!');
  } catch (error) {
    console.error('FAILURE: Connection failed!');
    console.error(error);
  }
}

testConnection();
