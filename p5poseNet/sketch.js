//Male Gaze (2018)
//by August Luhrs
//thanks to Tom Igoe, Shawn Van Every, and Dan Oved

// Face Tracking:
// Copyright (c) 2018 ml5
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

/* ===
ml5 Example
PoseNet example using p5.js 
by Dan Oved (THANK YOU)
=== */

let video;
let poseNet;
let poses = [];

var serial;
var portName = 'COM5'; //arduino usb

var inData;
var outByte = 0;
var outByteX = 0;
var outByteY = 0;
var oBX;
var oBY;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(width, height);

  // Create a new poseNet method with a single detection
  poseNet = ml5.poseNet(video, modelReady);
  // This sets up an event that fills the global variable "poses"
  // with an array every time new poses are detected
  poseNet.on('pose', function(results) {
    poses = results;
    // console.log(poses);
    // console.log(poses[0].pose.keypoints[0].position.x);
    // console.log(poses[0].pose.keypoints[0].position.y);
  	oBX = int(map(poses[0].pose.keypoints[0].position.x, 0, width, 110,20, true));
    oBY = int(map(poses[0].pose.keypoints[0].position.y, height/5, height, 90, 0, true));
    outByteX = str(oBX);
    outByteY = str(oBY);
  	// console.log(oBX, oBY);
    // console.log(outByteX, outByteY);
  	// serial.write(outByteX + 'X,' + outByteY + 'Y,'); //for both servos
  	serial.write(outByteX + 'X,'); //if only using bottom servo (horizontal motion)
    
  });
  video.hide();

  serial = new p5.SerialPort();
  serial.on('list', printList);
  serial.on('connected', serverConnected); // callback for connecting to the server
  serial.on('open', portOpen); // callback for the port opening
  serial.on('data', serialEvent); // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.on('close', portClose); // callback for the port closing
  serial.list(); // list the serial ports
  serial.open(portName);
}

function serverConnected() {
  console.log('connected to server.');
}

function portOpen() {
  console.log('the serial port opened.')
}

function serialEvent() {
  var inByte = serial.read();
  inData = inByte;
}

function serialError(err) {
  console.log('Something went wrong with the serial port. ' + err);
}

function portClose() {
  console.log('The serial port closed.');
}

function printList(portList) {
  // portList is an array of serial port names
  for (var i = 0; i < portList.length; i++) {
    // Display the list the console:
    console.log(i + " " + portList[i]);
  }
}

function modelReady() {
  select('#status').html('Model Loaded');
}

function draw() {
  image(video, 0, 0, width, height);
  drawKeypoints();
  drawSkeleton(); //totally optional, don't have to draw either of these
}

// A function to draw ellipses over the detected keypoints
function drawKeypoints() {
  // Loop through all the poses detected
  for (let i = 0; i < poses.length; i++) {
    // For each pose detected, loop through all the keypoints
    let pose = poses[i].pose;
    for (let j = 0; j < pose.keypoints.length; j++) {
      // A keypoint is an object describing a body part (like rightArm or leftShoulder)
      let keypoint = pose.keypoints[j];
      // Only draw an ellipse is the pose probability is bigger than 0.2
      if (keypoint.score > 0.2) {
        fill(0, 255, 255);
        noStroke();
        ellipse(keypoint.position.x, keypoint.position.y, 10, 10);
      }
    }
  }
}

// A function to draw the skeletons
function drawSkeleton() {
  // Loop through all the skeletons detected
  for (let i = 0; i < poses.length; i++) {
    let skeleton = poses[i].skeleton;
    // For every skeleton, loop through all body connections
    for (let j = 0; j < skeleton.length; j++) {
      let partA = skeleton[j][0];
      let partB = skeleton[j][1];
      stroke(255, 0, 0);
      line(partA.position.x, partA.position.y, partB.position.x, partB.position.y);
    }
  }
}
