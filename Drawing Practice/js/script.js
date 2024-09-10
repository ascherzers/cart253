/**
 * Trying VS Canvas
 * Aran Scherzer
 * 
 * Trying VS Canvas
 */

"use strict";

/**
 * Square Canvas
*/
function setup() {

    createCanvas(640, 640);

}


/**
 * Grey background
 * Circle in the centre
 * red circle
*/
function draw() {

    background('orange');

    push();
    fill(255, 0, 0);
    stroke('black');
    ellipse(320, 320, 480, 480);
    pop();

    push();
    fill('pink');
    stroke('black');
    ellipse(320, 320, 240, 240);
    pop();

}