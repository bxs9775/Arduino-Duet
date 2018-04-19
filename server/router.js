const controllers = require('./controllers');

const router = (app) => {
  app.get('/', controllers.Views.getBrowser);
  app.get('/arduino', controllers.Views.getArduino);
  app.get('/note', controllers.Notes.getNote);
  app.post('/note', controllers.Notes.postNote);
  app.get('/*', controllers.Views.getNotFound);
};

module.exports = router;
