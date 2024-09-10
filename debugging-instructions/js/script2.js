/**
 * Aran's showing of console usage
 * 
 * using console commands
 */

"use strict";

function setup() {
    //prints hello in the console
    console.log("Good Morning!")

    weird();
}

function weird() {
    //Using a String to hold a variable to then print to the console
    let Bid = "Giant";
    console.log(Bid);


    //Trying example, but giving bird a variable so it dosn't give errors.
    let bird = "you";
    console.log("bird.x: " + bird.x, "bird.y: " + bird.y);
}
