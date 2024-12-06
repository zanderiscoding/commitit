import OpenAI from 'openai';
import { getApiKey } from './config.js';

export async function generateCommitMessage(diff) {
  const openai = new OpenAI({
    apiKey: getApiKey()
  });

  const prompt = `Generate a snarky, humorous git commit message for the following changes:\n\n${diff}\n\nThe message should be professional enough for work but include some wit or humor. Use conventional commit format if applicable.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a witty developer who writes slightly sarcastic but professional git commit messages."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 100
  });

  return response.choices[0].message.content.trim();
} 