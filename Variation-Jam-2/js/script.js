/**
 * Greek Myth Jump
 * Aran Scherzer
 * 
 * A game where the player controls a frog and tries to eat flies that
 * pass by launching the frog's tongue.
 * A game where the player controls a greek legend from the myths and tries to 
 * fufill their destiny by jumping up and collecting memeory fragments to win the game.
 * 
 * Controls: 
 * - Left arrow key to move left
 * - Right arrow key to move right
 * - Space to restart when prompted
 * - C to continue when prompted
 * 
 * Uses:
 * p5.js
 * https://p5js.org
 */

// Global variables
let player;
let settings = { gravity: null };
let platforms = [];
let score = 0;
let gameOver = false; // Track if the game is over
let platformBuffer = 100; // Buffer above the visible area to spawn platforms
let memoryFragments = [];
let collectedFragments = 0;
let showStorySnippet = false;
let currentSnippetIndex = -1;
let playerImgRight; // Global variable for the right player image
let playerImgLeft; // Global variable for the left player image
let platformTexture; // Image for the platform texture
let bgImage; // Background image
let fragImage; // Global variable for the fragment image
// let endBarrierY = -700 * 60; // Position of the end barrier
let endBarrierHeight = 500; // Height of the barrier
let deathPosition = null; // Track where the player dies
let lyreImg; // Image behind the storySnippets


let storySnippets = [
    "Orpheus descended into the underworld, \n seeking to bring Eurydice back to life.",
    "'Do not look back,' warned Hades. \n 'Her return depends on your faith.'",
    "Step by step, Orpheus climbed, \n the weight of doubt pressing on his heart.",
    "Beware, Orpheus.\n One glance back, and all will be lost."
];

/** 
 * Preloads game assets before setup is called
 */
function preload() {
    playerImgRight = loadImage('assets/images/opRight.png'); // Path to the right facing image
    playerImgLeft = loadImage('assets/images/opLeft.png');  // Path to left facing image
    platformTexture = loadImage('assets/images/plat2.jpg'); // Platform texture
    bgImage = loadImage('assets/images/bg2.jpg'); // Background image
    fragImage = loadImage('assets/images/frag.png'); // Load the fragment image
    lyreImg = loadImage('assets/images/lyre.png'); // Load image behind the storySnippets
}

/** 
 * Sets up game canvas and initializes game state
 */
function setup() {
    createCanvas(500, 600);
    initializeGame(); // Initialize the game state
}

/** 
 * Initializes or resets game state
 */
function initializeGame() {
    settings.gravity = createVector(0, 0.5);
    platforms = [];
    memoryFragments = [];
    score = 0;
    gameOver = false;
    collectedFragments = 0;
    showStorySnippet = false;
    currentSnippetIndex = -1;
    deathPosition = null;

    // Generate initial platforms
    for (let i = 0; i < 10; i++) {
        let x = random(50, width - 100);
        let y = height - i * 60; // Space out platforms vertically
        platforms.push(new Platform(x, y, 80, 15));
    }

    // Place player on top of the first platform
    let firstPlatform = platforms[platforms.length - 1];
    player = new Player(settings, firstPlatform.x + firstPlatform.w / 2 - 20, firstPlatform.y - 40, 40, 40);

    // Place memory fragments on specific platforms
    memoryFragments.push(100, 200, 300, 400); // Positions for fragments

    loop(); // Restart the draw loop
}

/** 
 * Handles main game loop, including rendering and logic
 */
