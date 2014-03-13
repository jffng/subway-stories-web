var context = null;
var storyGainNode = null;

$(document).ready(function() {
	initAudio();
});

function initAudio(){
	console.log('initaudio');
	var storyURIs = [];
	context = new AudioContext();

	storyGainNode = context.createGain();
	storyGainNode.connect(context.destination);

	for(var i = 0; i < 4; i++){
		storyURIs[i] = '/sounds/'+i+'.mp3';
	}
}

function createAudio(buffer) {
	var source = context.createBufferSource();
	//create a gain node
	var gainNode = context.createGain();
	source.buffer = buffer;
	source.loop = true;
	//connect source to gain
	source.connect(gainNode);
	gainNode.connect(storyGainNode);

	return{
		source: source,
		gainNode: gainNode
	};
}

function loadAudio(url, index) {
	var request = new XMLHTTPRequest();
	request.open('GET', url, true);
	request.responseType 'arraybuffer';

	// decode asynchronously
	request.onload = function() {
		context.decodeAudioData(request.response, function(buffer){
			storyBuffer[index] = buffer;
			numLoaded++;
		}, onError);
	}
	request.send();


}