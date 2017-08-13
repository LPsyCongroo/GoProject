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

// MOUSE COORDINATES
const mouse = {
  x:undefined,
  y:undefined
}
//set the mouse positions to coordinates on the board.
canvas.addEventListener('mousemove',function(m){
  mouse.x = Math.round((m.x - canvas.getBoundingClientRect().left)/squareWidth);
  mouse.y = Math.round((m.y - canvas.getBoundingClientRect().top)/squareWidth);
  console.log(mouse.x + ', ' + mouse.y);
});

//STONE CONSTRUCTOR
function Stone(x, y, color){
  this.x = x;
  this.y = y;
  this.color = color || "black";
  this.neighbor = {top: null, right: null, left: null, bottom: null};
}
//STONE METHODS
Stone.prototype.drawStone = function(){
  ctx.beginPath();
  ctx.arc(this.x * squareWidth, this.y * squareWidth,stoneRadius,0, Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
}

//PLAYER
function Player(isBlack){
  this.sTurn = false;
  
}

/////////////////////////////////////////////////////////////////////FUNCTIONS//////////////////////////

//Responsive canvas sizing.  
function resizeCanvas(){
  let percentWindow = 0.5;  //These are set to variables 
  let minWidth = 300;       //so they can be easily changed.
  if(window.innerWidth > minWidth/percentWindow){
    canvas.width = window.innerWidth * percentWindow;
  }else{
    canvas.width = minWidth;
  }
  canvas.height = canvas.width;
}

function resizeSquare(){
  squareWidth = canvas.width/(boardSize+1); //Add 1 to the board for margin around the grid
}

function resizeStones(){
  stoneRadius = squareWidth * 0.4;
}

//function that renders board
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

//function that renders all stones in play
function drawStones(){
  board.forEach(function(column) {
    column.forEach(function(stone){
      if(stone){
        stone.drawStone();}
    }, this);
  }, this);
}

//clear board so we dont redraw layers of the same elements with canvas
function clearBoard(){
  ctx.clearRect(0,0,canvas.width, canvas.height); 
}

//place a stone in the board array
function addStone(x, y, c){
  if(x >= 1 && y >= 1){
    let space = board[x-1][y-1];
    if(!space) {
      space = new Stone(x,y,c);
    }
    updateBoard();
    return space;
  }
}

// function to remove stone from board
function removeStone(x, y){
  if(x >= 1 && y >= 1){
    board[x-1][y-1] = null;
    updateBoard();
  }
}

//A function for creating a transparent stone that you can hover when it is your turn
function hover(){
  
}

// toggle a stone as placed or not
function placeStone(){

}

// changes to the board are permanent
function endTurn(){

}

// pass, no stone is placed this turn
function pass(){

}

// function that calculates territory and captured pieces each turn
function calculateScore(){

}

addStone(1,1,"black");
addStone(1,2,"white");
addStone(2,3);  //why does this automatically become transparent?

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


