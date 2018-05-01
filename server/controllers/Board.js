// const delay = require('delay');
const five = require('johnny-five');

// const helpers = require('../helpers');

// console.dir(helpers);

// const { pitches } = helpers;
const { Piezo } = five;
const { Button } = five;

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

  // buttons
  let buttons = [];

  // keeping track of what was pressed
  // const pressedCurr = [false, false, false, false, false];
  // const pressedLast = [false, false, false, false, false];

  // const input = [0, 0, 0, 0, 0];

  const numNotes = 5;
  // const threshhold = 22;
  // const isHigh = true;


  // plays the note at the given index
  const playNote = function (index, speaker) {
    console.log(`Play note #${index}!`);
    console.log(`Play ${notes[index]} for ${noteDuration}`);
    speaker.frequency(notes[index], noteDuration);
  };

  /*
  const loop = function () {
  };
  */

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

    led = new five.Led(4); // led pin
    speaker1 = new Piezo(3);

    led.toggle();
    // delay(500, loop);

    buttons = [
      new Button(5),
      new Button(7),
      new Button(9),
      new Button(11),
      new Button(13),
    ];
    const press = (i) => {
      console.log(`Button ${i} is pressed.`);
      playNote(i, speaker1);
    };

    for (let i = 0; i < numNotes; i++) {
      buttons[i].on('press', () => press(i));
    }
  });

  return {
    toggleLed,
    getNote,
  };
}());

module.exports = Board;
