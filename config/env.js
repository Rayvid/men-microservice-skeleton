const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const secretEnv = process.env.ENV_FILE || '/run/secrets/env';
const secretPath = path.resolve(secretEnv);

if (process.env.NODE_ENV !== 'production') {
  try {
    dotenv.config({ path: path.resolve('./dev.env') });
    // eslint-disable-next-line no-console
    console.log('INFO: dev config loaded, shouldn\'t happen on prod!');
  } catch (err) {
    // Ignore that, really
  }
}

if (fs.existsSync(secretPath)) {
  dotenv.config({ path: secretPath });
}
