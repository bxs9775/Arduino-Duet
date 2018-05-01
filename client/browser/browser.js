/* Other */
const info = {
  connected: false,
  duration: (1000 / 2),
  noteMap: ['C4','D4','E4','F4','G4'],
}

const displayInfo = function (info) {
  const infoDisp = document.querySelector("#info");
  infoDisp.textContent = info;
};

const siteLoop = function(){
  getBoardStatus();
  getNotes();
}

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

const getNotes = function(){
  sendReq('GET', '/board/notes', '', function(response){
    if(response.error){
      displayInfo(response.error);
      return;
    }
    if(!response.notes){
      return;
    }
    
    ReactDOM.render(<NoteList notes={response.notes}/>,document.querySelector('#notesFromBoard'));
  });
};

const getBoardStatus = function(){
  const statusArea = document.querySelector("#connectionStatus");
  sendReq('GET', '/board/status', '', function(response){
    if(response.error){
      displayInfo(response.error);
      statusArea.textContent = "An unknown error has occured.";
      return;
    }
    if(!response.status){
      statusArea.textContent = "Status missing...";
      return;
    }
    statusArea.textContent = response.status;
  });
};

/*React*/
const NoteList = (props) => {
  const notes = props.notes.map((note,index) => {
    if(note){
      return (<div className='note'>{info.noteMap[index]}</div>);
    }
    return (<div className='noNote'>__</div>);
  });
  return (
    <div>
      {notes}
    </div>
  );
}

/*Setup*/
const setup = function(){
  const ledButton = document.querySelector("#ledButton");
  ledButton.addEventListener("click", toggleLed);
  window.setInterval(siteLoop,info.duration);
}

window.onload = setup;