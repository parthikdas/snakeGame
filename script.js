let grid = document.querySelector('.grid')
let button = document.getElementById('start')
let scoreBoard = document.querySelector('.score')
let width = 11, score = 0
let currentSnake = [2,1,0], currentIndex = 0
let direction = 1, speed = .8, intervalTime = 1000, interval = 0

let video = document.querySelector('#video')
let canvas = document.querySelector('#canvas')
let ctx = canvas.getContext('2d')
// Video and all
const videoStream = () => {
    navigator.mediaDevices.getUserMedia({
        video: {height: window.innerHeight*0.2, width: window.innerHeight*0.2},
        audio: false
    })
    .then(stream => {
        video.srcObject = stream
    })
    .catch(err => {
        canvas.style.boxShadow = 'none'
        document.getElementById('controlButtons').style.display = 'block'
    })
}
const detectFaces = async () => {
    ctx.drawImage(video, 0, 0, 350, 250)
}
videoStream()
video.addEventListener('loadeddata' , async () => {
    //model = await blazeface.load()
    setInterval(detectFaces, 40)
})


// Function to setup the game
function setup() {
    // Setting size of the grid and canvas
    let screenHeight = window.innerHeight, screenWidth = window.innerWidth
    grid.style.height = grid.style.width = (screenHeight < screenWidth ? screenHeight - screenHeight*0.2 : screenWidth - screenWidth*0.1) + 'px'
    canvas.style.height = canvas.style.width = screenHeight*0.2 + 'px'
    scoreBoard.innerHTML = score
    // Adding the inner boxes
    for(let i = 0; i < width * width; i++) { // needed 11 to make the chess board effect
        let div = document.createElement('div')
        div.classList.add(i&1 ? 'deepblue' : 'blue')
        grid.append(div)
    }
}
setup() // This will be called as it is

// Function to start the game when button is clicked
function start() {
    button.disabled = true
    // Setting inital score to 0
    score = 0
    scoreBoard.innerHTML = score
    let squares = document.querySelectorAll('.grid div')
    currentIndex = 0
    currentSnake = [2,1,0]
    currentSnake.forEach(index => {
        squares[index].classList.add(index == currentSnake.length-1 ? 'snake-head':'snake')
    })
    randomApple(squares)
    interval = setInterval(moveOutcome,intervalTime)
}

// Function to check the next step outcome
function moveOutcome() {
    let squares = document.querySelectorAll('.grid div')
    if(gameOver(squares)) {
        alert('You hit something')
        setTimeout(() => { // reset
            button.disabled = false
            for(let i = 0; i < width * width; i++) {
                squares[i].classList.remove('snake', 'snake-head', 'apple')
            }
        }, 2000)
        return clearInterval(interval)
    } else {
        moveSnake(squares)
    }
}

// Function to move the snake
function moveSnake(squares) {
    let tail = currentSnake.pop()
    squares[tail].classList.remove('snake')
    squares[currentSnake[0]].classList.remove('snake-head') // remove the old snake head
    squares[currentSnake[0]].classList.add('snake') // make it normal piece
    currentSnake.unshift(currentSnake[0] + direction)
    // movement ends
    eatApple(squares, tail)
    squares[currentSnake[0]].classList.add('snake-head')
}

// Function to change the direction
function moveRight() {
    if((currentSnake[0]+1) % width && currentSnake[0] + 1 != currentSnake[1]) // if right exists and its not the snake 2nd piece then only go right
        direction = 1
}
function moveLeft() {
    if(currentSnake[0] % width && currentSnake[0] - 1 != currentSnake[1]) // if left exists and its not the snake 2nd piece then only go left
        direction = -1
}
function moveUp() {
    if(currentSnake[0] - width > 0 && currentSnake[0] - width != currentSnake[1]) // if top exists and its not the snake 2nd piece then only go top
        direction = -width
}
function moveDown() {
    if(currentSnake[0] + width < 121 && currentSnake[0] + width != currentSnake[1]) // if bottom exists and its not the snake 2nd piece then only go bottom
        direction = width
}
document.body.onkeyup = function(e) {
    if(e.keyCode == 39) { // Right arrow key
        moveRight()
    }
    else if(e.keyCode == 37) { // Left arrow key
        moveLeft()
    }
    else if(e.keyCode ==  38) { // Up arrow key
        moveUp()
    }
    else if(e.keyCode == 40) { // Down arrow key
        moveDown()
    }
}

// Function to generate random apple
function randomApple(squares) {
    let applePosition
    do { // so that apple does not appear on body of snake
        applePosition = Math.floor(Math.random() * 121)
    } while(currentSnake.includes(applePosition))
    squares[applePosition].classList.add('apple')
}

// Function to eat apple
function eatApple(squares, tail) {
    if(squares[currentSnake[0]].classList.contains('apple')) {
        squares[currentSnake[0]].classList.remove('apple')
        squares[tail].classList.add('snake') // feed the snake
        currentSnake.push(tail)
        randomApple(squares)
        scoreBoard.innerHTML = ++score
        clearInterval(interval)
        intervalTime *= speed // snake becomes faster
        interval = setInterval(moveOutcome, intervalTime)
    }
}

// Gameover Function
function gameOver(squares) {
    if((currentSnake[0] + width >= width * width && direction == width) || // hitting the bottom wall
       (currentSnake[0] - width <= 0 && direction == -width) || // hitting the top wall
       (currentSnake[0] % width == width - 1 && direction == 1) || // hitting the right wall
       (currentSnake[0] % width == 0 && direction == -1) || // hitting the left wall
       (squares[currentSnake[0] + direction].classList.contains('snake')) // eating itself
    )
        return 1
    return 0
}