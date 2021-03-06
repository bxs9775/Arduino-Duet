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
  const board = new five.Board({ port: 'COM3' });

  let speaker1 = {};

  // notes
  const noteDuration = 1000 / 2;
  const notes = [
    Piezo.Notes.c4, Piezo.Notes.d4, Piezo.Notes.e4, Piezo.Notes.f4, Piezo.Notes.g4,
  ];

  // buttons
  let buttons = [];

  const buttonDown = [false, false, false, false, false];

  const numNotes = 5;

  /* Other functions */
  // plays the note at the given index
  const playNote = function (index, speaker) {
    speaker.frequency(notes[index], noteDuration);
  };

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

  const playNoteFromBrowser = (request, response) => {
    const req = request;
    const res = response;

    if (!ready) {
      return res.status(503).json({ error: 'Service Unavailable: Board not ready.' });
    }
    if (!req.body.note) {
      return res.status(400).json({ error: '"Note" required.' });
    }
    if (req.body.note < 0 || req.body.note > 4) {
      return res.status(400).json({ error: 'Note is out of range.' });
    }
    return playNote(req.body.note, speaker1);
  };


  board.on('ready', () => {
    ready = true;

    speaker1 = new Piezo(3);

    buttons = [
      new Button(5),
      new Button(7),
      new Button(9),
      new Button(11),
      new Button(13),
    ];
    const press = (i) => {
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
    playNoteFromBrowser,
    getStatus,
    getNotes,
  };
}());

module.exports = Board;
