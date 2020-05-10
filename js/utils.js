
/* A very simple class, keeps this junky code out of your normal game class */
class InputBar{
  constructor(domSelector, onValueChange){
    var element = document.querySelector(domSelector);

    element.addEventListener('keyup', function(e){
      if(e.key === 'Enter'){
        //- send the input back to the game
        onValueChange(element.value);

        //- clear the input after hitting enter
        element.value = '';
      }
    });
  }
}

/* Utilities */
function Log(message, detail){
  console.log(`>> ${message}`);
  if(detail){
    console.log('>>:', detail)
  }
}

/*
  Don't dig too much in this, just notice that it is loading a JSON file, and at some point calling
  the "callback" that we passed to it, with whatever JSON data was parsed in
*/
function LoadData(url, callback){
  Log(`loading data ${url}...`);
  var instance = this;
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url);
  xhr.send(null);

  xhr.onreadystatechange = function () {
    var DONE = 4; // readyState 4 means the request is done.
    var OK = 200; // status 200 is a successful return.
    try{
      if (xhr.readyState === DONE) {
        if (xhr.status === OK) {
          Log(`...data was loaded!`);
          //- the response is just text, so parse it into a JSON object
          var gameData = JSON.parse(xhr.responseText);
          callback(gameData);
        } else {
          console.error(`Error loading data from ${url}. Perhaps the file is not found?: `, xhr.status); // An error occurred during the request.
        }
      }
    }catch(e){
      console.error(`Error loading data from ${url}. Perhaps the JSON is malformed?`, e);
    }
  };
}
