"use strict"

const boardSize = 13;

const board = document.createElement("div");
board.className="board";

document.body.appendChild(board);

for(let i = 0; i < boardSize; i++){
  const row = document.createElement("div");
  row.className="row";
  let currentRow = document.querySelector(".board").appendChild(row);
  // let currentRow = document.querySelector(`.row:nth-of-type(0n + ${i+1})`);
  for(let j = 0; j < boardSize; j++){
    const square = document.createElement("div");
    square.className="square";
    let currentSquare = currentRow.appendChild(square);
    const piece = document.createElement("div");
    piece.className="piece";
    currentSquare.appendChild(piece);
  }
}
