const controllers = require('./controllers');

const router = (app) => {
  app.get('/', controllers.Views.getBrowser);
  app.get('/board/status', controllers.Board.getStatus);
  app.get('/board/notes', controllers.Board.getNotes);
  app.post('/board/playNote', controllers.Board.playNoteFromBrowser);
  app.post('/board/toggleLed', controllers.Board.toggleLed);
  app.get('/*', controllers.Views.getNotFound);
};

module.exports = router;
