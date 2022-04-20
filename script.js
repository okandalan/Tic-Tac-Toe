const Player = (sign) => {
    this.sign = sign;
    const getSign = () => sign;
    return { getSign };
}

const gameBoard = ( () => {
    const board = ["", "", "", "", "", "", "", "", ""];
    
    const markSpot = (index, sign) => {
        if (index >= board.length)
            return false;

        if (board[index] == "") {
            board[index] = sign;
            return true;
        }
        else {
            return false;
        }
    }

    const getSpot = (index) => {
        return board[index];
    }

    const resetBoard = () => {
        for(let i = 0; i < board.length; i++)
            board[i] = "";
    }

    return {
        markSpot,
        resetBoard,
        getSpot,
    };
})();

const gameController = ( () => {
    const playerX = Player("X");
    const playerO = Player("O");
    let turn = 0;
    let over = false; 
    
    const whoseTurn = (turn) => {
        return turn % 2 == 0 ? playerX.getSign() : playerO.getSign();
    };
    
    const makeMove = (sign, index) => {
        return gameBoard.markSpot(index, sign);
    } 

    const checkWinner = (sign) => {
        let winner = null;
        const winningConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]



        for(let i = 0; i < 8; i++) {
            winner = sign;
                        
            if (gameBoard.getSpot(winningConditions[i][0]) != "" &&
                gameBoard.getSpot(winningConditions[i][0]) == gameBoard.getSpot(winningConditions[i][1]) &&
                gameBoard.getSpot(winningConditions[i][0]) == gameBoard.getSpot(winningConditions[i][2])) {
                    over = true;
                    break;
                }

            winner = null;
        }
        return winner;
    }

    const isOver = () => over;

    const reset = () => {
        gameBoard.resetBoard();
        turn = 0;
        over = false;
        displayController.changeMessage("X", false);
    }

    const playRound = (index, targetCell) => {
        let sign = whoseTurn(turn);
        if (makeMove(sign, index)) {
            turn++;

            displayController.markSpot(targetCell, sign);

            if (checkWinner(sign)) {
                displayController.changeMessage(sign, true);
            }
            else {
                displayController.changeMessage(whoseTurn(turn), false);

            }

        }
    }

    return {
        whoseTurn,
        isOver,
        playRound,
        reset,
    }

})();

const displayController = ( () => {
    const gameResult = document.querySelector(".message");
    const spots = document.querySelectorAll(".cell");
    const restartBtn = document.querySelector(".reset-btn");

    spots.forEach( (spot) => {
        spot.addEventListener("click", (e) => {
            if (!gameController.isOver()) {
                gameController.playRound(e.target.dataset.index, e.target)
            }
        })
    })

    const changeMessage = (sign, isWinner) => {
        if (isWinner) {

            gameResult.textContent = `Player ${sign} won the game!!`;
        }
        else {

            gameResult.textContent = `Player ${sign}'s turn`;
        }
    }

    const markSpot = (target, sign) => {
        target.textContent = sign;
    }

    const cleanBoard = () => {
        spots.forEach( (spot) => {
            spot.textContent = "";
        })
    }

    restartBtn.addEventListener("click", () => {
        cleanBoard();
        gameController.reset();
    })

    return {
        changeMessage,
        markSpot,
    }
})();