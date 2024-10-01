/*
* Pixel Art Jam 
* @author Aran Scherzer
* September 27, 2024
* 
* A table where you can trace out any pixel art you want using your 
* cursor to click and drag leaving behind a trail of rgb coloured tiles.
*
* Uses: p5.js
*
*/

let tileSize = 18; // size of each tile
let colorPicker; // color picker element
let clearButton; // clear canvas button
let erasing = false; // eraser toggle

function setup() {
    createCanvas(600, 600); // canvas size
    noStroke(); // no tile borders
    background(255); // background white

    // create color picker
    colorPicker = createColorPicker('#ff0000');
    colorPicker.position(620, 50);

    // create canvas clearer
    clearButton = createButton('Clear Canvas');
    clearButton.position(620, 100);
    clearButton.mousePressed(clearCanvas);
}

function clearCanvas() {
    background(255);
}

function draw() {
    //when clicked the tile will turn to colour or erase
    if (mouseIsPressed) {
        // calculate where x-coordinate of tile's top-left corner is relative to the mouse
        let tileX = floor(mouseX / tileSize) * tileSize;
        let tileY = floor(mouseY / tileSize) * tileSize;

        if (erasing) {
            //fill the tile with white to erase
            fill(255);
        } else {
            //get the color from the color picker
            let selectedColor = colorPicker.color();
            let red = color(255, 0, 0);

            //If the color is red, use defualt color changing based on mouse position
            if (selectedColor.toString() === red.toString()) {
                let color1 = map(mouseX, 255, width, 0, 255); //color changes with mouseX
                let color2 = map(mouseY, 255, height, 0, 255); //color changes with mouseY
                fill(color1, color2, 255); //fill squares with color based on mouse position
            } else {
                fill(colorPicker.color()); //fill with selected color
            }
        }
        //draw the tile
        rect(tileX, tileY, tileSize, tileSize);
    }
}

function keyPressed() {
    //toggle eraser mode when e is pressed
    if (key === 'E' || key === 'e') {
        erasing = !erasing;
    }
}
