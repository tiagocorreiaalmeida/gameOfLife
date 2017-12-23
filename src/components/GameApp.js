import React from "react";
import ReactDOM from "react-dom";
import Board from "./Board";

const createBoard = (cols, rows) => {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows);
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

        this.state = {
            board: [],
            cols: 30,
            rows: 45,
            interval: 1000
        };
    }

    setUpGrid(cols, rows) {
        let board = createBoard(cols, rows);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                board[i][j] = Math.round(Math.random(2));
            }
        }
        this.setState(() => ({ cols, rows, board }));
        setTimeout(this.start(board, cols, rows), 1000);
    }

    start(board, cols, rows) {
        let timer = setInterval(
            this.nextGridState(
                this.state.board.length > 0 ? this.state.board : board,
                this.state.cols > 0 ? this.state.cols : cols,
                this.state.rows > 0 ? this.state.rows : rows
            ),
            this.state.interval
        );
    }

    componentDidMount() {
        this.setUpGrid(30, 45);
    }

    setSmallScreen() {
        this.setUpGrid(30, 45);
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
        let next = grid;
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let state = grid[i][j];
                let neighbors = this.countNeighbors(grid, cols, rows, i, j);
                if (state == 0 && neighbors == 3) {
                    next[i][j] = 1;
                } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                    next[i][j] == 0;
                } else {
                    next[i][j] = state;
                }
            }
        }
        console.log(next);
        this.setState(() => ({ board: next }));
    }

    countNeighbors(grid, cols, rows, x, y) {
        let sum = 0;
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let col = (x + i + cols) % cols;
                let row = (y + i + rows) % rows;
                sum += grid[col][row];
            }
        }
        sum -= grid[x][y];
        return sum;
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
                <Board board={this.state.board} />
            </div>
        );
    }
}
