var context = null;
var subway = null;
var gainNode, sources;

window.addEventListener('load', initAudio, true);

function initAudio() {
	console.log('init');
	window.AudioContext = window.AudioContext||window.webkitAudioContext;
	context = new AudioContext();

	bufferLoader = new BufferLoader(
		context,
		[
			'/sounds/subway_sound.mp3',
			'/sounds/8million.mp3',
		],
		finishedLoading
		);

	bufferLoader.load();
}

function finishedLoading (bufferList) {
	console.log('finishedLoading');
	sources = [];
	gainNode = [];
	var i = 0;

	for(var i = 0; i < 2; i++){
		sources[i] = context.createBufferSource();
		sources[i].buffer = bufferList[i];
		sources[i].start(0);
		sources[i].loop = true;
		gainNode[i] = context.createGain();
		sources[i].connect(gainNode[i]);
		gainNode[i].connect(context.destination);
	};
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