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


let tileSize = 18; //size of each tile
let colorPicker; //chose colour
let clearButton; //clears canvas
let erasorButton;//erases

function setup() {
    createCanvas(600, 600); //canvas size
    noStroke(); //no tile borders
    background(255); //background white

    //create colourPicker
    colorPicker = createColorPicker('#ff0000');
    colorPicker.position = ("620, 50");

    //create canvas clearer
    clearButton = createButton('Clear Canvas');
    clearButton.position("620, 100");
    clearButton.mousePressed(clearCanvas);

    //erasor
    erasorButton = createButton("Erase");
    erasorButton.position("620, 150")
    erasorButton.mousePressed(erase);

}

function erase() {

}

function clearCanvas() {
    background(255);
}

function draw() {
    //when clicked the tile will turn to colour
    if (mouseIsPressed) {
        //calculte where x-cordinate of tile's top-left corner is to where mouse is
        let tileX = floor(mouseX / tileSize) * tileSize;
        //used floor to round to get exact boarder outline
        let tileY = floor(mouseY / tileSize) * tileSize;


        let selectedColor = colorPicker.color();
        console.log(selectedColor);
        let red = color(255, 0, 0);
        if (selectedColor.toString() === red.toString()) {
            let color1 = map(mouseX, 255, width, 0, 255); //color changes with mouseX
            let color2 = map(mouseY, 255, length, 0, 255); //color changes with mouseY
            fill(color1, color2, 255);//fill sqaures blue
            rect(tileX, tileY, tileSize, tileSize); //draw coloured tile
        }
        else {
            fill(colorPicker.color()); // Use the color selected by the color picker
            rect(tileX, tileY, tileSize, tileSize); //draw coloured tile
        }




    }
}
