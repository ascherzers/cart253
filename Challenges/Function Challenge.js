/**
 * Bouncy Ball Ball Bonanza
 * Pippin Barr
 * 
 * The starting point for a ball-bouncing experience of
 * epic proportions!
 */

"use strict";

// Our ball
const ball = {
    x: 300,
    y: 20,
    width: 10,
    height: 10,
    velocity: {
        x: 0,
        y: 1
    }
};

// Our paddle
const paddle = {
    x: 300,
    y: 280,
    width: 80,
    height: 10
};

/**
 * Create the canvas
*/
function setup() {
    createCanvas(600, 300);
}


/**
 * Move and display the ball and paddle
*/
function draw() {
    background("#87ceeb");

    movePaddle(paddle);
    moveBall(ball);

    handleBounce(ball, paddle);

    drawBlock(paddle);
    drawBlock(ball);
}

/**
 * Moves the paddle
 */
function movePaddle(paddle) {
    paddle.x = mouseX;

    // if (keyIsDown(LEFT_ARROW)){
    //     paddle.x -= 2;
    // } else if (keyIsDown(RIGHT_ARROW)) {
    //     paddle.x + - 2;
    // }
}

/**
 * Moves the ball
 */
function moveBall(ball) {
    ball.velocity.y += gravity;


    //movement = position + velocity
    ball.x = ball.x + ball.velocity.x;
    ball.y = ball.y + ball.velocity.y;
}

function handleBounce(ball, paddle) {
    const centredRectanglesOverlap = centredRectanglesOverlap(ball, paddle);
    if (centredRectanglesOverlap) {
        // ball.velocity.y = -ball.velocity.y;
        ball.velocity.y *= -1;
        ball.y = paddle.y - paddle.height / 2 - ball.height / 2;
    }
}

/**
 * Returns true if a and b overlap, and false otherwise
 * Assumes a and b have properties x, y, width and height to describe
 * their rectangles, and that a and b are displayed centred on their
 * x,y coordinates.
 */
function centredRectanglesOverlap(a, b) {
    const overlap =
        //is the right edge of a to the right of b' left edge?
        (a.x + a.width / 2 > b.x - b.width / 2 &&
            //Is the left edge of a to the left of b's right edge?
            a.x - a.width / 2 < b.x + b.width / 2 &&
            a.y + a.height / 2 > b.y - b.height / 2 &&
            a.y - a.height / 2 < b.y + b.height / 2);
    return overlap;
}
//Overlap code, useful for most projects



/**
 * 
 * Draws the paddle on the canvas
 */
// function drawPaddle(paddle) {
//     push();
//     rectMode(CENTER);
//     noStroke();
//     fill("pink");
//     rect(paddle.x, paddle.y, paddle.width, paddle.height);
//     pop();
// }

/**
 * Draws the ball on the canvas
 */
// function drawBall(ball) {
//     push();
//     rectMode(CENTER);
//     noStroke();
//     fill("pink");
//     rect(ball.x, ball.y, ball.width, ball.height);
//     pop();
// }

function drawBlock(block) {
    push();
    rectMode(CENTER);
    noStroke();
    fill("pink");
    rect(block.x, block.y, block.width, block.height);
    pop();
}