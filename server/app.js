const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const url = require('url');

//sets the port for the server to use
const port = process.env.PORT || process.env.NODE_PORT || 3000;

//set up redis
let redisURL = {
  hostname: 'localhost',
  port: 6379,
};

let redisPASS;

if(process.env.REDISCLOUD_URL){
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPASS = redisURK.auth.split(':')[1];
}

//router and app
const router = require('./router.js');
const app = express();

//favicon
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));

//security
app.disable('x-powered-by');

//compression and parsing
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

/*Should I add session?*/

//views
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

//cookies
app.use(cookieParser());

//set up router
router(app);

app.listen(port, (err) => {
  if(err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});