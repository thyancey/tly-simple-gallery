const INPUT_DEBOUNCE = 300;

/* A very simple class, keeps this junky code out of your normal game class */
class InputBar{
  constructor(domSelector, type, onValueChange, onKeywordsChange){
    var element = document.querySelector(domSelector);
    this._el = element;
    this._type = type;
    this._onKeywordsChange = onKeywordsChange;
    this._onValueChange = onValueChange;
    this._onInputTimer = null;

    this._el.addEventListener('keyup', this.onChange.bind(this));
  }

  onChange(){
    this.startInputTimer();
  }

  onInputTimer(){
    this._onValueChange(this._el.value, this._type);
    if(!this._el.value || !this._el.value.trim()){
      this._onKeywordsChange([]);
    }else{
      this._onKeywordsChange(this._el.value.split(' '));
    }
  }

  startInputTimer(){
    this.killInputTimer();
    this._inputTimer = window.setTimeout(() => {
      this.onInputTimer();
    }, INPUT_DEBOUNCE);
  }

  killInputTimer(){
    if(this._inputTimer){
      window.clearTimeout(this._inputTimer);
      this._inputTimer = null;
    }
  }

  clear(){
    this._el.value = '';
    this._onKeywordsChange([]);
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



class Item{
  constructor(data, assetRoute){
    if(!data || !data.file){
      console.error('item data missing or requires a value for "file"');
      return;
    }
    
    if(data.file[0] === '/'){
      if(!assetRoute){
        console.error('files starting with "/" require an assetRoute');
        return null;
      }
      this._url = assetRoute + data.file;
    }else{
      this._url = data.file;
    }

    this._alt = data.alt || null;
    this._meta = data.meta ? data.meta.split(' ') : [];
    this._name = data.file;
    this._el = null;
  }

  onClick(e){
    this.copyText(this._url);
  }

  copyText(copyText){
    const copyInput = document.getElementById('copy-helper');
    copyInput.value = copyText;
    copyInput.select();
    copyInput.setSelectionRange(0, 99999); /*For mobile devices*/
  
    /* Copy the text inside the text field */
    document.execCommand('copy');
  }

  getScore(searchKeywords, filterKeywords){
    let filteredOut = false;
    filterKeywords.forEach(fk => {
      if(this._meta.indexOf(fk) === -1){
        filteredOut = true;
      }
    });

    let score = 0;
    if(filteredOut && filterKeywords.filter(m => this._name.indexOf(m) > -1).length === 0){
      return -1;
    }else{
      score += this._meta.filter(m => searchKeywords.indexOf(m) > -1).length;
      score += searchKeywords.filter(m => this._name.indexOf(m) > -1).length;
      return score;
    }
  }

  render(searchKeywords, filterKeywords){
    const score = this.getScore(searchKeywords, filterKeywords);
    if(score < 0) return null;

    if(!this._el){
      this._el = document.createElement('li');
      this._el.className = 'gallery-item';
      this._el.addEventListener('click', () => this.onClick());
    }


    const metaChildren = this._meta.map(m => {
      
      if(filterKeywords.indexOf(m) > -1){
        return `<li class="meta-filter">${m}</li>` 
      }
      else if(searchKeywords.indexOf(m) > -1){
        return `<li class="meta-search">${m}</li>` 
      }
      else{
        return `<li class="meta-none">${m}</li>` 
      }
    });
    
    let nameClass;
    if(filterKeywords.filter(m => this._name.indexOf(m) > -1).length > 0){
      nameClass = 'name-filter';
    }else if(searchKeywords.filter(m => this._name.indexOf(m) > -1).length > 0) {
      nameClass = 'name-search';
    }else{
      nameClass = 'name-none'
    }
    this._el.innerHTML = `
      <img src="${this._url}" alt="${this._alt || ''}" />
      <p class="${nameClass}">${this._name}</p>
      <ul class="gallery-meta">
        ${metaChildren.join(' ')}
      </ul>
    `
    return {
      html: this._el,
      score: score
    }
  }
}
