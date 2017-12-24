import React from "react";
import ReactDOM from "react-dom";
import Board from "./Board";

const createBoard = (cols, rows) => {
    let arr = [];

    for(let i = 0; i < cols; i++) {
        arr[i] = [];
        for(let j = 0; j < rows; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
};

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.setUpGrid = this.setUpGrid.bind(this);
        this.setSmallScreen = this.setSmallScreen.bind(this);
        this.setMediumScreen = this.setMediumScreen.bind(this);
        this.setBigScreen = this.setBigScreen.bind(this);
        this.nextGridState = this.nextGridState.bind(this);
        this.getNeighbours = this.getNeighbours.bind(this);

        this.state = {
            board: null,
            cols: 30,
            rows: 45,
            interval: 200
        };
    }

    setUpGrid(cols, rows) {
        let board = createBoard(cols, rows);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                board[i][j] = Math.round(Math.random(2));
            }
        }
        this.setState({ cols, rows, board: JSON.parse(JSON.stringify(board))});
    }

    start(board, cols, rows) {
        
    }

    componentDidMount() {
        if(!this.state.board) {
            this.setUpGrid(30, 45);
            this.start(this.state.board, this.state.cols, this.state.rows);
            this.timerID = setInterval(() => {
                console.log("SetInterval");
                this.nextGridState(
                    this.state.board,
                    this.state.cols,
                    this.state.rows
                );
            }, this.state.interval);
        }
    }

    setSmallScreen() {
        if(!this.state.board) {
            this.setUpGrid(30, 45);
        }
    }

    setMediumScreen() {
        this.setUpGrid(45, 60);
    }

    setBigScreen() {
        this.setUpGrid(60, 80);
    }

    changeInterval(time) {
        let interval;
        switch (time) {
            case "slow":
                interval = 2000;
                break;
            case "normal":
                interval = 1000;
                break;
            case "fast":
                interval = 500;
                break;
        }
        this.setState(() => ({ interval }));
    }

    nextGridState(grid, cols, rows) {
        let next = JSON.parse(JSON.stringify(grid));
        console.log("nextGridState");
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let state = grid[i][j];
                let neighbors = this.getNeighbours(i, j, grid).reduce((a, b) => a + b);

                switch(state) {
                    case 1:
                      if(neighbors < 2) {
                        next[i][j] = 0;
                      }
                      if(neighbors > 3) {
                        next[i][j] = 0;
                      }
                      break;
                    case 0:
                      if(neighbors === 3) {
                        next[i][j] = 1;
                      }
                      break;
                    default:
                  }
            }
            if (i + 1 == cols) {
                console.log("loop ended");
            }
        }
        console.log("set grid");
        this.setState({ board: next});
    }

    getNeighbours(row, col, array) {
        let neighbours = [];
        for(let i = -1; i < 2; i++) {
          for(let j = -1; j < 2; j++) {
            let newI = row + i;
            let newJ = col + j;
            if(
                (newI >= 0 && newJ >= 0)
                && (newI < array.length && newJ < array[0].length) 
                && (i !== 0 || j !== 0)
              ) {
              neighbours.push(array[newI][newJ]);
            } 
          }
        }
        return neighbours;
      }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <div>
                <h1>Game of life</h1>
                <button onClick={this.setSmallScreen}>Size: 45x30</button>
                <button onClick={this.setMediumScreen}>Size: 60x45</button>
                <button onClick={this.setBigScreen}>Size: 60x45</button>
                <button
                    onClick={() => {
                        this.changeInterval("slow");
                    }}
                >
                    Slow{" "}
                </button>
                <button
                    onClick={() => {
                        this.changeInterval("normal");
                    }}
                >
                    Normal{" "}
                </button>
                <button
                    onClick={() => {
                        this.changeInterval("fast");
                    }}
                >
                    Fast{" "}
                </button>
                {
                    this.state.board && <Board board={this.state.board} />
                }
            </div>
        );
    }
}