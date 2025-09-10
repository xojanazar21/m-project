# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list

## Netlify deployment & Telegram bot proxy

This project is a Vite React frontend and expects a backend API at `VITE_API_URL`.
For a simple deployment on Netlify we added a serverless function that proxies Telegram Bot API calls.

1. **Do NOT store your bot token in the repo.** Instead set an environment variable in Netlify:
   - Go to your site dashboard -> Site settings -> Build & deploy -> Environment -> Environment variables.
   - Add `BOT_TOKEN` with your Telegram bot token value.

2. Build & publish
   - Netlify will run `npm run build` and publish the `dist` folder.
   - We added `netlify.toml` and a function in `netlify/functions/telegram-proxy.js`.
   - The function is reachable at `/.netlify/functions/telegram-proxy` and we redirect `/api/telegram/*` to it.

3. How to call the proxy from the frontend
   - POST to `/api/telegram` with JSON:
     `{ "method": "sendMessage", "params": { "chat_id": <id>, "text": "Hello" } }`
   - The function will call `https://api.telegram.org/bot<BOT_TOKEN>/sendMessage`.

4. IMPORTANT security note
   - Never expose BOT_TOKEN to client JavaScript. Only call the function from your frontend when necessary,
     and ensure actions that require authentication are validated on a secure server.

If you want, I can adapt more API endpoints into Netlify functions (user auth, leaderboard, etc.) — I implemented the Telegram proxy as a first step.
