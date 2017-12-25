import React from "react";
import ReactDOM from "react-dom";

export default class extends React.Component {
    render() {
        return (
            <tr>
                {this.props.rows.map((cell, index) => {
                    let state = cell > 0 ? "cell--alive" : "cell--dead";
                    return (
                        <td
                            className={"cell " + state}
                            key={this.props.x + "-" + index}
                        />
                    );
                })}
            </tr>
        );
    }
}
