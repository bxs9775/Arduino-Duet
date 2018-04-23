// Javascript code based on the Capacitive Sensor library by Paul Stoffregen
const five = require('johnny-five');

const CapactiveSensor = function (board, pin1, pin2) {
  this.sendPin = new five.Pin({
    pin: pin1,
    type: 'digital',
    mode: five.Pin.OUTPUT,
  });
  this.recievePin = new five.Pin({
    pin: pin2,
    type: 'digital',
    mode: five.Pin.INPUT,
  });

  const read = () => {
    sendPin.high();
    const x = 0;
    const y = 0;
  };
};
