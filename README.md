# BG's AnimeRank

A full-stack anime ranking app where users vote between pairs of anime. Rankings are updated using an Elo-like rating system, and you can browse a leaderboard and discover top titles.

## Features

- **Home** — Browse a featured grid of top anime (with images and descriptions)
- **Vote** — Compare two random anime and pick your favorite (or declare a draw)
- **Leaderboard** — View all anime sorted by rating
- **Elo-like ratings** — Votes update anime ratings so the leaderboard reflects community preferences

## Tech Stack

| Layer    | Stack |
| -------- | ----- |
| Frontend | React 19, Vite 7, React Router, Axios, styled-components |
| Backend  | Node.js, Express 5, MongoDB (Mongoose) |
| Deploy   | Frontend: AWS S3 + CloudFront (GitHub Actions); Backend: Render |

## Project Structure

```
anime-ranking-app/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/     # Home, Vote, Leaderboard
│   │   └── App.jsx
│   └── package.json
├── backend/           # Express API
│   ├── routes/       # /api/anime, /api/votes
│   ├── models/       # Anime, Vote
│   ├── controllers/
│   └── server.js
└── .github/workflows/ # Deploy frontend on push to master
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

### Backend

1. Go to the backend folder and install dependencies:

   ```bash
   cd backend
   npm install
   ```

2. Create a `.env` file in `backend/`:

   ```env
   MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
   PORT=5000
   ```

3. Start the server:

   ```bash
   npm run dev
   ```

   The API runs at `http://localhost:5000`. A root request returns a welcome message.

### Frontend

1. In the frontend folder, install dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Create a `.env` file in `frontend/` (or `.env.local`):

   ```env
   VITE_API_URL=http://localhost:5000
   ```

3. Start the dev server:

   ```bash
   npm run dev
   ```

   Open the URL shown in the terminal (e.g. `http://localhost:5173`).

### Running Both

From the project root you can run backend and frontend in two terminals:

- Terminal 1: `cd backend && npm run dev`
- Terminal 2: `cd frontend && npm run dev`

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/anime` | List all anime (optional `?genre=...`) |
| GET | `/api/anime/random-pair` | Get two random anime for voting |
| GET | `/api/anime/random/single?exclude=id1,id2` | Get one random anime excluding IDs |
| GET | `/api/anime/leaderboard` | Leaderboard data |
| GET | `/api/anime/:id` | Get anime by ID |
| POST | `/api/votes` | Submit a vote (`voterId`, `winnerId`, `loserId`, `isDraw`) |

Votes trigger an Elo-like update of the two anime ratings.

## Deployment

- **Frontend**: Pushing to `master` with changes under `frontend/` triggers a GitHub Actions workflow that builds the app (with `VITE_API_URL` from secrets), syncs to S3, and invalidates the CloudFront cache. Required secrets: `RENDER_API_URL`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`, `CLOUDFRONT_DOMAIN`.
- **Backend**: Intended to run on Render (or similar). Set `MONGODB_URI` and `PORT` in the service environment.

## License

ISC.
