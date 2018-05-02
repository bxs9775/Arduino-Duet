/* Other */
const info = {
  connected: false,
  duration: (1000 / 2),
  noteMap: ['C4','D4','E4','F4','G4'],
  prevNotes: [false,false,false,false], 
  prevKeys: [false,false,false,false,false],
}

const displayInfo = function (info) {
  const infoDisp = document.querySelector("#info");
  infoDisp.textContent = info;
};

const siteLoop = function(){
  getBoardStatus();
  getNotes();
}

const playNote = function(index){
  const duration = (info.duration)/1000;
  
  info.synth.triggerAttackRelease(info.noteMap[index],duration);
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
    //console.log(`Duration: ${duration}`);
    for(let i = 0; i < 5; i++){
      if(response.notes[i] && !info.prevNotes[i]){
        playNote(i);
      }
    }
    info.prevNotes = response.notes;
  });
};

const playNoteAndSend = function(index){
  playNote(index);
  
  //Note dispay code...
  
  sendReq('POST', '/board/playNote', `note=${index}`, function(){
  });
}

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
  
  info.synth = new Tone.Synth().toMaster();
  
  const handleKeyDown = function(index){
    if(!info.prevKeys[index]){
      playNoteAndSend(index);
    }
    info.prevKeys[index] = true;
  }
  const handleKeyUp = function(index){
    info.prevKeys[index] = false;
  }
  
  document.addEventListener("keydown", function(e){
    //console.log(`Event: ${e.key}`);
    console.dir(info.prevKeys);
    switch(e.key){
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
  
  document.addEventListener("keyup", function(e){
    //console.log(`Event: ${e.key}`);
    switch(e.key){
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
}

window.onload = setup;