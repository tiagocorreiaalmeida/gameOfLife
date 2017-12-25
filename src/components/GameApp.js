import React from "react";
import ReactDOM from "react-dom";
import Board from "./Board";

const createBoard = (cols, rows) => {
    let arr = [];

    for (let i = 0; i < cols; i++) {
        arr[i] = [];
        for (let j = 0; j < rows; j++) {
            arr[i][j] = 0;
        }
    }
    return arr;
};

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.setUpGrid = this.setUpGrid.bind(this);
        this.changeGrid = this.changeGrid.bind(this);
        this.nextGridState = this.nextGridState.bind(this);
        this.getNeighbours = this.getNeighbours.bind(this);
        this.start = this.start.bind(this);
        this.controller = this.controller.bind(this);
        this.clear = this.clear.bind(this);
        this.play = this.play.bind(this);
        this.state = {
            board: null,
            cols: 30,
            rows: 45,
            interval: "normal",
            count: 0,
            pause: false
        };
    }

    setUpGrid(cols, rows) {
        let board = createBoard(cols, rows);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                board[i][j] = Math.round(Math.random(2));
            }
        }
        this.setState({
            cols,
            rows,
            board: JSON.parse(JSON.stringify(board)),
            count: 0
        });
    }

    start(interval) {
        let intervalIn = interval ? interval : this.state.interval;
        let timer;
        if (this.state.count === 0) {
            this.setUpGrid(this.state.cols, this.state.rows);
        }

        clearInterval(this.timerID);

        switch (intervalIn) {
            case "slow":
                timer = 3000;
                break;
            case "normal":
                timer = 200;
                break;
            case "fast":
                timer = 5;
                break;
        }
        this.timerID = setInterval(() => {
            this.nextGridState(
                this.state.board,
                this.state.cols,
                this.state.rows
            );
            if (this.state.board && this.state.board.length > 0) {
                this.setState((prevState, props) => ({
                    count: prevState.count + 1
                }));
            }
        }, timer);
    }

    clear() {
        clearInterval(this.timerID);
        this.setState(() => ({
            board: createBoard(this.state.cols, this.state.rows),
            count: 0,
            pause: false
        }));
    }

    componentDidMount() {
        if (!this.state.board) {
            this.setUpGrid(30, 45);
            this.start();
        }
    }

    changeGrid(size) {
        switch (size) {
            case "small":
                this.setUpGrid(30, 45);
                break;
            case "medium":
                this.setUpGrid(45, 60);
                break;
            case "big":
                this.setUpGrid(60, 80);
        }
        this.start();
    }

    changeInterval(interval) {
        this.setState(() => ({ interval }));
        this.start(interval);
    }

    play() {
        this.start();
    }

    nextGridState(grid, cols, rows) {
        let next = JSON.parse(JSON.stringify(grid));
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let state = grid[i][j];
                let neighbors = this.getNeighbours(i, j, grid).reduce(
                    (a, b) => a + b
                );

                switch (state) {
                    case 1:
                        if (neighbors < 2) {
                            next[i][j] = 0;
                        }
                        if (neighbors > 3) {
                            next[i][j] = 0;
                        }
                        break;
                    case 0:
                        if (neighbors === 3) {
                            next[i][j] = 1;
                        }
                        break;
                    default:
                }
            }
        }
        this.setState({ board: next });
    }

    getNeighbours(row, col, array) {
        let neighbours = [];
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                let newI = row + i;
                let newJ = col + j;
                if (
                    newI >= 0 &&
                    newJ >= 0 &&
                    (newI < array.length && newJ < array[0].length) &&
                    (i !== 0 || j !== 0)
                ) {
                    neighbours.push(array[newI][newJ]);
                }
            }
        }
        return neighbours;
    }

    controller() {
        this.state.pause ? this.start() : clearInterval(this.timerID);
        this.setState((prevState, props) => ({
            pause: !prevState.pause
        }));
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    render() {
        return (
            <div>
                <h1>Game of life</h1>
                <button onClick={this.play} disabled={this.state.count > 0}>
                    Play
                </button>
                <button
                    onClick={this.controller}
                    disabled={!this.state.count > 0}
                >
                    {this.state.pause ? "Resume" : "Pause"}
                </button>
                <button
                    onClick={() => {
                        this.changeGrid("small");
                    }}
                >
                    Size: 45x30
                </button>
                <button
                    onClick={() => {
                        this.changeGrid("medium");
                    }}
                >
                    Size: 60x45
                </button>
                <button
                    onClick={() => {
                        this.changeGrid("big");
                    }}
                >
                    Size: 60x45
                </button>
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
                <button onClick={this.clear}>Clear</button>
                <p>{this.state.count}</p>
                {this.state.board && <Board board={this.state.board} />}
            </div>
        );
    }
}
