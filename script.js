var canvas =  document.getElementById('game');
canvas.width = 400;
canvas.height = 400;
var context = canvas.getContext('2d');
// all the object in the game are built as multiplayer of 
//the one basic square size. it's best if this number
//divides evenly into the canvas dimension (above).
var squareSize = 20;
var numSquares = canvas.width / squareSize; 
var scoreBox = document.getElementById('scoreBox');
var score = 0;
var count = 0;
/****************************************************/
// please dont change code above this line
/****************************************************/

document.body.style.backgroundColor = 'cornflowerblue';
document.body.style.color = 'gold';
canvas.style.backgroundColor = 'black';

// game gets faster as the delay number goes down towards 1
// make it biger to go slower
var gameloopDelay = 10;

// snake can start with 1-n cells
var startingSnakeSize = 4;

// we can change how many points the player gets per apple eaten
var pointsPerApple = 5;

// snake object defines the head location how big rach move 
//is starting color and hold the list of all snake cells
//snake always starts in the same place going the same 
//direction
var snake = {
 x: 160,
 y: 160,
 color: 'green',
 dx: squareSize,
 dy: 0,
 maxCells: startingSnakeSize,
 cells: []
};

// apple objects starts with a default loaction & color 
var apple = {
  x: 0,
  y: 0,
  color: 'red',
};
// but we the apple a random location before game starts
setNextRandomAppletLocation();

// game loop
function loop() {
  requestAnimationFrame(loop);
  //control the game speed by skipping some no. of frames
  if (++count < gameloopDelay) {
    return;
  }

  // reset count each time do run through the game loop
  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);
  snake.x += snake.dx;
  snake.y += snake.dy;
  //console.log("snake head: "+snake.x+" "+snake.y);

  // in this version the snake "wraps" at the edges of the 
  // screen in many versions of this game he would die if 
  // he hits the edge but we are to kind of that.
  if (snake.x < 0) {
    // snake head has gone off the board of the left
    snake.x = canvas.width - squareSize; 
  } else if (snake.x >= canvas.width) {
    // snake head has gone off the board of the right 
    snake.x = 0;
  } // else x is within the boundaries of the board do nothing special
  if (snake.y < 0) {
    //snake head has gone off the board of the top
    snake.y = canvas.height - squareSize;
  } else if (snake >= canvas.height) {
    //snake head has gone off the board of the bottom
    snake.y = 0;
  } // else x is within the boundaries of the board do nothing special
  // add a new cell to the front of the snake at the new
  // head location this moves snake one unit in whatever
  // direction he's going "unshift" is javascript front
  // "insert at front".
  snake.cells.unshift({
    x: snake.x,
    y: snake.y
  });
  // to stay the same size as we move,
  // take the last cell off the snake's tail
  // if he's eating an apple we'll make longer down below
  // "pop" is javascript for "remove from the end"
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
      
  // we need to check the snake head location to see if
  // it is "eating"  the apple if so  score goes up and 
  // snake grows
  var head = snake.cells[0];
  // if the snake eats the apple his head square will be 
  // drawn where apple square was 
  // we will need to draw a new apple at random spot   
  if (head.x === apple.x && head.y === apple.y) {
    // snake grows by one cell
    snake.maxCells++;
    score  =score + pointsPerApple;
    setNextRandomAppletLocation();
  }

  // now lets check to see if the head is colliding with
  // any of the rest of the snake if so snake dies 
  // start checking at the cell 1 not 0 (head)
  // although we could probably start at 5 because of how
  // the snake has to wrap 
  var i = 1;
  while (i < snake.cells.length) {
    if (head.x === snake.cells[i].x && head.y === snake.cells[i].y) {
      //collision reset game 
      snake.x = 160;
      snake.y = 160;
      snake.cells = [];
      snake.maxCells = 4;
      snake.dx = squareSize;
      snake.dy = 0;
      setNextRandomAppletLocation();
    }
    i = i + 1;
  }

  // now we can draw the apple new or old
  context.fillStyle = apple.color;
  context.fillRect(apple.x, apple.y, squareSize - 1, squareSize - 1);

  // and we can draw the snake 
  context.fillStyle = snake.color;
  snake.cells.forEach(function (cell, index) {
    context.fillRect(cell.x, cell.y, squareSize - 1, squareSize - 1);
  });

  // update the score 
  scoreBox.innerHTML = "Score: " + score;
}  

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function setNextRandomAppletLocation() {
  apple.x = getRandomInt(0, numSquares) * squareSize
  apple.y = getRandomInt(0, numSquares) * squareSize
}

// handle arrow keys to change the snake direction
// snake travels left and right 
// or up and down
// one square at a time.
document.addEventListener('keydown', function (e) {
  if (e.which === 37 && snake.dx === 0) {
    snake.dx = -squareSize;
    snake.dy = 0;
  } else if (e.which === 38 && snake.dx === 0) {
    snake.dy = -squareSize;
    snake.dx = 0;
  } else if (e.which === 39 && snake.dx === 0) {
    snake.dx = squareSize;
    snake.dy = 0;
  } else if (e.which === 40 && snake.dx === 0) {
    snake.dy = squareSize;
    snake.dx = 0;
  }     
  // else not a key we care about
});

// start the game ball rolling.
// tell the browser to call function loop over and over
requestAnimationFrame(loop);
