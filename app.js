"use strict"

///////////////////////////////////////////////////////////////////////////////
//                            Boilerplate
///////////////////////////////////////////////////////////////////////////////

const header = document.querySelector("header");
const endTurnBtn = document.querySelector("#endTurn");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
const mouse = { x:undefined, y:undefined };

//RESIZE CANVAS RESPONSIVELY  
function resizeCanvas(){
  let percentWindow = 0.5;  //What percent of the window width should the game board be 
  let minWidth = 300;       //What should the minimum width of the game board be
  if(window.innerWidth > minWidth/percentWindow){
    canvas.width = window.innerWidth * percentWindow;
  }
  else{
    canvas.width = minWidth;
  }
  canvas.height = canvas.width;
}

//////////////////////////////////////////////////////////////////////////////
//                            Object Constructors
//////////////////////////////////////////////////////////////////////////////



///////////////////////////// Game Constructor ///////////////////////////////

function Game(pB, pW, b){
  this.black = pB;
  this.white = pW;
  this.currentTurn = this.black;
  this.currentOpponent = this.white;
  this.board = b; 
}

//////////////////////////////////////////////

Game.prototype.endTurn = function(){
  if(this.currentTurn.placedStone){
    // intial mapping of neighbors before capturing
    this.board.mapNeighbors();
    
    // Get dragons
    this.black.getDragons(this.board);
    this.white.getDragons(this.board);

    // Capture stones
    this.currentOpponent.dragons.forEach(function(dragon){
      if(dragon.isSurrounded()){
        dragon.stones.forEach(function(stone){
          this.board.removeStone(stone);
          this.currentTurn.prisoners++;
        });
      }
    });
    
    // final mapping of neighbors after capturing
    this.board.mapNeighbors();
    
    // calculate score
    this.black.calcScore();
    this.white.calcScore();
    
    // switch currentTurn
    this.currentTurn.placedStone = null;
    let placeHolder = this.currentTurn
    this.currentTurn = this.currentOpponent;
    this.currentOpponent = placeHolder;

    
    console.log(this.currentTurn.color + "'s turn!");

  }
};

//////////////////////////////////////////////

Game.prototype.declareWinner = function(){
  if(this.black.score === this.white.score){
    console.log("draw!");
  }
  else{
    console.log(this.black.score > this.white.score ? "black" : "white");
  }
};

/////////////////////////// Player Constructor //////////////////////////////

function Player(id, c){
  this.ID = id;
  this.color = c;
  this.score = 0;
  this.prisoners = 0;
  this.territory = 0;
  this.placedStone = null;
  this.hoverStone = null;

  this.stonesInPlay = [];
  this.dragons = [];
  
}

//////////////////////////////////////////////

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
};

//////////////////////////////////////////////

Player.prototype.calcScore = function(){
  this.score = this.territory + this.prisoners;
};

//////////////////////////////////////////////

Player.prototype.getDragons = function(board){
  const player = this;
  board.forEachPoint(function(stone){
    if(stone){
      if(stone.color === player.color){
        
      }
    }
  });
};

//////////////////////////////////////////////

Player.prototype.hover = function(){
  
  // if(board.currentPoint !== this.hoverStone && board.currentPoint === null){
  //   board.removeStone(this.hoverStone);
  //   this.hoverStone = new Stone(mouse.x,  mouse.y, this.color === "black" ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)");
  //   board.addStone(this.hoverStone);
  // }
  
  
};

//////////////////////////////// Board Constructor //////////////////////////////

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

//////////////////////////////////////////////

Board.prototype.forEachPoint = function(func){
  this.stones.forEach(function(column) {
    column.forEach(function(point){
      func(point);
    });
  });
}

//////////////////////////////////////////////

Board.prototype.addStone = function(stone){
  this.stones[stone.x][stone.y] = stone;
  board.render();
}

//////////////////////////////////////////////

