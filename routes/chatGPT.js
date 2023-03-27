const request = require('request');

const API_URL = 'https://api.openai.com/v1/engines/davinci-codex/completions';

const API_SECRET_KEY = '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';

const options = {
  url: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_SECRET_KEY}`
  },
  body: JSON.stringify({
    prompt: 'Hello, how can I help you today?',
    max_tokens: 60,
    temperature: 0.5,
    n: 1,
    stop: '\n'
  })
};

request.post(options, (error, response, body) => {
  if (!error && response.statusCode == 200) {
    const result = JSON.parse(body);
    const responseText = result.choices[0].text.trim();
    console.log(responseText);
  } else {
    console.log('Error generating response:', error);
  }
});
