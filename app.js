"use strict"

/////////////////////////////////////////////////////////////VARIABLES////////////////////////////////

const header = document.querySelector("header");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

//varying size of the paying board, we will create a function to change board size
const boardSize = 19; //default size
let squareWidth; //we will calculate this in a function
let stoneRadius; //we will calculate this in a function

//Create the board 2d array
//this array will store our stones
let board = [];
for(let i = 0; i < boardSize; i++){
  let column = []
  for(let j = 0; j < boardSize; j++){
    column.push(null);
  }
  board.push(column);
}

//STONE CONSTRUCTOR
function Stone(x, y, color){
  this.position = { x: x, y: y};
  this.color = color;
  this.neighbor = {top: null, right: null, left: null, bottom: null};
}
//STONE METHODS
Stone.prototype.drawStone = function(){
  ctx.beginPath();
  //ctx.moveTo(this.position.x * squareWidth, this.position.y * squareWidth);
  ctx.arc(this.position.x * squareWidth, this.position.y * squareWidth,stoneRadius,0, Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
}

/////////////////////////////////////////////////////////////////////FUNCTIONS//////////////////////////

function resizeCanvas(){
  if(window.innerWidth > 600){
    canvas.width = window.innerWidth * 0.5;
  }else{
    canvas.width = 300;
  }
  canvas.height = canvas.width;
}

function resizeSquare(){
  squareWidth = canvas.width/(boardSize+1); //Add 1 to the board for margin
}

function resizeStones(){
  stoneRadius = squareWidth * 0.4;
}

function drawBoard(){
  ctx.beginPath();
  
  //Horizontal lines
  for(let i = 0; i <= boardSize; i++){
    ctx.moveTo(squareWidth, squareWidth + (squareWidth * i));
    ctx.lineTo(squareWidth * (boardSize), squareWidth + (squareWidth * i));
  }

  //Vertical lines
  for(let i = 0; i < boardSize; i++){
    ctx.moveTo(squareWidth + (squareWidth * i), squareWidth);
    ctx.lineTo(squareWidth + (squareWidth * i), squareWidth * (boardSize));
  }
  ctx.stroke();
  ctx.closePath();
  
  //Make dots
  if(boardSize === 19){
    function makeDot(x, y){
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }
    for(let i = 4; i<=16; i+=6){
      for(let j = 4; j<=16; j+=6){
        makeDot(squareWidth*i, squareWidth*j)
      }
    }
  }
}

function drawStones(){
  board.forEach(function(column) {
    column.forEach(function(stone){
      if(stone){
        // console.log(stone);
        stone.drawStone();}
    }, this);
  }, this);
}

function clearBoard(){
  ctx.clearRect(0,0,canvas.width, canvas.height);
}

function addStone(x, y, c){
  // console.log(board[x-1][y-1] = new Stone(x,y,c));
  board[x-1][y-1] = new Stone(x,y,c);
  updateBoard();
  return board[x-1][y-1];
}

function removeStone(x, y){
  board[x-1][y-1] = null;
  updateBoard();
}

const mouse = {
  x:undefined,
  y:undefined
}

canvas.addEventListener('mousemove',function(m){
  mouse.x = m.x - canvas.getBoundingClientRect().left;
  mouse.y = m.y - canvas.getBoundingClientRect().top;
  hover();
});

function hover(){
  let lowerBound =  0.5 * squareWidth;
  let upperBound = squareWidth* (boardSize + 1) - lowerBound
  if(mouse.x >= lowerBound && mouse.x <= upperBound && mouse.y >= lowerBound && mouse.y >= lowerBound && mouse.y <= upperBound){
    //console.log(`${mouse.x} ${mouse.y}`);
    let currentPos = addStone(Math.round(mouse.x/squareWidth), Math.round(mouse.y/squareWidth), 'rgba(0,0,0,0.6)');
    if(Math.round(mouse.x/squareWidth) != currentPos.position.x || Math.round(mouse.y/squareWidth) != currentPos.position.y){
      removeStone(currentPos.position.x, currentPos.position.y);
    }
    console.log(currentPos);
  }
}

addStone(1,1,"black");
addStone(1,2,"white");
addStone(2,3);

////////////////////////////////////////////////////////INITIALIZATION + UPDATE/////////////////////

function updateBoard(){
  resizeCanvas();
  resizeSquare();
  resizeStones();
  clearBoard();
  drawBoard();
  drawStones();
}
updateBoard(); //initialize
window.addEventListener('resize', updateBoard); //update

