var context = null;
var gainNode = [];

initAudio = function (argument) {
  console.log('init');
  window.AudioContext = window.AudioContext||window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
    'sounds/subway_sound.mp3',
    'sounds/fried_chicken_final.mp3',
    'sounds/david_news.mp3',
    'sounds/sotired.mp3',
    ],
    finishedLoading
    );

  bufferLoader.load();
} 

finishedLoading = function (bufferList) {
  console.log('finishedLoading');
  var sources = [];

  for(var i = 0; i < 4; i++){
    sources[i] = context.createBufferSource();
    sources[i].buffer = bufferList[i];
    sources[i].start(0);
    sources[i].loop = true;
    gainNode[i] = context.createGain();        
    sources[i].connect(gainNode[i]);
    gainNode[i].connect(context.destination);
  };
}

updateAudio = function() {
    // var subwayGain = Math.max((200 + camera.position.z) / 2200, .2);
    // gainNode[0].gain.value = subwayGain;
    // gainNode[1].gain.value = 1 - subwayGain; 

    var pos = ( ( camera.position.x + 1000 ) / 2000 ) * 4;
    for(var i = 0; i < 4; i++){
      if(i - pos >= 0 && i - pos < 1){
        var x = i - pos;
        if (i>0){gainNode[i-1].gain.value = (1 - x);}
        gainNode[i].gain.value = x;
        gainNode[i+1].gain.value = (1-x);
      }
    }
  }


// BUFFER LOADER CLASS
function BufferLoader(context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
}

BufferLoader.prototype.loadBuffer = function(url, index) {
  // Load buffer asynchronously
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function() {
    // Asynchronously decode the audio file data in request.response
    loader.context.decodeAudioData(
      request.response,
      function(buffer) {
        if (!buffer) {
          alert('error decoding file data: ' + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length)
          loader.onload(loader.bufferList);
      },
      function(error) {
        console.error('decodeAudioData error', error);
      }
      );
  }

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  for (var i = 0; i < this.urlList.length; ++i)
    this.loadBuffer(this.urlList[i], i);
}