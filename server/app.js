const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressHandlebars = require('express-handlebars');

// sets the port for the server to use
const port = process.env.PORT || process.env.NODE_PORT || 3000;


// router and app
const router = require('./router.js');

const app = express();

// load in assets
app.use('/assets', express.static(path.resolve(`${__dirname}/../hosted/`)));

// favicon
app.use(favicon(`${__dirname}/../hosted/img/favicon.png`));

// security
app.disable('x-powered-by');

// compression and parsing
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// views
app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);

// cookies
app.use(cookieParser());

// set up router
router(app);

app.listen(port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
