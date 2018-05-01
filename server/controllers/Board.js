// const delay = require('delay');
const five = require('johnny-five');

const helpers = require('../helpers');

// console.dir(helpers);

// const { pitches } = helpers;
const { CapacitiveSensor } = helpers;
const { Piezo } = five;

const Board = (function () {
  // board & board state
  let ready = false;
  // const board = new five.Board();
  const board = new five.Board({ port: 'COM3' });

  let led = {};
  let speaker1 = {};
  // let speaker2 = {};
  const currNote = -1;

  // pins
  // const speakerPin1 = 0; // audio out to speaker or amp
  // const ledPin = 0;
  // const photoPins = [3, 5, 6, 9, 10];

  // notes
  const noteDuration = 1000 / 2;
  const notes = [
    Piezo.Notes.c4, Piezo.Notes.d4, Piezo.Notes.e4, Piezo.Notes.f4, Piezo.Notes.g4,
  ];

  console.dir(CapacitiveSensor);

  // cap sensors
  /*
  const sensors = [
    CapacitiveSensor(board, 12, 13),
    CapacitiveSensor(board, 10, 11),
    CapacitiveSensor(board, 8, 9),
    CapacitiveSensor(board, 6, 7),
    CapacitiveSensor(board, 4, 5),
  ];
  */

  let sensors = [];

  // keeping track of what was pressed
  const pressedCurr = [false, false, false, false, false];
  const pressedLast = [false, false, false, false, false];

  const input = [0, 0, 0, 0, 0];

  const numNotes = 5;
  const threshhold = 22;
  // const isHigh = true;


  // plays the note at the given index
  const playNote = function (index, speaker) {
    console.log(`Play note #${index}!`);
    speaker.frequency(notes[index], noteDuration);
  };

  const loop = function () {
    // const notePlayed = false;
    // console.log('Count: ');
    // console.log(numNotes);

    for (let i = 0; i < numNotes; i++) {
      // sensors[i].setLow();
      pressedLast[i] = pressedCurr[i];

      // const start = Date.now();

      input[i] = sensors[i].read();
      console.log(`input ${i} = ${input[i]}`);
      if (input[i] >= threshhold) {
        playNote(i, speaker1);
      }

      // const timePassed = Date.now() - start;
      // console.log(`Performance: ${timePassed}`);
    }
    // delay(noteDuration).then(loop);
  };

  const getNote = (request, response) => response.status(200).json({ note: currNote });

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
    led = new five.Led(3); // led pin
    led.toggle();
    // delay(500, loop);

    sensors = [
      new CapacitiveSensor(12, 13),
      new CapacitiveSensor(10, 11),
      new CapacitiveSensor(8, 9),
      new CapacitiveSensor(6, 7),
      new CapacitiveSensor(4, 5),
    ];

    speaker1 = new Piezo('A0');

    // loop();
    board.loop(noteDuration, loop);
  });

  return {
    toggleLed,
    getNote,
  };
}());

module.exports = Board;
