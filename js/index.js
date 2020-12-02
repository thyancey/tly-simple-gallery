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

const GALLERY_SELECTOR = '.gallery ul';

class Main{
  constructor(){
    Log('the main instance has been instantiated!');
    this._ready = false;
    this._data = null;
    this._items = [];

    this._searchKeywords = [];
    this._filterKeywords = [];

    this._inputFilter = new InputBar('#filter-input', 'filter', this.receiveInput, this.receiveFilterKeywords.bind(this));
    this._inputSearch = new InputBar('#search-input', 'search', this.receiveInput, this.receiveSearchKeywords.bind(this));
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
    this.makeItems(this._data.items, this._data.info.assetRoute);
    this.onReady();
  }

  clearTerms(){
    this._inputFilter.clear();
    this._inputSearch.clear();
  }

  makeItems(itemDataList, assetRoute){
    // let element = document.querySelector(domSelector);
    this._items = [];

    itemDataList.forEach(itemData => {
      this._items.push(new Item(itemData, assetRoute));
    });

    this.renderItems();
  }

  renderItems(){
    const element =  document.querySelector(GALLERY_SELECTOR);
    element.innerHTML = '';

    let renderedItems = this._items.map(item => {
      const result = item.render(this._searchKeywords, this._filterKeywords);
      if(result) return result;
    });
    renderedItems.sort((a,b) => b.score - a.score).forEach(h => {
      h && element.append(h.html)
    })
  }
  

  logData(){
    Log('Here is the data:', this._data);
  }

  receiveInput(inputText, type){
    // Log(`received input from ${type}: `, inputText);
  }

  receiveSearchKeywords(keywordList){
    // Log(`received search keywords: `, keywordList);
    this._searchKeywords = keywordList;
    
    this.renderItems();
  }

  receiveFilterKeywords(keywordList){
    // Log(`received filter keywords: `, keywordList);
    this._filterKeywords = keywordList;

    this.renderItems();
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

  if(arg === 'clearTerms'){
    main.clearTerms();
  }
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