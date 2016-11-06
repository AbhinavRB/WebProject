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

window.onload = init;
var context;
var bufferLoader;

function init() {
  // Fix up prefixing
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  context = new AudioContext();

  bufferLoader = new BufferLoader(
    context,
    [
      '../sounds/RockDrums.wav',
      '../sounds/Drums2.wav',
      '../sounds/Bass1.wav',
      '../sounds/Bass2.wav'
    ],
    finishedLoading
    );

  bufferLoader.load();
}
var source=[];
function finishedLoading(bufferList) {
  for (var i = 0; i < 4; i++) {

 	gainNode = context.createGain();
  	source[i]=context.createBufferSource();
  	source[i].buffer=bufferList[i];
  	source[i].gain=gainNode;
  	source[i].loop=true;
  	// source[i].gain.connect()
  	source[i].connect(gainNode);
  	gainNode.connect(context.destination);

  }
  // var buts=document.getElementsByClassName('playback');
  // for (var i =0; i <3; i++) {
  // 	buts[i].addEventListener('mouseover',play);
  // 	buts[i].addEventListener('mouseout',pauseit)

  // }
}
function play(noteId)
{
	 // Create two sources and play them both together.
 	// source[parseInt(evt.target.id)]=context.createBufferSource();
  // 	source[parseInt(evt.target.id)].buffer=evt.target.param;
  // 	source[parseInt(evt.target.id)].connect(context.destination);
  	var index = parseInt(noteId);
  	if(source[index].gain.gain.value==0)
  	{
  		source[index].gain.gain.value=1;
  		return;
  	}
  	else
  	{
  		source[index].noteOn;
 			source[index].start(0);
 		}
  // source2.start(0);
}
function pauseit(noteId)
{
	// source[parseInt(evt.target.id)].noteOff;
 	// source[parseInt(evt.target.id)].stop();
  source[noteId].gain.gain.value=0;

 // console.log(source[parseInt(evt.target.id)].gain.gain);
}

function stopAll()
{
	source[0].stop();
	console.log();
}
