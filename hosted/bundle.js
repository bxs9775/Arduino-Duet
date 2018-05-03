'use strict';

/* Other */
var info = {
  connected: false,
  duration: 1000 / 2,
  noteMap: ['C4', 'D4', 'E4', 'F4', 'G4'],
  prevNotes: [false, false, false, false],
  prevKeys: [false, false, false, false, false]
};

var displayInfo = function displayInfo(info) {
  var infoDisp = document.querySelector("#info");
  infoDisp.textContent = info;
};

var siteLoop = function siteLoop() {
  getBoardStatus();
  getNotes();
};

var playNote = function playNote(index) {
  var duration = info.duration / 1000;

  info.synth.triggerAttackRelease(info.noteMap[index], duration);
};

// Basic ajax request handling based of lessons from Rich Media II
var sendReq = function sendReq(type, url, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: url,
    data: data,
    dataType: 'json',
    success: success,
    failure: function failure(xhr, status, error) {
      console.log(error);
      displayInfo('An error has occured.');
    }
  });
};

/* Event Handling */
var getNotes = function getNotes() {
  sendReq('GET', '/board/notes', '', function (response) {
    if (response.error) {
      displayInfo(response.error);
      return;
    }
    if (!response.notes) {
      return;
    }

    ReactDOM.render(React.createElement(NoteList, { notes: response.notes }), document.querySelector('#notesFromBoard'));
    ReactDOM.render(React.createElement(NoteList, { notes: info.prevKeys }), document.querySelector('#notesFromBrowser'));
    for (var i = 0; i < 5; i++) {
      if (response.notes[i] && !info.prevNotes[i]) {
        playNote(i);
      }
    }
    info.prevNotes = response.notes;
  });
};

var playNoteAndSend = function playNoteAndSend(index) {
  playNote(index);

  //Note dispay code...

  sendReq('POST', '/board/playNote', 'note=' + index, function () {});
};

var getBoardStatus = function getBoardStatus() {
  var statusArea = document.querySelector("#connectionStatus");
  sendReq('GET', '/board/status', '', function (response) {
    if (response.error) {
      displayInfo(response.error);
      statusArea.textContent = "An unknown error has occured.";
      return;
    }
    if (!response.status) {
      statusArea.textContent = "Status missing...";
      return;
    }
    statusArea.textContent = response.status;
  });
};

/*React*/
var NoteList = function NoteList(props) {
  var notes = props.notes.map(function (note, index) {
    if (note) {
      return React.createElement(
        'div',
        { className: 'note' },
        info.noteMap[index]
      );
    }
    return React.createElement(
      'div',
      { className: 'noNote' },
      '__'
    );
  });
  return React.createElement(
    'div',
    null,
    notes
  );
};

/*Setup*/
var setup = function setup() {
  window.setInterval(siteLoop, info.duration);

  info.synth = new Tone.Synth().toMaster();

  var handleKeyDown = function handleKeyDown(index) {
    if (!info.prevKeys[index]) {
      playNoteAndSend(index);
    }
    info.prevKeys[index] = true;
  };
  var handleKeyUp = function handleKeyUp(index) {
    info.prevKeys[index] = false;
  };

  document.addEventListener("keydown", function (e) {
    //console.log(`Event: ${e.key}`);
    //console.dir(info.prevKeys);
    switch (e.key) {
      case "1":
        handleKeyDown(0);
        break;
      case "2":
        handleKeyDown(1);
        break;
      case "3":
        handleKeyDown(2);
        break;
      case "4":
        handleKeyDown(3);
        break;
      case "5":
        handleKeyDown(4);
        break;
    }
  });

  document.addEventListener("keyup", function (e) {
    //console.log(`Event: ${e.key}`);
    switch (e.key) {
      case "1":
        handleKeyUp(0);
        break;
      case "2":
        handleKeyUp(1);
        break;
      case "3":
        handleKeyUp(2);
        break;
      case "4":
        handleKeyUp(3);
        break;
      case "5":
        handleKeyUp(4);
        break;
    }
  });
};

window.onload = setup;
