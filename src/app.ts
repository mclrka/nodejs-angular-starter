import * as express from 'express';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';
import * as path from 'path';

import db from './db';
import auth from './auth';
import socialAuth from './social-auth';
import config from './config';
import ngApp from './ng-app';

// App class will encapsulate our web server.
export class App {
  express: express.Application;
  mongoose;

  constructor() {}

  init(port: string | number, ready?: () => void) {
    this.express = express();

    console.log(`Connecting to database...`);

    db.init(() => {
      this.mountPreMiddlewares();
      this.mountRoutes();

      if (!config.DEBUG_MODE) ngApp.init(this.express);
      this.mountPostMiddlewares();

      this.express.listen(port);
      console.log(`Server is now listening on port ${port}...`);
      ready && ready();
    });
  }

  private mountPreMiddlewares(): void {
    // parse application/x-www-form-urlencoded
    this.express.use(bodyParser.urlencoded({ extended: false }));

    // Allow parsing JSON data obtained from post
    this.express.use(bodyParser.json());

    // TODO: Fix according to the environment
    this.express.use(morgan('dev'));

    auth.init(this.express);
    socialAuth.init(this.express);
  }

  private mountPostMiddlewares(): void {}

  private mountRoutes(): void {
    this.express.use('/api', require('./api/routes'));
  }
}

// The express instance is reachable through the public express property.
export default new App();
