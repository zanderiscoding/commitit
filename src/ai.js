import OpenAI from 'openai';
import { getApiKey, getModel, getPrompt } from './config.js';

export async function generateCommitMessage(diff) {
  const openai = new OpenAI({
    apiKey: getApiKey()
  });

  const response = await openai.chat.completions.create({
    model: getModel(),
    messages: [
      {
        role: "system",
        content: getPrompt()
      },
      {
        role: "user",
        content: diff
      }
    ],
    temperature: 0.7,
    max_tokens: 100
  });

  return response.choices[0].message.content.trim();
} 