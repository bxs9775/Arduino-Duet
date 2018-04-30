// Javascript code based on the CapSense.pde example by Paul Stoffregen
const five = require('johnny-five');

/*
const readSensor = () => Math.abs(this.timeToHigh - this.timeToLow);

const updateSensor = (isHigh) => {
  console.log(`Pin ${this.recievePin.pin} - ${state}`);
  if(isHigh){
    this.timeToHigh = Date.now();
    
    this.sendPin.low();
  } else {
    this.timeToLow = Date.now();

    this.sendPin.high();
  }
  //this.recievePin.on(state, () => this.updateTimes(state));
};
*/

const CapacitiveSensor = function (board, pin1, pin2) {
  this.recievePin = new five.Pin({
    pin: pin1,
    type: 'digital',
    mode: five.Pin.INPUT,
  });
  
  this.sendPin = new five.Pin({
    pin: pin2,
    type: 'digital',
    mode: five.Pin.OUTPUT,
  });

  this.timeToHigh = 0;
  this.timeToLow = 0;
  
  //
  //this.updateTimes = (state) => {
  //  console.log(`Pin ${this.recievePin.pin} - ${state}`);
  //  if(state === 'high'){
  //    this.timeToHigh = Date.now();
  //    
  //    this.sendPin.low();
  //  } else if(state === 'low'){
  //    this.timeToLow = Date.now();
  //
  //    this.sendPin.high();
  //  }
  //   this.recievePin.on(state, () => this.updateTimes(state));
  //};
  //  
  /*
  this.recievePin.on('low', () => {
    console.log(`Pin ${this.recievePin.pin} - low`);
    this.timeToLow = Date.now();

    this.sendPin.high();
  });
  
  this.recievePin.on('high', () => {
    console.log(`Pin ${this.recievePin.pin} - high`);
    this.timeToHigh = Date.now();

    this.sendPin.low();
  });
  */
  this.checkLow = {};
  
  this.checkHigh = function(error,data){
    if(error){
      console.log(`Error - ${error}`);
    } else {
      console.log(`Pin ${this.recievePin.pin} - data = ${data}`)
      if(data === 1){
        console.log(`Pin ${this.recievePin.pin} - high`);
        this.timeToHigh = Date.now();
        this.sendPin.low();
        this.recievePin.read(this.checkLow.bind(this));
      } else {
        console.log(`Pin ${this.recievePin.pin} - NOT high`);
        this.recievePin.read(this.checkHigh.bind(this));
      }
    }
  };
  
  this.checkLow = function(error,data){
    if(error){
      console.log(`Error - ${error}`);
    } else {
      console.log(`Pin ${this.recievePin.pin} - data = ${data}`)
      if(data === 0){
        console.log(`Pin ${this.recievePin.pin} - low`);
        this.timeToLow = Date.now();
        this.sendPin.high();
        this.recievePin.read(this.checkHigh.bind(this));
      } else {
        console.log(`Pin ${this.recievePin.pin} - NOT low`);
        this.recievePin.read(this.checkLow.bind(this));
      }
    }
  };
  
  /*
  this.recievePin.on('data', (data) => {
    console.log(`Pin ${this.recievePin.pin} - data = ${data}`)
  
    if(data === 1){
      this.timeToHigh = Date.now();
    } else {
      this.timeToLow = Date.now();
    }
    
    //this.sendPin.write((data+1)%2)
  });
  */
  
  //this.recievePin.on('low', () => this.updateTimes('low'));
  //this.recievePin.on('high', () => this.updateTimes('high'));

  //this.sendPin.high();
  //this.sendPin.write(1);
  this.recievePin.read(this.checkLow.bind(this));

  this.read = () => Math.abs(this.timeToHigh - this.timeToLow);
  
  this.setLow = () => this.sendPin.low();
};


module.exports = CapacitiveSensor;
