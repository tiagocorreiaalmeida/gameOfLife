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
        this.state = {
            board: [],
            cols: 10,
            rows: 10
        };
    }

    setUpGrid() {
        let board = createBoard(this.state.cols, this.state.rows);
        for (let i = 0; i < this.state.cols; i++) {
            for (let j = 0; j < this.state.rows; j++) {
                board[i][j] = Math.round(Math.random(2));
            }
        }
        console.table(board);
        this.setState(() => ({ board }));
    }

    componentDidMount() {
        this.setUpGrid();
    }

    render() {
        return (
            <div>
                <h1>Game of life</h1>
                <Board board={this.state.board} />
            </div>
        );
    }
}
