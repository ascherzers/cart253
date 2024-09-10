/**
 * Cat
 * Aran Scherzer
 * 
 * Making a Cat
 */

"use strict";

/**
 * Setting up
*/
function setup() {

    createCanvas(400, 400);

}


/**
 * Draw the background 
*/
function draw() {

    background('orange');
    noStroke();
    drawCat();
}

function drawCat() {
    drawHead();
    drawEyes();
    drawNose();
    drawSmile();
}

function drawHead() {
    //Drawing the head shape, a circle
    push();
    fill('black');
    stroke('white');
    strokeWeight(1);
    ellipse(250, 400, 200)

    // Ears
    push();
    fill('black');
    triangle(170, 340, 210, 310, 190, 230);
    triangle(290, 310, 330, 340, 310, 230);
    pop();
}

// Draws the eyes for the cat
function drawEyes() {
    // Left cat eye
    noStroke();
    push();
    fill('red');
    ellipse(220, 350, 30);
    fill(0);
    ellipse(220, 350, 15);
    pop();

    // Right cat eye
    push();
    noStroke();
    fill('red');
    ellipse(280, 350, 30);
    fill(0);
    ellipse(280, 350, 10);
    pop();
}

//Draws cat nose
function drawNose() {
    push();
    fill('red');
    noStroke();
    triangle(240, 390, 260, 390, 250, 410);
    pop();
}

//Draws Smile
function drawSmile() {
    push();
    strokeWeight(5);
    stroke('red');
    line(200, 400, 190, 370);
    line(300, 400, 310, 370);
    pop();
}



