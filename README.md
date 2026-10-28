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

## Run it

This site is served by the [backend](https://github.com/pandroidYT/doxxd-backend). Follow the "Run it" steps there: `npm run setup` builds this site too, and `npm start` runs everything on http://localhost:3000.

To work on the site with live reload: start the backend with `npm run dev`, then run `npm run dev` here and open http://localhost:5173. API calls are forwarded to the backend automatically.
