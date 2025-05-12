# Zone01 Profile Dashboard

A Next.js + GraphQL dashboard for Zone01 students. Visualize your XP, audits, skills, and activity in a modern UI.

## Features

- Secure login (JWT)
- XP and project stats
- Activity heatmap (Gitea/Zone01 activity style)
- Audit history and stats
- Skills radar/spiderweb chart
- Best friends/collaborators
- Responsive, dark mode, accessible

## Data sources

- All activity and stats are based on your Zone01 (Gitea) platform events (projects, audits, XP, corrections, etc.).
- No GitHub data is used. The heatmap and stats reflect your Zone01/Gitea activity only.

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000)

## Configuration

- Requires a Zone01 account
- API endpoint: `https://zone01normandie.org/api/graphql-engine/v1/graphql`

## Tech Stack

- Next.js
- Apollo Client (GraphQL)
- Tailwind CSS
- TypeScript

---

Feel free to contribute or open issues!
