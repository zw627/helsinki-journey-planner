# Helsinki Journey Planner

An app that provides real-time itinerary information for the public transport in Helsinki. [Try it here](https://helsinki-journey-planner.com). Or use the [mirror](https://helsinki-journey-planner.netlify.app/).

![Home Page](https://github.com/zw627/helsinki-journey-planner/blob/master/README.jpg)

## Project

- **Front-end:** React.
- **Back-end:** Node.js (Express).
- **Deployment:** AWS Elastic Beanstalk. (Mirror: Netlify.)
- **Third-party API:** Digitransit.

## Folder structure

**This is a monorepo:**

- The project root directory contains the server side `package.json` and `node_modules`.
- `server` directory contains the server side codes.
- `client` directory contains the client side codes, which is a standalone `create-react-app` with its own `package.json` and `node_modules`.

## Scripts

These scripts are valid in the project root directory only.

**Install dependencies:**

- `npm install` or `yarn install`: Install server side dependencies.
- `npm run client-install` or `cd ./client && yarn install`: Install client side dependencies.

**Start:**

- `npm run server` or `yarn server`: Start the server.
- `npm run client` or `yarn client`: Start the client.
- `npm start` or `yarn start`: Build the client project first, then serve it with the local server.

**Build:**

- `npm run client-build` or `yarn client-build`: Build the client.

## Deployment

**Server:**

- AWS Elastic Beanstalk with two environments.
- A `.ebignore` is included to not ignore the front-end `build` directory while deploying to AWS Elastic Beanstalk.
- A `Procfile` is included for AWS EB to start the project.
- A `alb-http-to-https-redirection.config` is included for AWS EB to redirect HTTP to HTTPS.
- CORS restriction is enable for production.

**Client:**

- AWS Elastic Beanstalk with two mirrors AWS Amplify and Netlify.
- API URLs are toggled based on the environment.
- `"homepage": "."` is added inside `package.json` to enable relative paths (convenient for serving build as a static site).
