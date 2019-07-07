const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(__dirname + '/dist/weatherapp/index.html'));

app.listen(process.env.PORT || 8080);
