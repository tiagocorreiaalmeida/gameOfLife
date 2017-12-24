import React from "react";
import ReactDOM from "react-dom";
import BoardRow from "./BoardRow";

export default class extends React.Component {
    render() {
        return (
            <table>
                <tbody>
                    {this.props.board.map((ele, index) => (
                        <BoardRow key={'row ' + index} rows={ele} x={index}/>
                    ))}
                </tbody>
            </table>
        );
    }
}
