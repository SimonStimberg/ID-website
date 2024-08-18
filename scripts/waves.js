/*  Simon Stimberg, MIT License, 2023                 */
/*  little interactive waves graphic using p5.js      */


let colors = ['#DE183C', '#F2B541', '#0C79BB', '#2DACB2', '#E46424', '#ECACBE', '#19446B'];
let w, h, verticalOffset, timestamp, xNoiseScaler, mPosX, mPosY, initialState, noiseOverlay;

let seed = 40;   // initial noise seed - other values: 4, 16
const numLines = 20;


function setup() {
  
  initialState = true;
  setSize();

  var canvas = createCanvas(w, h*2);
  canvas.parent('waves');   // attach canvas to div with id="waves"

  angleMode(DEGREES);
  noiseSeed(seed);
  checkOrientation();

}


function setSize() {

  w = round(windowHeight * 0.38);
  h = round(windowHeight * 0.35);

  // set initial noise position independent from mouse position
  if (initialState) {
    mPosX = w * 0.5;              // 147;  // -566;
    mPosY = h * 0.83 + h * 0.5;   // 368;  // -18;
  }

  verticalOffset   = h * 0.5;
  xNoiseScaler = 0.0125 * (300 / w);
  setNoiseOverlay();

}


function draw() {

  background(10);

  if(initialState && mouseX != 0) initialState = false;
  if(!initialState) {
    mPosX = mouseX;
    mPosY = mouseY;
  }

  let mouseDist = abs(mPosX - w * 0.5) / (w * 0.5);
  mouseDist *= mouseDist * mouseDist;
  let ampScaler = map(mouseDist, 0.0, 1.0, 1, 3, true);
  
  
  push();
  translate(0, verticalOffset);

  for (let i = 0; i < numLines; i++) {

    let y0 = (h / numLines) * i;

    stroke(colors[i % colors.length]);
    fill(colors[i % colors.length]);

    beginShape();
      vertex(0, y0);
      for (let x = 2; x <= w-2; x += 2) {

        let xDist = abs(x - (mPosX) );
        let xTheta = map(xDist, 0, w*0.5, 0, 90, true);
        let xAmp = map(sin(xTheta), 0, 1, h / ampScaler, h / 100);

        let yDist = abs(y0 - (mPosY - verticalOffset) );
        let yTheta = map(yDist, 0, h*0.5, 0, 90, true);
        let yAmp = map(sin(yTheta), 0, 1, 1, 0.2);

        let n = noise(0.6925 * i, x * xNoiseScaler, (mPosX + 570 + mPosY - verticalOffset + 158) * 0.001);   // factors used to maintain noise scaling on all screen sizes (as dependent on width/height/absolute mouse position) // values are arbitrarily derived from gusto
        n = map(n*n, 0, 1, -0.1, 0.7);
        
        let y = y0 -  n * xAmp * yAmp - n * h/15;
        
        vertex(x, y);
      }
      vertex(w, y0);
    endShape();
  }

  pop();
  
	blendMode(MULTIPLY);
	image(noiseOverlay, 0, 0);
	blendMode(BLEND);
  
}


function setNoiseOverlay() {
	noiseOverlay = createImage(w, h*2);
	  noiseOverlay.loadPixels();
	  let pix = noiseOverlay.width * noiseOverlay.height * 4;
	  for (let i = 0; i < pix; i += 4) {
		  noiseOverlay.pixels[i] = random(255);
		  noiseOverlay.pixels[i + 1] = noiseOverlay.pixels[i];
		  noiseOverlay.pixels[i + 2] = noiseOverlay.pixels[i];
		  noiseOverlay.pixels[i + 3] = 100;
	  }
	  noiseOverlay.updatePixels();
}
  
function windowResized() {
  setSize();
	resizeCanvas(w, h*2);
}

function checkOrientation() {
  if (window.DeviceOrientationEvent) {
    window.addEventListener(
      "orientationchange",
      function () {
        location.reload();
      },
      false
    );
  }
}

function mousePressed() {
  timestamp = millis();
}

function mouseReleased() {
  if (timestamp+200 > millis()) {
    seed++;
    noiseSeed(seed);
    shuffle(colors, true);
  }
}