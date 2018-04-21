const controllers = require('./controllers');

const router = (app) => {
  app.get('/', controllers.Views.getBrowser);
  app.get('/*', controllers.Views.getNotFound);
};

module.exports = router;
