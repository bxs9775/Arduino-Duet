'use strict';

/* Other */
var info = {
  connected: false,
  duration: 1000 / 2,
  noteMap: ['C4', 'D4', 'E4', 'F4', 'G4']
};

var displayInfo = function displayInfo(info) {
  var infoDisp = document.querySelector("#info");
  infoDisp.textContent = info;
};

var siteLoop = function siteLoop() {
  getBoardStatus();
  getNotes();
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
var toggleLed = function toggleLed() {
  sendReq('POST', '/board/toggleLed', '', function () {
    displayInfo('Led has toggled.');
  });
};

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
  });
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
  var ledButton = document.querySelector("#ledButton");
  ledButton.addEventListener("click", toggleLed);
  window.setInterval(siteLoop, info.duration);
};

window.onload = setup;
