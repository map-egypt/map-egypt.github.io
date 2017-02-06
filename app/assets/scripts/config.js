'use strict';
import { clone, defaultsDeep } from 'lodash';

/*
 * App configuration.
 *
 * Uses settings in config/production.js, with any properties set by
 * config/staging.js or config/local.js overriding them depending upon the
 * environment.
 *
 * This file should not be modified.  Instead, modify one of:
 *
 *  - config/production.js
 *      Production settings (base).
 *  - config/staging.js
 *      Overrides to production if ENV is staging.
 *  - config/local.js
 *      Overrides if local.js exists.
 *      This last file is gitignored, so you can safely change it without
 *      polluting the repo.
 */

import base from './config/base';
import develop from './config/develop';
import production from './config/production';

const config = clone(base);

if (process.env.DS_ENV === 'development') {
  defaultsDeep(config, develop);
} else {
  defaultsDeep(config, production);
}

module.exports = config;
