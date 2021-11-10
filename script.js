let grid = document.querySelector('.grid')
let button = document.querySelector('.start')
let scoreBoard = document.querySelector('.score')
let score = 0
let canvas = document.querySelector('#canvas')
let ctx = canvas.getContext('2d')

// Function to setup the game
function setup() {
    // Setting size of the grid and canvas
    let screenHeight = window.innerHeight, screenWidth = window.innerWidth
    grid.style.height = grid.style.width = (screenHeight < screenWidth ? screenHeight - screenHeight*0.2 : screenWidth - screenWidth*0.1) + 'px'
    canvas.style.height = canvas.style.width = screenHeight*0.2 + 'px'
    // Setting inital score to 0
    scoreBoard.innerHTML = score
    // Adding the inner boxes
    for(let i=0; i<121; i++) { // needed 11 to make the chess board effect
        let div = document.createElement('div')
        grid.append(div)
    }
}
setup() // This will be called as it is

// Function to start the game when button is clicked
function start() {
    
}
