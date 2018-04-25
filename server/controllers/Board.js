const delay = require('delay');
const five = require('johnny-five');
const pitches = require('../helpers/pitches.js');
const CapacitiveSensor = require('../helpers/CapacitiveSensor.js');

const Board = (function () {
  // board & board state
  let ready = false;
  // const board = new five.Board();
  const board = new five.Board({ port: 'COM3' });

  let led = {};
  const currNote = -1;

  // pins
  const speaker1 = 0; // audio out to speaker or amp
  const ledPin = 0;
  const photoPins = [3, 5, 6, 9, 10];

  // notes
  const noteDuration = 1000 / 2;
  const notes = [
    pitches.NOTE_A3, pitches.NOTE_B3, pitches.NOTE_C3, pitches.NOTE_D3, pitches.NOTE_E3,
  ];

  // cap sensors
  /*
  const sensors = [
    CapacitiveSensor(12,13),CapacitiveSensor(10,11),CapacitiveSensor(8,9),CapacitiveSensor(6,7),CapacitiveSensor(4,5)
  ];
  */

  // keeping track of what was pressed
  const pressedCurr = [false, false, false, false, false];
  const pressedLast = [false, false, false, false, false];

  const numNotes = 1;

  // plays the note at the given index
  const playNote = function (index, speaker, callback) {
    // play note
    tone(speaker, notes[index], noteDuration);

    delay(noteDuration, () => {
      noTone(speaker);
    });
  };

  /*
  const loop = function () {
    let notePlayed = false;
    let i = 0;
    const count = 1;
    console.print('Count: ');
    console.println(count);

    while (!notePlayed && i < count) {
      pressedLast[i] = pressedCurr[i];

      const start = Date.now();
      const input = 0; // sensors[i].capacitiveSensor(30);
      console.log(Date.now() - start); // check on performance in milliseconds
      console.print('\t'); // tab character for debug windown spacing

      console.println(`${i}: ${input}`); // print sensor output

      pressedCurr[i] = (input > 100);
      if (pressedCurr[i] && !pressedLast[i]) {
        playNote(i, speaker1, loop);
        notePlayed = true;
      }
      i++;
    }
    if (!notePlayed) {
      delay(noteDuration, loop);
    }
  };
  */

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
    led = new five.Led(12); // led pin
    led.toggle();
    // delay(500, loop);
    for (let i = 0; i < numNotes; i++) {
      const resistor = new five.Sensor({
        pin: photoPins[i],
        freq: noteDuration,
      });

      resistor.on('data', () => {
        console.log(`Sensor ${i} = ${resistor.value}`);
      });
    }
  });

  return {
    toggleLed,
  };
}());

module.exports = Board;
