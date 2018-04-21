'use strict';

/* Other */
var displayInfo = function displayInfo(info) {
  var infoDisp = document.querySelector("#info");
  infoDisp.textContent = info;
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

/*Setup*/
var setup = function setup() {
  var ledButton = document.querySelector("#ledButton");
  ledButton.addEventListener("click", toggleLed);
};

window.onload = setup;