function draw() {
    if (showStorySnippet) {
        displayStorySnippet();
        return;
    }

    background(220);//Fallback background

    // Draw the background image
    image(bgImage, 0, 0, width, height); // Scale the background to the size of the canvas

    // Draw the score at the fixed screen position
    drawScore();
    displayCollectedFragments();

    //simulate scrolling
    let offsetY = max(0, height / 2 - player.pos.y);
    translate(0, offsetY);

    // Update and display player
    player.update(platforms);
    player.show();

    // Update and display platforms
    for (let i = platforms.length - 1; i >= 0; i--) {
        platforms[i].show();

        // Remove platforms that move off screen below the player
        if (platforms[i].y > player.pos.y + height) {
            platforms.splice(i, 1);
        }
    }

    // Ensure platforms exist above the screen before they are visible
    while (platforms[platforms.length - 1].y > player.pos.y - platformBuffer - height) {
        let newX = random(50, width - 100);
        let newY = platforms[platforms.length - 1].y - 60;
        // Stop generating platforms beyond the 500th
        if (platforms.length >= 500) break;
        platforms.push(new Platform(newX, newY, 80, 15)); // Every new platform uses the texture
    }

    // Handle memory fragments and scoring
    for (let i = memoryFragments.length - 1; i >= 0; i--) {
        let fragmentY = height - memoryFragments[i] * 60;
        //let fragmentY = -100; // Use for tests
        // Only draw fragments within the player's view
        if (fragmentY > player.pos.y - height && fragmentY < player.pos.y + height) {
            // // Draw the fragment image
            image(fragImage, width / 2 - 10, fragmentY, 40, 40);

            // Check if the player collects the fragment
            if (dist(player.pos.x + player.size.x / 2, player.pos.y + player.size.y / 2, width / 2, fragmentY + 10) < 30) {
                memoryFragments.splice(i, 1);
                collectedFragments++;
                currentSnippetIndex++;
                showStorySnippet = true;
                break;
            }
        }
    }

    // Increment score as the player ascends
    for (let platform of platforms) {
        if (platform.y > player.pos.y + height / 2 && !platform.scored) {
            platform.scored = true; // Mark platform as scored
            score++;
        }
    }

    // Game over condition
    if (player.pos.y > height + 100) {
        gameOver = true;
        displayGameOverScreen();
        deathPosition = createVector(player.pos.x, player.pos.y); // Store death position
        noLoop(); // Stop the draw loop
    }

    // Check if player has reached the final platform
    let finalPlatform = platforms[499]; // 500th platform

    if (
        finalPlatform &&
        player.pos.x + player.size.x > finalPlatform.x &&
        player.pos.x < finalPlatform.x + finalPlatform.w &&
        player.pos.y + player.size.y <= finalPlatform.y &&
        player.pos.y + player.size.y + player.vel.y >= finalPlatform.y
    ) {
        if (collectedFragments === 4) {
            displayVictoryScreen();
            noLoop();
        } else {
            // Display message to collect all fragments
            push();
            resetMatrix(); // Reset transformations
            fill('white');
            textSize(20);
            textAlign(CENTER);
            stroke(0); // Set the stroke colour to black
            strokeWeight(2); // Set the stroke thickness
            text("Orpheus Does Not Know His Own Tale", width / 2, height / 2);
            pop();
        }
    }

    // Handle game over logic
    if (gameOver) {
        displayGameOverScreen();
        return;
    }

}

/** 
 * Draws the player's current score on the screen
 */
function drawScore() {
    push(); // Save the current drawing state
    resetMatrix(); // Reset transformations to the default coordinate system
    fill('white');
    textSize(25);
    textAlign(LEFT);
    // Add a white outline to the text
    stroke(0); // Set the stroke colour to black
    strokeWeight(2); // Set the stroke thickness
    text(`${score}`, 10, 30); // Always draw at the top-left corner
    // text(`Fragments: ${collectedFragments}/4`, 10, 50);
    pop(); // Restore the previous drawing state
}

/** 
 * Displays current story snippet when triggered
 */
function displayStorySnippet() {
    background(0, 50);
    image(lyreImg, 0, 0, width, height); // Scale the image to cover the entire canvas
    fill('white');
    stroke(0); // Set the stroke colour to black
    strokeWeight(2); // Set the stroke thickness
    textAlign(CENTER, CENTER);
    textSize(22);
    text(storySnippets[currentSnippetIndex], width / 2, height / 2 - 20);
    textSize(18);
    text("\nPress 'C' to continue...", width / 2, height / 2 + 20);
}

/** 
 * Displays victory screen when player wins the game
 */
function displayVictoryScreen() {
    push(); // Save current transformation state
    resetMatrix(); // Reset transformations to the default coordinate system
    textSize(32);
    textAlign(CENTER, CENTER);
    fill('white');
    stroke(0); // Black outline
    strokeWeight(2);
    text("Orpheus Escaped the Underworld", width / 2, height / 2 - 50);
    textSize(20);
    text("But did Eurydice follow?", width / 2, height / 2);
    pop(); // Restore the previous transformation state
}

/** 
 * Displays game over screen when player loses
 */
