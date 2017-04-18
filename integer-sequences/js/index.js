// Meandering Through Space 2016 

// lecture 4 - integer sequences

// things to try:
// * browse the OEIS for sequences you like and add them to the list
// * change the visualization
// * turn one or two integer sequences into a curve

// Press any key to pick the next sequence
// The responsiveness may vary, depending on the reliability of the CORS proxy.

// IDs from the Online-Enyclopedia of Integer Sequences
var ids = [
  'A000027',
  'A000045',
  'A002260',
  'A003603',
  'A004718',
  'A004736',
  'A022446',
  'A022447',
  'A108712',
  'A112382',
  'A122196',
  'A125158',
  'A125159'
];

// index of the selected sequence
var idx = 0;

// initial sequence
var seq = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// minimum and maximum values
var smin, smax;

function getIntegerSequence(id) {

  // OEIS-API call
  var url = 'https://oeis.org/search?fmt=json&q=id:' + id;

  // proxy server to make sure we don't run into CORS problems
  // var corsproxy = 'https://crossorigin.me/';
  // var jsonurl = corsproxy + url;

  // alternative CORS proxy
  var corsproxy = 'https://jsonp.afeld.me/?callback=&url=';
  var jsonurl = corsproxy + encodeURIComponent(url);

  // load it, and call update(json) when done
  loadJSON(jsonurl, update);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  smax = max(seq);
  smin = min(seq);
  noLoop();
}

function update(json) {
  var result = json.results[0];
  console.log(result.name);
  seq = int(split(result.data, ','));
  console.log(seq);
  smin = min(seq);
  smax = max(seq);
  redraw();
}

function draw() {
  clear();
  var n = seq.length;
  var w = width / n;
  for (var i = 0; i < n; i++) {
    var x = map(i, 0, n, 0, width);
    var y = map(seq[i], smin, smax, height, 0);
    fill(0);
    noStroke();
    rect(x, y, w - 1, height - y);
  }

}

function keyTyped() {
  // get the next sequence id
  idx = (idx + 1) % ids.length;
  seqid = ids[idx];
  // load the sequence
  console.log('Loading Integer Sequence ' + seqid);
  getIntegerSequence(seqid);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}