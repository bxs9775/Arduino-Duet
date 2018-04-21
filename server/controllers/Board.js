// const delay = require('delay');
const five = require('johnny-five');

const Board = (function () {
  let ready = false;
  const board = new five.Board();
  let led = {};

  const toggleLed = (request, response) => {
    const res = response;

    if (!ready) {
      return res.status(503).json({ error: 'Service Unavailable: Board not ready.' });
    }
    led.toggle();
    return res.status(200).json({ message: 'Led toggled...' });
  };

  board.on('ready', () => {
    ready = true;
    led = new five.Led(2); // pin 2
    led.toggle();
  });

  return {
    toggleLed,
  };
}());

module.exports = Board;
