var five = require('johnny-five');

(function() {
  let boardReady = false;
  //
  let led = {}; 
  
  const setup = function(){
    let board = new five.Board();
    
    board.on('ready', function() {
      boardReady = true;
      const boardStatus = document.querySelector("#arduinoStatus");
      boardStatus.textContent = "Ready.";
      led = new five.Led(2);
    });
    
    let ledButton = document.querySelector("#ledButton");
    ledButton.addEventListener('click', function(){
      led.toggle();
    });
  };
  
  window.onload = setup;
})();