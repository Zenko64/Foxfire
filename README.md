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
