# Helsinki Journey Planner

An app that provides real-time itinerary information for the public transport in Helsinki. [Try it here.](https://helsinki-journey-planner.netlify.app/)

![Home Page](https://github.com/zw627/helsinki-journey-planner/blob/master/README.jpg)

## Project

- **Front-end:** React.
- **Back-end:** Node.js (Express) REST API.
- **Deployment:** Netlify, AWS Elastic Beanstalk.
- **Third-party API:** Digitransit.

## Folder structure

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

**Build:**

- `npm run client-build`: Build the client.

## Deployment

- Server: A `.ebignore` is included to ignore the `client` directory while deploying to AWS Elastic Beanstalk.
- Server: CORS restriction is enable for production.
- Client: API URLs are toggled based on environment.
- Client: `"homepage": "."` is added inside `package.json` to enable relative paths (convenient for serving build as a static site).
 
