"use strict"

//Boilerplate
const header = document.querySelector("header");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');

/////////////////////////////////////////////////DRAW BOARD//////////////////////////////////////////////////////

//Dynamic Canvas sizing
function resizeCanvas(){
  if(window.innerWidth > 600){
    canvas.width = window.innerWidth * 0.5;
  }else{
    canvas.width = 300;
  }
  canvas.height = canvas.width;
}
resizeCanvas();  //initialize
window.addEventListener('resize', resizeCanvas);  //update

//Establish some variables
const boards = {
  "19x19":19,
  "13x13":13,
  "9x9":9
} //varying size of the paying board, we will create a function to change board size
let board = boards["19x19"]; //default size
let squareWidth; //we will calculate this in a function

function resizeSquare(){
  squareWidth = canvas.width/(board+1); //Add 2 to the board for margin
  drawBoard(); //we call draw board here
}
resizeSquare(); //initialize
window.addEventListener('resize', resizeSquare);

function drawBoard(){
  ctx.beginPath();
  
  //Horizontal lines
  for(let i = 0; i <= board; i++){
    ctx.moveTo(squareWidth, squareWidth + (squareWidth * i));
    ctx.lineTo(squareWidth * (board), squareWidth + (squareWidth * i));
  }

  //Vertical lines
  for(let i = 0; i < board; i++){
    ctx.moveTo(squareWidth + (squareWidth * i), squareWidth);
    ctx.lineTo(squareWidth + (squareWidth * i), squareWidth * (board));
  }
  ctx.stroke();
  ctx.closePath();
  
  //Make dots
  if(board === 19){
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

///////////////////////////////////////////////////////GAME LOGIC///////////////////////////////

let stoneRadius = squareWidth * 0.4; //initialize
window.addEventListener('resize', function(){
  stoneRadius = squareWidth * 0.4;
}); //update

function Stone(x, y, color){
  this.position = { x: x, y: y};
  this.color = color;
  this.neighbor = {top: null, right: null, left: null, bottom: null};
}

Stone.prototype.drawStone = function(){
  ctx.beginPath();
  ctx.moveTo(this.position.x, this.position.y);
  ctx.arc(this.position.x, this.position.y,stoneRadius,0, Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
}
//test
let stones = []
var myStone = new Stone(squareWidth, squareWidth);
stones.push(myStone);
myStone.drawStone();

var hisStone = new Stone(squareWidth * 2, squareWidth, "white");
hisStone.drawStone();
stones.push(hisStone);

window.addEventListener('resize',function(){
  for(let i = 0; i < stones.length; i++){
    stones[i].drawStone();
  }
});
