# PlanDot

![Logo](frontend/src/assets/logo/plandot.png)

[**PlanDot**](https://plandot.app) is a personal planning tool that makes keeping track of your
life easier than ever before.

- Capture assignments, tasks, events, and to-dos as
  _items_. Then, organize your items by placing them in _groups_.
- Assign dates, times, and locations to your items. Or don't!
- Sort, filter, and search to find and prioritize the things you need to do.
- View your items as a monthy calendar, or as a daily agenda.

## Technologies

- TypeScript
- Angular
- Node.js
- Express
- Tailwind CSS
- Jasmine
- Jest

## Running the app

**Note:** 2048 MB of RAM is recommended to build and run the app. Having less RAM may lead to crashes or infinite build times.

### Development

Before you can run the app:

1. [Install Node.js](https://nodejs.org/en/)
2. [Install the Angular CLI](https://angular.io/cli)
3. [Install MongoDB Community Edition](https://docs.mongodb.com/manual/administration/install-community/)

After cloning the repository, to prepare the app for execution:

```console
$ (cd frontend && npm install)
$ (cd backend && npm install)
```

To run the frontend in development mode: 

```console
$ cd frontend
$ npm install
$ npm run serve
```

To run the backend in development mode:

```console
$ cd backend
$ npm install
$ export NODE_ENV=dev
$ npm run serve
```

### Production

To deploy the app on an Ubuntu server (other distributions should work too, with adjustments):

1. [Install Node.js](https://github.com/nodesource/distributions/blob/master/README.md)
2. [Install the Angular CLI](https://angular.io/cli)
3. [Install MongoDB Community Edition](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)

```console
$ (cd frontend && npm install)
$ (cd backend && npm install)
$ chmod +x deploy.sh
$ ./deploy.sh
```

## Running tests

To run backend unit tests:

```console
$ cd backend
$ npm run test
```

You can also use `npm run -- --watch` to run the unit tests in watch mode.

To run frontend unit tests

```console
$ cd frontend
$ npm run test
```