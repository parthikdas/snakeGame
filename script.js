let grid = document.querySelector('.grid')
let button = document.getElementById('start')
let scoreBoard = document.querySelector('.score')
let width = 11, score = 0
let currentSnake = [2,1,0], currentIndex = 0
let direction = 1, speed = .8, intervalTime = 1000, interval = 0
let screenHeight = window.innerHeight, screenWidth = window.innerWidth

// Function to check user is on mobile or computer
window.mobileCheck = function() { // Using regex, taken from stackOverFlow :)
    let check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
  };
console.log(window.mobileCheck())  

// Video and all
let video = document.getElementById('video')
let canvas = document.getElementById('canvas')
let ctx = canvas.getContext('2d')
let model
let videoWidth = 150
function videoStream() {
    navigator.mediaDevices.getUserMedia({
        video: {height: videoWidth, width: videoWidth},
        audio: false
    })
    .then(stream => {
        video.srcObject = stream
    })
    .catch(err => { // not allowed by user
        canvas.style.boxShadow = 'none'
        if(window.mobileCheck()) { // its a mobile
            alert('Use Buttons to play')
            document.getElementById('controlButtons').style.display = 'block'
        } else { // its a computer
            alert('Use Arrow Keys to play')
        }
    })
}
async function detectFaces() {
    const prediction = await model.estimateFaces(video, false)
    ctx.drawImage(video, 0, 0, videoWidth, videoWidth)
    prediction.forEach(pred => { // pred corresponds to 1 face
        ctx.fillStyle = 'red'
        pred.landmarks.forEach(landmark => {
            ctx.fillRect(landmark[0], landmark[1], 5, 5)
        })
        if(pred.landmarks[0][0] - pred.landmarks[4][0] < 10) { // if left eye go near left ear move left
            moveRight() // as camera is taking mirror image so calling this instead of left
        }
        if(pred.landmarks[5][0] - pred.landmarks[1][0] < 10) { // if right eye go near right ear move right
            moveLeft()
        }
        if(pred.landmarks[2][1] - pred.landmarks[0][1] < 10) { // if nose comes near to eye move up
            moveUp()
        }
        if(pred.landmarks[3][1] - pred.landmarks[2][1] < 10) { // if nose comes near to chin move down
            moveDown()
        }
    })
}
videoStream()
video.addEventListener('loadeddata', async () => {
    model = await blazeface.load()
    setInterval(detectFaces, 40)
})

// Function to setup the game
function setup() {
    // Setting size of the grid and canvas
    grid.style.height = grid.style.width = (screenHeight < screenWidth ? screenHeight - screenHeight*0.2 : screenWidth - screenWidth*0.1) + 'px'
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