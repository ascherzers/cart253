/*
* Pixel Art Jam 
* @author Aran Scherzer
* September 27, 2024
* 
* A table where you can trace out any pixel art you want using your 
* cursor to click and drag leaving behind a trail of rgb coloured tiles.
* 

* P.S I have used JavaScript before and I also know a fair bit about Java too.
*/


let tileSize = 25; //size of each tile

function setup() {
    createCanvas(600, 600); //canvas size
    noStroke(); //no tile borders
    background(0); //inital background black

    //draw grey grid
    for (let i = 0; i < width; i += tileSize) { //used for loops to create grid
        for (let j = 0; j < height; j += tileSize) {
            fill(50); //grey colour
            rect(i, j, tileSize, tileSize);
        }
    }
}

function draw() {
    //when clicked the tile will turn to colour
    if (mouseIsPressed) {
        //calculte where tile's top-left corner is to where mouse is
        let tileX = floor(mouseX / tileSize) * tileSize;
        //used floor to immitate floor pattern
        let tileY = floor(mouseY / tileSize) * tileSize;

        //get colour of tile
        let currentColor = get(tileX + tileSize / 2, tileY + tileSize / 2);

        //if tile isn't already coloured, change its color
        if (currentColor[0] === 50 && currentColor[1] === 50 && currentColor[2] === 50) {
            let m = map(mouseX, 0, width, 100, 255); //mouseX goes to red
            let a = map(mouseY, 0, height, 100, 255); //mouseY goes to green
            let p = 255; //blue is max
            fill(m, a, p);
            rect(tileX, tileY, tileSize, tileSize); //draw coloured tile
        }
    }
}
