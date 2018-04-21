/* Other */
const displayInfo = function (info) {
  const infoDisp = document.querySelector("#info");
  infoDisp.textContent = info;
};

// Basic ajax request handling based of lessons from Rich Media II
const sendReq= (type, url, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: url,
    data: data,
    dataType: 'json',
    success: success,
    failure: function (xhr,status, error) {
      console.log(error);
      displayInfo('An error has occured.');
    }
  });
};

/* Event Handling */    
const toggleLed = function(){
  sendReq('POST', '/board/toggleLed', '', function(){
    displayInfo('Led has toggled.');
  });
};

/*Setup*/
const setup = function(){
  const ledButton = document.querySelector("#ledButton");
  ledButton.addEventListener("click", toggleLed);
}

window.onload = setup;