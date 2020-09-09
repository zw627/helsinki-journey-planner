# helsinki-journey-planner

An app that provides real-time itinerary information for the public transport in Helsinki.

## Project structure

**This is a monorepo:**

- Project root directory contains the server side `package.json` and `node_modules`.
- `server` directory contains all the server side codes.
- `client` directory contains a standalone `create-react-app` with its own `package.json` and `node_modules`.

## Scripts

These scripts are valid in the project root directory only.

**Install dependencies:**

- `npm install`: Install server side dependencies.
- `npm run client-install`: Install client side dependencies.

**Start:**

- `npm run server`: Start the server.
- `npm run client`: Start the client.
