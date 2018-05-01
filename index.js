const express = require('express');
const app = express();

require('dotenv').config();
const config = require('config');

app.listen(config.get('listen_on_port'), () => { console.log(`App listening on ${config.get('listen_on_port')}`); });