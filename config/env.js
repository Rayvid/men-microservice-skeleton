const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const secretEnv = process.env.ENV_FILE || '/run/secrets/env';
const secretPath = path.resolve(secretEnv);

if (fs.existsSync(secretPath)) {
  dotenv.config({ path: secretPath });
} else if (!process.env.NODE_ENV || process.env.NODE_ENV !== 'production') {
  dotenv.config({ path: path.resolve('dev.env') });
}
