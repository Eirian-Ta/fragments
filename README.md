# Lab 1

## Overview

Practice on doing the initial setup of the back-end microservice project and repo with the goals are:

1. Set up of your development environment
2. Set up of your git and GitHub repos
3. Set up initial development tooling
4. Begin writing the API server
5. Set up structured logging
6. Practice using various HTTP testing tools
7. Set up npm scripts
8. Set up and learn to use VSCode debugging for future work

## Scripts

1. Check for errors
```sh
npm run lint
```

2. Start the server
```sh
npm start
```

3. Start the server via `nodemon`, which watches the `src/**` folder for any changes, restarting the server whenever something is updated
```sh
npm run dev
```
4. Start the server via `nodemon`, which watches the `src/**` folder for any changes and also starts the [node inspector](https://nodejs.org/en/docs/guides/debugging-getting-started/) on port `9229`
```sh
npm run debug
```