Board.prototype.removeStone = function(stone){
  this.stones[stone.x][stone.y] = null;
  board.render();
}

//////////////////////////////////////////////

Board.prototype.currentPoint = function(){
  return this.stones[mouse.x][mouse.y];
}

//////////////////////////////////////////////

Board.prototype.resize = function(){
  //find the width of each square
  this.squareWidth = canvas.width/(this.size + 1); //Add 1 to the board for margin around the grid
  
  Stone.prototype.radius = this.squareWidth * 0.4; //Set the size of each stone on the board
}

//////////////////////////////////////////////

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
      ctx.fillStyle = "black";
      ctx.fill();
      ctx.closePath();
    }
    for(let i = 4; i<=16; i+=6){
      for(let j = 4; j<=16; j+=6){
        makeDot(this.squareWidth*i, this.squareWidth*j)
      }
    }
  }

  // render stones and get their neigbors
  this.forEachPoint(function(stone){
    if(stone){ 
      stone.render();
    }
  });
};

//////////////////////////////////////////////

Board.prototype.mapNeighbors = function(){
  this.forEachPoint(function(stone){
    if(stone){
      stone.getNeighbors();
    }
  });
}


//////////////////////////// Dragon Constructor//////////////////////////////

function Dragon(){
  this.stones = [];
}

//////////////////////////////////////////////

Dragon.prototype.isSurrounded = function(){
  let surrounded = true;
    this.stones.forEach(function(stone){
      for(direction in stone.neighbor){
        if(stone.neighbor.hasOwnProperty(direction)){
          if(stone.neighbor[direction] === null){
            surrounded = false;
          }
        }
      }
    });
  return surrounded;
}


//////////////////////////// Stone Constructor //////////////////////////////

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

//////////////////////////////////////////////

Stone.prototype.radius = 0;

//////////////////////////////////////////////

Stone.prototype.getNeighbors = function(){
  // Populate the neighbor object
  this.neighbor.left = this.x - 1 > -1 ? board.stones[this.x - 1][this.y] : 'edge';
  this.neighbor.right = this.x + 1 < board.size ? board.stones[this.x + 1][this.y] : 'edge';
  this.neighbor.top = this.y - 1 > -1 ? board.stones[this.x][this.y - 1] : 'edge';
  this.neighbor.bottom = this.y + 1 <= board.size ? board.stones[this.x][this.y + 1] : 'edge';
};

//////////////////////////////////////////////

Stone.prototype.render = function(){
  ctx.beginPath();
  ctx.arc(this.x * board.squareWidth + board.squareWidth, this.y * board.squareWidth + board.squareWidth, this.radius, 0 , Math.PI * 2, false);
  ctx.fillStyle = this.color;
  ctx.fill();
};



/////////////////////////////////////////////////////////////////////////////////
//                            Initialization
/////////////////////////////////////////////////////////////////////////////////

const game = new Game(new Player(0,"black"), new Player(1, "white"), new Board(19));
const board = game.board;

function renderBoard(){
  resizeCanvas();
  board.resize();
  board.render();
}
renderBoard();


/////////////////////////////////////////////////////////////////////////////////
//                            Event Listeners
///////////////////////////////////////////////////////////////////////////////// 

/////////////////// On Click /////////////////////
canvas.addEventListener('click', function(){
  game.currentTurn.placeStone();
});

///////////////// Mouse Movement ////////////////////
canvas.addEventListener('mousemove',function(m){
  //update up mouse coordinates
  mouse.x = Math.round((m.x - canvas.getBoundingClientRect().left) / game.board.squareWidth)-1;
  mouse.y = Math.round((m.y - canvas.getBoundingClientRect().top) / game.board.squareWidth)-1;
  console.log(mouse.x + " " + mouse.y);
  // hover current player
  game.currentTurn.hover();
});

///////////////// Resize Screen //////////////////
window.addEventListener('resize', renderBoard); //update

