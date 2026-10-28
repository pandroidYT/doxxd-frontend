# DoXXd

**Say anything. Until someone doxxes you.**

The web app for DoXXd: an anonymous social feed where anyone can spend a daily dox token to unmask who wrote a post, for everyone to see.

**Stack:** React 19 · TypeScript · Vite · Tailwind CSS 4 · React Router · TanStack Query

## Pages

| Route | What's there |
| --- | --- |
| `/` | Feed with the anonymous post composer |
| `/exposed` | Every post that has been doxxed |
| `/hall-of-shame` | Leaderboards: most doxxed, top doxxers |
| `/post/:id` | A post and its replies |
| `/u/:username` | Public profile (only shows doxxed posts) |
| `/me` | Your own posts (anonymous and exposed) plus settings |
| `/notifications` | Replies and doxxes |
| `/login` | Sign up / log in |

## Run it locally

Start the [API](https://github.com/pandroidYT/doxxd-backend) first, then:

```bash
npm install
npm run dev        # http://localhost:5173
```

By default it talks to `http://localhost:3000`. To point it somewhere else, copy `.env.example` to `.env` and set `VITE_API_URL`.

## Deploy (free)

On [Vercel](https://vercel.com) or [Netlify](https://netlify.com), import this repo and set the environment variable `VITE_API_URL` to your deployed API URL. Build command: `npm run build`. Output folder: `dist`. SPA routing is already configured (`vercel.json` / `public/_redirects`).

Remember to add the frontend's URL to the API's `CORS_ORIGINS`.
