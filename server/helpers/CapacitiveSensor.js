// Javascript code based on the CapSense.pde example by Paul Stoffregen
const five = require('johnny-five');

const CapacitiveSensor = (board, pin1, pin2) => {
  this.sendPin = new five.Pin({
    pin: pin1,
    type: 'digital',
    // mode: five.Pin.OUTPUT,
  });

  this.recievePin = new five.Pin({
    pin: pin2,
    type: 'digital',
    // mode: five.Pin.INPUT,
  });

  // smoothing filter
  // this.accum = 0;
  // this.fout = 0;
  // this.fval = 0.2; // fval of 1 = no filter - .0001 = max filter

  // stores data
  const lowChecked = [false, false, false, false];
  const highChecked = [false, false, false, false];
  const lowTimes = [0, 0, 0, 0];
  const highTimes = [0, 0, 0, 0];

  const resetArrays = function () {
    lowChecked.fill(false);
    highChecked.fill(false);
    lowTimes.fill(0);
    highTimes.fill(0);
  };

  const sum = function (num1, num2) {
    return (num1 + num2);
  };

  const calcValue = function (callback) {
    const x = highTimes.reduce(sum);
    const y = lowTimes.reduce(sum);

    // Smoothing function from CapSense.pde
    // this.fout = (this.fval * x) + ((1 - this.fval) * this.accum);
    // this.accum = this.fout;

    const total = x + y;

    callback(this, total);
  };

  const updateTime = function (startTime, index, highBool, callback) {
    const finalTime = Date.now() - startTime;
    const times = (highBool) ? highTimes : lowTimes;
    const checked = (highBool) ? highChecked : lowChecked;

    times[index] = finalTime;
    checked[index] = true;

    if (!lowChecked.contains(false) && !highChecked.contains(false)) {
      calcValue(callback);
    }
  };

  const read = (callback) => {
    resetArrays();

    // Take 4 readings in case of outliers
    for (let i = 0; i < 4; i++) {
      // Writes "HIGH" and measures latiency
      const highStart = Date.now();
      this.sendPin.high();
      this.recievePin.on('high', () => updateTime(highStart, i, true, callback));

      // Writes "Low" and measures latiency
      const lowStart = Date.now();
      this.sendPin.low();
      this.recievePin.on('low', () => updateTime(lowStart, i, false, callback));
    }
  };

  return {
    read,
  };
};

module.exports = CapacitiveSensor;
