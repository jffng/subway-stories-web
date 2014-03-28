var context = null;
var gainNode = [];
var audioLoaded;

initAudio = function () {
  console.log('initAudio');
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();
  bufferLoader = new BufferLoader(
    context,
    [
    'sounds/1.mp3',
    'sounds/2.mp3',
    'sounds/3.mp3',
    'sounds/4.mp3',
    'sounds/5.mp3',
    'sounds/6.mp3',
    'sounds/7.mp3',
    'sounds/8.mp3',
    'sounds/9.mp3',
    'sounds/10.mp3',
    'sounds/11.mp3',
    'sounds/12.mp3',
    'sounds/13.mp3',
    'sounds/14.mp3',
    'sounds/15.mp3',
    'sounds/16.mp3',
    'sounds/17.mp3',
    'sounds/18.mp3',
    'sounds/19.mp3',
    'sounds/20.mp3',
    'sounds/21.mp3',
    'sounds/22.mp3',
    'sounds/subway_sound.mp3'
    ],
    finishedLoading
    );
    
    bufferLoader.load();    
} 

finishedLoading = function (bufferList) {
  console.log('finishedLoading');
  audioLoaded = true;
  var sources = [];

  for(var i = 0; i < 23; i++){
    sources[i] = context.createBufferSource();
    sources[i].buffer = bufferList[i];
    sources[i].start(0);
    sources[i].loop = true;
    gainNode[i] = context.createGain();        
    sources[i].connect(gainNode[i]);
    gainNode[i].gain.value = 0;
    gainNode[i].connect(context.destination);
  };
}

updateAudio = function() {
    this.subwayGain = Math.max((150 + camera.position.z) / 2200, .2);
    gainNode[22].gain.value = this.subwayGain;

    //linearly interpolate between passenger story audio
    var pos = ( ( camera.position.x + 1300 ) / 2600 ) * 24;
    for(var i = 0; i < 22; i++){
      if(i - pos >= 0 && i - pos < 1){
        var x = i - pos;
        if (i>0){gainNode[i-1].gain.value = Math.cos((1 - x)*0.5*Math.PI) - this.subwayGain;}
        if (i>1){gainNode[i-2].gain.value = .2*Math.cos((1 - x)*0.5*Math.PI) - this.subwayGain;}
        gainNode[i].gain.value = Math.cos(x*0.5*Math.PI)- this.subwayGain;
        if (i!=21) gainNode[i+1].gain.value = Math.cos((1 - x)*0.5*Math.PI)- this.subwayGain;
        if (i!=20 && i!= 21){gainNode[i+2].gain.value = .2*Math.cos((1 - x)*0.5*Math.PI) - this.subwayGain;}
      }
      else{ gainNode[i].gain.value *= 0.05; }
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
      });
    };

  request.onerror = function() {
    alert('BufferLoader: XHR error');
  }

  request.send();
}

BufferLoader.prototype.load = function() {
  var self = this;
  for (var i = 0; i < this.urlList.length; ++i){
      self.loadBuffer(self.urlList[i], i);
  }
}