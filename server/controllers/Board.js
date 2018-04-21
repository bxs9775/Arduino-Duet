// const delay = require('delay');
const five = require('johnny-five');

const Board = (function () {
  // let ready = false;
  const board = new five.Board();

  board.on('ready', () => {
    // ready = true;
    const led = new five.Led(2); // pin 2
    led.toggle();
  });

  return {};
}());

module.exports = Board;
