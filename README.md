# Helsinki Journey Planner

An app that provides real-time itinerary information for the public transport in Helsinki. [Try it here.](https://helsinki-journey-planner.com) Or use the mirros: [Netlify](https://helsinki-journey-planner.netlify.app/), [Amplify](https://master.d1hb32a5utog8e.amplifyapp.com/).

![Home Page](https://github.com/zw627/helsinki-journey-planner/blob/master/README.jpg)

## Project

- **Front-end:** React.
- **Back-end:** Node.js (Express).
- **Deployment:** AWS Elastic Beanstalk. (Mirrors: Netlify, AWS Amplify.)
- **Third-party API:** Digitransit.

## Folder structure

**This is a monorepo:**

- The project root directory contains the server side entry file `index.js`, and the server side `package.json` and `node_modules`.
- `server` directory contains the rest of the server side codes.
- `client` directory contains a standalone `create-react-app` with its own `package.json` and `node_modules`.

## Scripts

These scripts are valid in the project root directory only.

**Install dependencies:**

- `npm install` or `yarn install`: Install server side dependencies.
- `npm run client-install` or `cd ./client && yarn install`: Install client side dependencies.

**Start:**

- `npm run server` or `yarn server`: Start the server with `nodemon`.
- `npm run client` or `yarn client`: Start the client with `create-react-app`.
- `npm start` or `yarn start`: Build the client project first, then serve it with the back-end server.
- `npm run server-start` or `yarn server-start`: Start the server with `node`.

**Build:**

- `npm run client-build` or `yarn client-build`: Build the client.

## Deployment

- Server: A `.ebignore` is included to not ignore the front-end `build` directory while deploying to AWS Elastic Beanstalk.
- Server: CORS restriction is enable for production.
- Client: API URLs are toggled based on the environment.
- Client: `"homepage": "."` is added inside `package.json` to enable relative paths (convenient for serving build as a static site).
 
