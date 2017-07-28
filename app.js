"use strict"

////////////////////////////// Boilerplate ////////////////////////////////

const header = document.querySelector("header");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
const mouse = { x:undefined, y:undefined };

//RESIZE CANVAS RESPONSIVELY  
function resizeCanvas(){
  let percentWindow = 0.5;  //What percent of the window width should the game board be 
  let minWidth = 300;       //What should the minimum width of the game board be
  if(window.innerWidth > minWidth/percentWindow){
    canvas.width = window.innerWidth * percentWindow;
  }else{
    canvas.width = minWidth;
  }
  canvas.height = canvas.width;
}

///////////////////////////// Object Constructors //////////////////////////////

////////// Game Constructor ///////////

function Game(pB, pW, b){
  this.black = pB;
  this.white = pW;
  this.currentTurn = this.black;
  this.board = b; 
}

Game.prototype.endTurn = function(){
  if(this.currentTurn.placedStone){
    this.black.calcScore();
    this.white.calcScore();
    this.currentTurn.placedStone = null;
    this.currentTurn = this.currentTurn === this.black ? this.white : this.black;

    console.log(this.currentTurn.color + "'s turn!");

  }
};

Game.prototype.declareWinner = function(){
  if(this.black.score === this.white.score){
    console.log("draw!");
  }
  else{
    console.log(this.black.score > this.white.score ? "black" : "white");
  }
};

////////// Player Constructor ///////////

function Player(id, c){
  this.ID = id;
  this.color = c;
  this.score = 0;
  this.prisoners = 0;
  this.placedStone = null;  //this could be set to null if a player passes
}

Player.prototype.placeStone = function(){
  //Toggle a stone on or off
  if(board.currentPoint() === null && this.placedStone === null){
    this.placedStone = new Stone(mouse.x, mouse.y, this.color);
    board.addStone(this.placedStone);
  }
  else if(board.currentPoint() === this.placedStone){
    board.removeStone(this.placedStone);
    this.placedStone = null;
  }
  renderBoard();
};

Player.prototype.calcScore = function(){
  let territory = 0;
  /**
   * function for calculating territory
   */
  this.score = territory + this.prisoners;
};

Player.prototype.hover = function(){
  // function for hovering during ones turn
};

////////// Board Constructor ///////////

function Board(s){
  this.size = s;
  this.stones = (function(){
    let b = [];
    for(let i = 0; i < s; i++){
      let column = []
      for(let j = 0; j < s; j++){
        column.push(null);
      }
      b.push(column);
    }
    return b;
  this.squareWidth;
  })();
}

Board.prototype.addStone = function(stone){
  this.stones[stone.x][stone.y] = stone;
}

Board.prototype.removeStone = function(stone){
  this.stones[stone.x][stone.y] = null;
}

Board.prototype.currentPoint = function(){
  return this.stones[mouse.x][mouse.y];
}

Board.prototype.resize = function(){
  //find the width of each square
  this.squareWidth = canvas.width/(this.size + 1); //Add 1 to the board for margin around the grid
  
  Stone.prototype.radius = this.squareWidth * 0.4; //Set the size of each stone on the board
}

Board.prototype.render = function(){

  // Ensure that we are not making multiple instances of objects everytime the board is rendered
  ctx.clearRect(0,0,canvas.width, canvas.height); 

  ctx.beginPath();
  
  //Horizontal lines
  for(let i = 0; i <= this.size; i++){
    ctx.moveTo(this.squareWidth, this.squareWidth + (this.squareWidth * i));
    ctx.lineTo(this.squareWidth * (this.size), this.squareWidth + (this.squareWidth * i));
  }

  //Vertical lines
  for(let i = 0; i < this.size; i++){
    ctx.moveTo(this.squareWidth + (this.squareWidth * i), this.squareWidth);
    ctx.lineTo(this.squareWidth + (this.squareWidth * i), this.squareWidth * (this.size));
  }
  ctx.stroke();
  ctx.closePath();
  
  //Make dots
  if(this.size === 19){
    function makeDot(x, y){
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2, false);
      ctx.fill();
      ctx.closePath();
    }
    for(let i = 4; i<=16; i+=6){
      for(let j = 4; j<=16; j+=6){
        makeDot(this.squareWidth*i, this.squareWidth*j)
      }
    }
  }

  // render stones
  this.stones.forEach(function(column) {
    column.forEach(function(stone){
      if(stone){
        stone.render();
      }
    }, this);
  }, this);
};

////////// Stone Constructor ///////////

function Stone(x, y, c){
  this.x = x;
  this.y = y;
  this.color = c;
  this.neighbor = {
    top: null,
    bottom: null,
    left: null,
    right: null
  }
}

Stone.prototype.radius = 0;

Stone.prototype.getNeighbors = function(){
  // Populate the neighbor object
}

Stone.prototype.render = function(){
  ctx.beginPath();
  ctx.arc(this.x * board.squareWidth, this.y * board.squareWidth, this.radius, 0 , Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
}

///////////////////////////// Initialization //////////////////////////////

const game = new Game(new Player(0,"black"), new Player(1, "white"), new Board(19));
const board = game.board;

///////////////////////////// Event Listeners //////////////////////////////

//place a stone
canvas.addEventListener('click', function(){
  game.currentTurn.placeStone();
});

//set the mouse positions to coordinates on the board.
canvas.addEventListener('mousemove',function(m){
  mouse.x = Math.round((m.x - canvas.getBoundingClientRect().left)/board.squareWidth);
  mouse.y = Math.round((m.y - canvas.getBoundingClientRect().top)/board.squareWidth);
});

//resize and render board
function renderBoard(){
  resizeCanvas();
  board.resize();
  board.render();
}
renderBoard(); //initialize
window.addEventListener('resize', renderBoard); //update
