/**
 * Debugging Instructions
 * Pippin Barr
 * 
 * Eddited by Aran
 * 
 * Is meant to display a bug. But doesn't. Because it has bugs.
 * 
 * It has 5 bugs. Hopefully not more.
 */

"use strict";

/**
 * Creates the canvas
*/
function setup() {
    createCanvas(500, 500);
}


/**
 * Displays a bug on a pink background
*/
function draw() {
    // Pink background
    background('pink');//fixed

    // Had to correct to drawInsect
    drawInsect();
}

function drawInsect() {
    drawBody();
    drawLegs();//missing this function call
    drawAntennae();
    drawEyes();//missing s at end of eye
}

/**
 * Draws the body of the bug!
 */
function drawBody() {
    push();
    noStroke();
    fill('black');
    ellipse(250, 250, 200, 300);
    pop();
}

/**
 * Draws the legs of the bug!
 */
function drawLegs() {
    push();
    stroke('black');
    strokeWeight(10);
    line(100, 200, 400, 200);
    line(100, 250, 400, 250);
    line(100, 300, 400, 300);
    pop();
}

/**
 * Draws the antennae of the bug
 */
function drawAntennae() {
    push();
    stroke('white');//mispelled
    strokeWeight(5);
    line(250, 250, 200, 50);
    line(250, 250, 300, 50);
    pop();
}

/**
 * Draws the eyes of the bug
 */
function drawEyes() {
    push();
    fill(255, 0, 0);
    noStroke();
    ellipse(200, 150, 15);
    ellipse(300, 150, 15);
    pop();
}

//Debugged by Aran!!