import React from "react";
import ReactDOM from "react-dom";
import Board from "./Board";
import Header from "./Header";

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

    setUpGrid() {
        let cols = this.state.cols;
        let rows = this.state.rows;
        let board = createBoard(cols, rows);
        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                board[i][j] = Math.round(Math.random(2));
            }
        }
        this.setState({
            board: JSON.parse(JSON.stringify(board)),
            count: 0
        },()=>{
          this.start();
        });
    }    

    start() {
        let timer;

        clearInterval(this.timerID);

        switch (this.state.interval) {
            case "slow":
                timer = 1000;
                break;
            case "normal":
                timer = 200;
                break;
            case "fast":
                timer = 1;
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
            this.setUpGrid();
        }
    }

    changeGrid(size) {
      let cols = 0;
      let rows = 0;
        switch (size) {
            case "small":
                cols = 30;
                rows = 45;
                break;
            case "medium":
                cols = 40;
                rows = 60;
                break;
            case "big":
                cols = 55;
                rows = 80;
        }
        this.setState(()=>({
          cols,rows,pause:false
        }),()=>{
          this.setUpGrid();
        });
    }

    changeInterval(interval) {
      if(this.state.count === 0){
        this.setUpGrid();
      }
        this.setState(
            () => ({ interval, pause: false }),
            () => {
                this.start(); 
            }
        ); 
    }

    play() {
        this.setUpGrid();
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
        if (JSON.stringify(grid) === JSON.stringify(next)) {
            clearInterval(this.timerID);
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
                <Header />
                <div className="container text-center">
                    <h2 className="title__secondary">Controllers</h2>
                    {this.state.count > 0 ? (
                        <button
                            onClick={this.controller}
                            className="btn btn--dark"
                        >
                            {this.state.pause ? "Resume" : "Pause"}
                        </button>
                    ) : (
                        <button onClick={this.play} className="btn btn--dark">
                            Play
                        </button>
                    )}
                    <button
                        onClick={() => {
                            this.changeGrid("small");
                        }}
                        className={
                            this.state.cols == 30
                                ? "btn btn--dark btn--dark--active"
                                : "btn btn--dark"
                        }
                    >
                        <i className="ion-monitor btn__icon" /> 45x30
                    </button>
                    <button
                        onClick={() => {
                            this.changeGrid("medium");
                        }}
                        className={
                            this.state.cols == 40
                                ? "btn btn--dark btn--dark--active"
                                : "btn btn--dark"
                        }
                    >
                        <i className="ion-monitor btn__icon" /> 60x40
                    </button>
                    <button
                        onClick={() => {
                            this.changeGrid("big");
                        }}
                        className={
                            this.state.cols == 55
                                ? "btn btn--dark btn--dark--active"
                                : "btn btn--dark"
                        }
                    >
                        <i className="ion-monitor btn__icon" /> 80x55
                    </button>
                    <button
                        onClick={() => {
                            this.changeInterval("slow");
                        }}
                        className={
                            this.state.interval === "slow"
                                ? "btn btn--dark btn--dark--active"
                                : "btn btn--dark"
                        }
                    >
                        <i className="ion-speedometer btn__icon" /> Slow{" "}
                    </button>
                    <button
                        onClick={() => {
                            this.changeInterval("normal");
                        }}
                        className={
                            this.state.interval === "normal"
                                ? "btn btn--dark btn--dark--active"
                                : "btn btn--dark"
                        }
                    >
                        <i className="ion-speedometer btn__icon" /> Normal{" "}
                    </button>
                    <button
                        onClick={() => {
                            this.changeInterval("fast");
                        }}
                        className={
                            this.state.interval === "fast"
                                ? "btn btn--dark btn--dark--active"
                                : "btn btn--dark"
                        }
                    >
                        <i className="ion-speedometer btn__icon" /> Fast{" "}
                    </button>
                    <button onClick={this.clear} className="btn btn--dark">
                        Clear
                    </button>
                    <p className="counter">Generations: {this.state.count}</p>
                </div>
                {this.state.board && <Board board={this.state.board} />}
            </div>
        );
    }
}
