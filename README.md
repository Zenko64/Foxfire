<div align="center">
  <p align="center">
  </p>
  <h1>Foxfire</h1>
  <p><i>"A self-hostable, small, and focused micro-blog."</i></p>
<hr>
</div>

## Introduction
Foxfire is a small, minimal, micro-blog that allows users to post status updates, and other things they like (currently only plain text is supported). Foxfire is intended to be a more polished version and successor of my other project [Znko.dev](https://github.com/Zenko64/Znko.dev) ( although it uses the same url :P ).

## Features
> **Privacy Levels**  
> - **Private**: Take notes for yourself or write a draft to finish later.
> - **Unlisted**: Share your most recent endeavours only with those you want to see (URL).
> - **Public**: Share your latest story publicly in all it's glory!

> **User Profile Feeds**
> - Interested in only a single user's posts? Use their username to jump straight into their personal profiles, or just click one of their public posts or shared posts.  
(Ex: https://foxfire.example/user/{targetUsername}

### Planned Features
- Rich text editing
- Further profile customizations
- Video streaming
- Linking discord activity

## Technicalities
### Stack
| Layer    | Tech                                 |
|----------|--------------------------------------|
| Runtime  | Bun                                  |
| API      | HonoJS, Zod                          |
| Db       | Postgresql+Drizzle                   |
| Auth     | BetterAuth                           |
| Frontend | React, ShadCN, RHF, React Query, Zod |

## How to deploy
1. First, you should clone the repo and install the dependencies:
```bash
git clone https://github.com/Zenko64/Foxfire foxfire && cd foxfire
bun install
```
2. Setup a PostgreSQL server and create the database
```sql
CREATE DATABASE foxfire;
```
For getting a quick database, copy the root ```.env.example``` to ```.env``` and set your ```PG_PASS```. The default user is ```postgres``` and ```PG_PASS``` sets your default password. Then bring the compose up.

3. Copy ```apps/backend/.env.example``` to ```apps/backend/.env``` and fill in the needed information
  - ```DATABASE_URL```: ex: ```postgres://postgres:password@localhost:5432/foxfire```
  - ```APP_URL```: Where the application will be publicly served
  - ```BETTER_AUTH_SECRET```: Required in production, generate a secret using ```openssl rand -base64 32```
  - ```HOST```: Host to bind to. 127.0.0.1 by default.
  - ```PORT```: Port to bind to. 4000 by default.

4. Build the apps:
```sh
bun run build
```

5. Start the backend with pm2 (Runs on production NODE_ENV)
```sh
pm2 start ecosystem.config.cjs
```
Database migrations should run automatically on startup.

6. Serve ```apps/frontend/dist``` as a SPA (every unmatched route leads to index.html) on your preferred HTTP server, and proxy the ```/api/*``` route to your backend.
