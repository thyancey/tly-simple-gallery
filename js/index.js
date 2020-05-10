//- InputBar from './utils.js'
//- Log from './utils.js'
//- LoadData from './utils.js'

/* 
  Although this class will get much more complicated, it is relatively short for now
  Look at the InputBar and especially Player classes below to see some tips about using
  Classes in JS

  The actual start of the game kicks off near the bottom of the page, in the "setData"
  function.
*/
class Main{
  constructor(){
    Log('the main instance has been instantiated!');
    this._ready = false;
    this._data = null;

    this._inputBar = new InputBar('#user-input', this.receiveInput);
  }
  
  reset(){
    Log('main.reset()');
  }
  onReady(){
    Log('instance is ready!', this._data);
    this._ready = true;
  }

  setData(data){
    this._data = data;
    this.onReady();
  }

  logData(){
    Log('Here is the data:', this._data);
  }

  receiveInput(inputText){
    Log('received input: ', inputText);
  }
}


/* 
  These three functions are not defined in a class. They exist in the global scope, they can
  be called from anywhere. In general, this is messy, but it is simple
*/


//since this is global, you can open the developer console in chrome, and enter "main.logData();"
var main;

/*
  These are uh, lets call them "global click handlers". If you look at index.html, you will see
  the buttons calling these directly. Eventually, this is a little messy, but its very simple
  and easy to use for right now
*/
function onGlobalButton(arg){
  Log('global button clicked', arg);
}


/*
  Do not worry about this too much now, just know that the addListener for 'load' is important to make sure
  the webpage is ready before you start running this specific JS code

  "when the browser says it's ready, start the program"
  
  Some of the function calls are "asynchronous", you cant rely on your code executing in order, line-by-line here,
  any amount of time could pass between when you request the file and when you receive it, in the meantime, the rest
  of your code will be executing without this stuff
*/
window.addEventListener('load', setupMain);

function setupMain(){
  main = new Main();
  LoadData('./data/data.json', function(data){
    main.setData(data);
  });
}