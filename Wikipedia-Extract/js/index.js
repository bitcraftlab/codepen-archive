// Meandering through Space 2016

// This sketch shows how to get an article from wikipedia as plain text.

// Things to try:
// Turn the text into a turtle walk

// @bitcraftlab 2016 

// title of the wikipedia article
var lemma = 'turtle';

// approximate character limit
var limit = 2000;

// variable to hold the extract from the wikipedia article
var extract = '';

// layout
var fontsize = 16;
var x0 = 30;
var y0 = 30;

function setup() {
  textSize(fontsize);
  createCanvas(windowWidth, windowHeight);
  loadExtract(lemma, limit);
  noLoop();
}

function draw() {
  clear();
  text('First ' + limit + ' characters of Wikipedia\'s "' + lemma + '" article:', x0, y0);
  text(extract, x0, y0 + 1.5 * fontsize, width - 2 * x0, height - 2 * y0);
}

// Load an extract from Wikipedia using the text extract API.
// lemma : name of the wikipedia article to download
// limit (optional) : how many characters of text you want (approximate)
function loadExtract(lemma, limit) {

  // The API is described here: https://en.wikipedia.org/w/api.php?action=help&modules=query%2Bextracts
  var url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&explaintext&exsectionformat=plain&titles=' + lemma;

  // Approximate character limit
  if (limit) {
    url += '&exchars=' + limit;
  }

  // Load JSON using JSONP, and call parseExtract(json) once the data is available
  return loadJSON(url, parseExtract, 'jsonp');

}

// Extract the extract and draw it on screen
function parseExtract(json) {
  var pages = json.query.pages;
  var page = pages[Object.keys(pages)[0]];
  extract = page.extract;
  redraw();
}

// adjust the textflow
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}