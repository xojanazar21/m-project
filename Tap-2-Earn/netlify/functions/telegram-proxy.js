const fetch = require('node-fetch');

// Netlify Function that proxies requests to Telegram Bot API using BOT_TOKEN from environment
// It expects a POST with JSON body: { method: "sendMessage", params: { chat_id: ..., text: ... } }
// IMPORTANT: Do NOT commit your BOT token into the repository. Set it in Netlify dashboard as BOT_TOKEN.
exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  const BOT_TOKEN = process.env.BOT_TOKEN;
  if (!BOT_TOKEN) {
    return { statusCode: 500, body: JSON.stringify({ error: 'BOT_TOKEN not configured in environment' }) };
  }
  let body;
  try { body = JSON.parse(event.body); } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }
  const { method, params } = body;
  if (!method) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing method' }) };
  }
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {})
    });
    const data = await resp.json();
    return {
      statusCode: resp.status,
      body: JSON.stringify(data)
    };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: String(err) }) };
  }
};
