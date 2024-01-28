// import { OpenAIApi } from "openai";

// const configuration = new OpenAI({
//   organization: "org-bJqXebpQYWbDwjxdN1I69aTg",
//   apiKey: "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",
// });

// const openai = new OpenAIApi(configuration);
// const response = await openai.createCompletion({
//   model: "gpt-3.5-turbo-instruct",
//   prompt: "Say this is a test.",
//   max_tokens: 7,
//   temperature: 0,
// });

// console.log(response.data.choices[0].text);

import OpenAI from "openai";

const openai = new OpenAI({
  organization: "org-9vluaGtKaqSzgKaWYVPfGc6j",
  apiKey: "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",
});

const completion = await openai.completions.create({
  model: "gpt-3.5-turbo-instruct",
  prompt: "Say this is a test",
  max_tokens: 7,
  temperature: 0,
});

console.log(completion);
console.log(completion.choices[0].text);
