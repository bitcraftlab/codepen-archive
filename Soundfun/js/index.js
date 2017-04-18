////////////////////////////////////////////////////////////////////////////////
//                                                                            //
//    S O U N D F U N                                                         //
//                                                                            //
////////////////////////////////////////////////////////////////////////////////

// generating sound with functions

// HOMEWORK

// 1. Implement three visualization functions (drawLevel, drawWaveform, drawFFT)
//    Check the p5 examples if you are not sure what this is about!

// 2. Create your own functional sounds
//    and add keyboard interaction to trigger them

// OPTIONAL

// 3. Implement drawOsci, to draw an oscilloscope curve that visualizes input
//    from the left and right audio channel
//    Create functional sounds, that draw funky images


//////////////////////////////////////////////////////////////////

// See https://github.com/bitcraftlab/p5.soundfun

// oscillators
var osc;

// envelope
var env;

// visualization functions
var vis = [
  drawLevel,
  drawWaveform,
  drawFFT,
  drawOsci
];

// audio analysis
var amplitude, fft;


function setup() {

  createCanvas(windowWidth, windowHeight);

  // create functions we want to sonify
  var fns = [

    // sinus curve
    sin,

    // noise function
    noise,

    // sawtooth curve
    function(x) {
      return (x / TWO_PI) % 2 - 1;
    },

    // random noise
    function(x) {
      return random(-1, 1);
    }

    // add your own!

  ];

  // create oscillators
  osc = [
    new p5.SinOsc(500),
    new p5.SoundFun(fns[0], 500),
    new p5.SoundFun(fns[1], 500),
    new p5.SoundFun(fns[2], 500),
    new p5.SoundFun([fns[0], fns[3]], 500)
  ];

  // start and mute all oscillators
  for(var i = 0; i < osc.length; i++) {
    osc[i].start();
    osc[i].amp(0);
  }

  // create the envelope
  env = new p5.Env();
  env.setADSR(0.1, 0.1, 0.2, 0.1);
  env.setRange(1, 0);

  // analyze amplitude
  amplitude = new p5.Amplitude();

  // analyze sound samples
  fft = new p5.FFT();

}


function draw() {

  // call selected visualization function
  vis[1]();

}


function drawLevel() {

  // get volume from the analyzer
  var level = amplitude.getLevel();
  // implement this!

}


function drawWaveform() {

  var waveform = fft.waveform();
  // implement this!

}

function drawFFT() {

  var spectrum = fft.analyze();
  // implement this!

}

function drawOsci() {

  var waveform = fft.waveform();
  // implement this!

}


function keyPressed() {

  // convert digit keys to array indices (1->0, 2->1, etc)
  var i = int(key) - 1;

  // is the index in the valid range?
  if(i >= 0 && i < osc.length) {

    // reconnect envelope and play the sound
    env.disconnect();
    env.connect(osc[i]);
    env.play();

    // we are done here
    return;
  }

}