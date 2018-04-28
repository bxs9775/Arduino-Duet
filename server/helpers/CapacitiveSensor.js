// Javascript code based on the CapSense.pde example by Paul Stoffregen
const five = require('johnny-five');

const CapacitiveSensor = function (board, pin1, pin2) {
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

  this.timeToHigh = 0;
  this.timeToLow = 0;

  this.recievePin.on('low', () => {
    console.log(`Pin ${this.recievePin.pin} - low`);
    this.timeToLow = Date.now();

    this.sendPin.high();
  });

  this.recievePin.on('high', () => {
    console.log(`Pin ${this.recievePin.pin} - high`);
    this.timeToHigh = Date.now();

    // this.sendPin.low();
    five.Pin.write(this.sendPin, 'low');
  });

  // this.sendPin.high();

  this.read = () => Math.abs(this.timeToHigh - this.timeToLow);
};

module.exports = CapacitiveSensor;
