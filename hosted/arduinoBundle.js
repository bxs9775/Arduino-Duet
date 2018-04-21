'use strict';

var five = require('johnny-five');

(function () {
  var boardReady = false;
  //
  var led = {};

  var setup = function setup() {
    var board = new five.Board();

    board.on('ready', function () {
      boardReady = true;
      var boardStatus = document.querySelector("#arduinoStatus");
      boardStatus.textContent = "Ready.";
      led = new five.Led(2);
    });

    var ledButton = document.querySelector("#ledButton");
    ledButton.addEventListener('click', function () {
      led.toggle();
    });
  };

  window.onload = setup;
})();
"use strict";
