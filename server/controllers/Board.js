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

  const buttonDown = [false, false, false, false, false];

  const numNotes = 5;
  // const threshhold = 22;
  // const isHigh = true;

  /* Server calls */
  const getNotes = (request, response) => response.status(200).json({ notes: buttonDown });

  const getStatus = (request, response) => {
    if (!board) {
      return response.status(200).json({ status: 'Not Found' });
    }
    if (!ready) {
      return response.status(200).json({ status: 'Connected, Not Ready' });
    }
    return response.status(200).json({ status: 'Connected, Ready' });
  };

  const toggleLed = (request, response) => {
    const res = response;

    if (!ready) {
      return res.status(503).json({ error: 'Service Unavailable: Board not ready.' });
    }
    led.toggle();
    return res.status(200).json({ message: 'Led toggled...' });
  };

  /* Other functions */
  // plays the note at the given index
  const playNote = function (index, speaker) {
    console.log(buttonDown);
    console.log(`Play note #${index}!`);
    console.log(`Play ${notes[index]} for ${noteDuration}`);
    speaker.frequency(notes[index], noteDuration);
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
      buttonDown[i] = true;
      playNote(i, speaker1);
    };
    const release = function (i) {
      buttonDown[i] = false;
    };

    for (let i = 0; i < numNotes; i++) {
      buttons[i].on('press', () => press(i));
      buttons[i].on('release', () => release(i));
    }
  });

  return {
    toggleLed,
    getStatus,
    getNotes,
  };
}());

module.exports = Board;
