# Reservation system for Hilton restaurants

It's a `Monorepo` style project, with `PNPM` managing workspaces, `SWC` compiling, and finally running through `Docker`

## Directory Structure

`├──`[`.vscode/`](./.vscode) - VSCode settings including recommended extensions etc.<br>
`├──`[`ressys-api/`](./ressys-api) - GraphQL API with JWT authentication for the reservation system.<br>
`├──`[`ressys-app/`](./ressys-app) - Frontend react app for the reservation system.<br>
`├──`[`Dockerfile`](./Dockerfile) - Dockerfile is used to build the project images.<br>
`├──`[`docker-compose.yml`](./docker-compose.yml) - Running the project in Docker.<br>
`└──`[`pnpm-workspace.yaml`](./pnpm-workspace.yaml) - PNPM workspace file.<br>

## Tech Stack

- [React](https://react.dev/), [React Router](https://reactrouter.com/), [Recoil](https://recoiljs.org/), [Emotion](https://emotion.sh/), [Material UI](https://next.material-ui.com/), [Apollo GraphQL](https://www.apollographql.com/), [JWT](https://jwt.io), [MongoDB](https://www.mongodb.com)
- [Vite](https://vitejs.dev/), [Vitest](https://vitejs.dev/),
  [TypeScript](https://www.typescriptlang.org/), [ESLint](https://eslint.org/), [Prettier](https://prettier.io/), [PNPM](https://pnpm.io/), [SWC](https://swc.rs/)

## How to Deploy and Run

Make sure your computer has a stable internet connection and `Docker` installed.

Open a terminal, navigate to the project directory (the directory containing `docker-compose.yml`), and execute the following command:

```
$ docker compose up -d
```

Open your browser and visit http://localhost:4000.

The system presets 3 users for testing:

| User               | Password | Role  |
| ------------------ | -------- | ----- |
| jane.doe@user1.com | 111111   | -     |
| jane.doe@user2.com | 111111   | -     |
| jane.doe@admin.com | 111111   | admin |
