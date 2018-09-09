// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';

// Express Engine
import { ngExpressEngine } from '@nguniversal/express-engine';

// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import { Application } from 'express';

/**
 * Use Angular-Universal to deliever our app.
 */
export class AngularApp {
  init(app: Application) {
    enableProdMode();

    const DIST_FOLDER = join(__dirname, 'dist');

    const {
      AppServerModuleNgFactory,
      LAZY_MODULE_MAP
    } = require('./dist/server/main');

    // Our index.html we'll use as our template
    const template = readFileSync(
      join(DIST_FOLDER, 'browser', 'index.html')
    ).toString();

    app.engine(
      'html',
      ngExpressEngine({
        bootstrap: AppServerModuleNgFactory,
        providers: [provideModuleMap(LAZY_MODULE_MAP)]
      })
    );

    app.set('view engine', 'html');
    app.set('views', join(DIST_FOLDER, 'browser'));

    // Server static files from /browser
    app.get('*.*', express.static(join(DIST_FOLDER, 'browser')));

    // All regular routes use the Universal engine
    app.get('*', (req, res) => {
      res.render('index', { req });
    });
  }
}

export default new AngularApp();