function displayGameOverScreen() {
    // Reset the transformation to the default (fixed screen position)
    push(); // Save current transformation state
    resetMatrix(); // Reset transformations to the default coordinate system
    // Display the message in the center of the visible screen
    textSize(32);
    textAlign(CENTER);
    fill('white');
    stroke(0); // Black outline for better contrast
    strokeWeight(2);
    text("Orpheus Looked Back \n Against Better Judgment", width / 2, height / 2 - 50);
    textSize(20);
    text("\nPress SPACE to restart", width / 2, height / 2 + 50);
    pop(); // Restore the previous transformation state
}


/** 
 * Handles keyboard input for gameplay actions
 */
function keyPressed() {
    if (gameOver && key === ' ') {
        initializeGame(); // Restart the game when space is pressed
    }

    if (showStorySnippet && key === 'c') {
        showStorySnippet = false;
    }

    if (!gameOver) {
        if (key === 'ArrowLeft') player.move('left', true); // Move left and update image
        if (key === 'ArrowRight') player.move('right', true); // Move right and update image
    }
}

/** 
 * Handles key releases to stop player movement
 */
function keyReleased() {
    if (!gameOver) {
        if (key === 'ArrowLeft') player.move('left', false);// Stop moving left
        if (key === 'ArrowRight') player.move('right', false);// Stop moving right
    }
}

/** 
 * Displays collected memory fragments at a fixed position on the screen
 */
function displayCollectedFragments() {
    let fragmentSpacing = 45; // Space between fragment images
    let startX = 10; // Start from left side of the screen
    let yPos = 70; // Place below the score

    for (let i = 0; i < collectedFragments; i++) {
        image(fragImage, startX + i * fragmentSpacing, yPos, 40, 40); // Draw each fragment
    }
}

/** 
 * Class representing player and their behavior
 */
class Player {
    constructor(settings, x, y, w, h) {
        this.settings = settings;
        this.pos = createVector(x, y);
        this.vel = createVector(0, 0);
        this.acc = createVector(0, 0);
        this.size = createVector(w, h);
        this.currentImg = playerImgRight; // Default to right-facing image
    }

    /**
    * Displays player on the canvas
    */
    show() {
        let scaleFactor = 3; // Sets the scale of the image
        let newWidth = this.size.x * scaleFactor;
        let newHeight = this.size.y * scaleFactor;

        image(this.currentImg, this.pos.x - (newWidth - this.size.x) / 2, this.pos.y - (newHeight - this.size.y) / 2, newWidth, newHeight);
    }

    /**
     * Updates player's position and handles collisions
     */
    update(platforms) {
        this.acc.add(this.settings.gravity);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.set(0, 0);

        // Horizontal boundary wrapping
        if (this.pos.x > width) this.pos.x = 0;
        if (this.pos.x < 0) this.pos.x = width;

        // Check for collisions with platforms (only when falling)
        if (this.vel.y > 0) {
            for (let i = platforms.length - 1; i >= 0; i--) {
                let platform = platforms[i];
                if (
                    this.pos.x + this.size.x > platform.x &&
                    this.pos.x < platform.x + platform.w &&
                    this.pos.y + this.size.y <= platform.y &&
                    this.pos.y + this.size.y + this.vel.y >= platform.y
                ) {
                    this.vel.y = -10; // Bounce up
                    platform.jumpCount++; // Increment jump count

                    // Remove platform if jumped on twice
                    if (platform.jumpCount >= 2) {
                        platforms.splice(i, 1);
                    }

                    break;
                }
            }
        }
    }

    /** 
     * Handles player movement in a given direction
     */
    move(direction, isPressed) {
        const speed = 5;
        if (direction === 'left') {
            this.vel.x = isPressed ? -speed : 0;
            this.currentImg = isPressed ? playerImgLeft : this.currentImg; // Switch to left facing image
        }
        if (direction === 'right') {
            this.vel.x = isPressed ? speed : 0;
            this.currentImg = isPressed ? playerImgRight : this.currentImg; // Switch to right facing image
        }
    }
}

/** 
 * Class representing a platform in the game
 */
class Platform {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.scored = false; // Tracks if the platform has contributed to the score
        this.jumpCount = 0; // Tracks how many times the player has jumped on this platform
    }

    /**
     * Displays platform on the canvas
     */
    show() {
        if (this === platforms[499]) {
            fill('gold'); // Highlight final platform
            stroke(255); // Add outline
            strokeWeight(3);
            rect(this.x, this.y, this.w, this.h);
        } else {
            fill("#A4161A"); // Highlight final platform
            stroke(255); // Add outline
            strokeWeight(3);
            rect(this.x, this.y, this.w, this.h);
        }
    }
}