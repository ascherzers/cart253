# Pseudocode for FROLAGA

ship
    body
        x: 320 // Middle of a 640x480 canvas
        y: 520 // Near the bottom
        size: 150 // Diameter of the ship
    beam
        x: undefined // Matches the body x
        y: 480 // Initial y position near bottom
        size: 20 // Diameter of beam tip
        speed: 20 // Beam speed in pixels/second
        state: idle // Beam starts in an idle state
    secondBeam // For power-up after 3 waves
        x: undefined
        y: 480
        size: 20
        speed: 20
        state: idle
    thirdBeam // For power-up after 5 waves
        x: undefined
        y: 480
        size: 20
        speed: 20
        state: idle

gameState
    winScore: 1000 // Score to win the game
    score: 0 // Player’s score
    currentWave: 1 // Tracks the wave level
    flies: array // Array to hold alien flies
    fliesPerWave: 5 // Flies per wave, increasing with each wave
    waveCooldown: 0 // Cooldown timer between waves
    particles: array // Particle effect array for visuals

stars
    starCount: 100 // Number of stars in starfield
    array of stars with random x, y positions and movement speeds

setup()
    create a 640x480 canvas
    initialize starfield with random positions and speeds
    generate first wave of flies

draw()
    call stateFunction // Runs either titleScreen or game based on current game state

titleScreen()
    drawStars()
    display title, instructions, and a start button

game()
    if score >= winScore
        switch to victoryScreen
        return
    drawStars() // Draw starfield background
    if waveCooldown > 0
        display "Wave Start" message
        decrease waveCooldown
    else
        moveFlies()
        drawFlies()
        moveShip()
        moveBeam(ship.beam)
        if doubleBeamUnlocked moveBeam(ship.secondBeam)
        if tripleBeamUnlocked moveBeam(ship.thirdBeam)
        drawShip()
        checkBeamOverlap(ship.beam)
        if doubleBeamUnlocked checkBeamOverlap(ship.secondBeam)
        if tripleBeamUnlocked checkBeamOverlap(ship.thirdBeam)
        drawParticles()
        displayScore()

makeWave()
    clear flies array
    speed = 2 + currentWave
    for each fly in fliesPerWave
        set starting side, y position, and speed
        assign color based on starting side
        set random spawn delay
        add fly to flies array

createParticles(fly)
    add particles around the caught fly position

drawParticles()
    for each particle in particles
        draw particle
        move particle based on speed
        decrease lifespan
        remove particle if lifespan <= 0

drawStars()
    background black
    for each star
        draw and move star downwards
        if star goes off bottom, reset to top at random x

displayTitle()
    display title and description at screen center

displayStartButton()
    display a button with "Start" text at the center

moveFlies()
    for each fly in flies
        if fly delay > 0
            decrease delay
        if fly is activated, grow to target size, then move horizontally
        if fly is captured, move towards the ship
            if close to ship, remove fly from array and increase score
            if all flies caught in wave, call resetWave

drawFlies()
    for each active fly
        draw body, eyes, wings, and legs

displayWaveStartMessage()
    display the wave number at the center

resetWave()
    reset caughtFlies to 0
    if currentWave < maxWaves
        increment currentWave
        increase fliesPerWave by 3
        set waveCooldown
        call makeWave
        if currentWave is 3 unlock doubleBeam
        if currentWave is 5 unlock tripleBeam
    else call gameOverScreen

moveShip()
    set ship body x to mouse x position

moveBeam(beam)
    set beam x to ship body x
    if beam is idle do nothing
    if beam is outbound
        move beam up by speed
        if beam reaches top, set to inbound
    if beam is inbound
        move beam down by speed
        if beam reaches ship, set to idle

drawShip()
    draw each beam and line to ship
    if doubleBeamUnlocked draw secondBeam
    if tripleBeamUnlocked draw thirdBeam
    draw ship body with sci-fi style and frog-like eyes

checkBeamOverlap(beam)
    for each fly in flies
        if fly is active and not captured
            if beam overlaps fly
                set fly to captured
                create particles
                set beam to inbound
                set fly position to beam position
                reset fly color after delay if flashing

// Particle system for blood effect
emitBloodParticles()
    Loop 20 times
        Create particle at ship's body coordinates with:
            - size: random between 3 and 8
            - color: red
            - xSpeed: random between -3 and 3
            - ySpeed: random between -3 and 3
            - lifespan: 50
        Add particle to particles array

// Game over screen if frog is clicked
gameOverScreen()
    Set background color to black
    Set text color to red
    Set font to 'Courier New', size 50, and centered alignment
    Display "DON'T CLICK ON THE FROG" text at screen center

    // Display score
    Set text size to 30
    Show `Score: ${score}` at the top of the screen

    // Restart button
    Draw blue-green button rectangle at the bottom center
    Display "Restart" text on button

// Victory screen when the game is won
victoryScreen()
    Set background color to black
    Set text color to green
    Set font to 'Courier New', size 60, and centered alignment
    Display "YOU WIN!" text at screen center

    // Display score
    Set text size to 30
    Show `Score: ${score}` at the top of the screen

    // Restart button
    Draw blue-green button rectangle at the bottom center
    Display "Restart" text on button

// Display current score at top right
displayScore()
    Set text color to white, font to 'Courier New', size 20
    Show `Score: ${score}` at top right corner

// Launch the beam on mouse click
mousePressed()
    // If the click is on restart button in game over/victory screen
    if stateFunction is gameOverScreen or victoryScreen and click is within restart button area
        Reset game variables
        Set stateFunction to titleScreen
        Initialize the first wave
        return

    // Check if click is on frog's body
    Calculate distance d from click to ship body
    if d is less than half of ship body size
        Trigger blood particle effect
        Set a 1-second timer to switch stateFunction to gameOverScreen
        return

    // Start game on button click from title screen
    if click is within start button area
        Set stateFunction to game

    // Launch beam if idle
    if ship.beam.state is idle
        Set beam start position to ship body
        Set beam state to outbound

    // Launch second and third beams if unlocked
    if doubleBeamUnlocked and secondBeam is idle
        Set secondBeam position and state to outbound
    if tripleBeamUnlocked and thirdBeam is idle
         Set thirdBeam position and state to outbound

gameOverScreen()
    display "GAME OVER" in red at center

victoryScreen()
    display "YOU WIN!" in green at center

displayScore()
    display score at top right corner

mousePressed()
    if game in titleScreen
        switch to game state
    else if beam is idle
        set beam state to outbound
