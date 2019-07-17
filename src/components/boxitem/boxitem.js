import React, { Component } from 'react';

import './boxitem.css'

export default class Boxitem extends Component {
    constructor(props) {
        super(props);
        console.log(props.state)
        this.state = this.props.state
    }



    render() {
        return (
            <div
                className="area"
                draggable={this.props.state.draggable}
                onDragStart={(e) => this.props.onDragStart(e)}
                style={
                    {
                        top: this.props.state.top + 'px',
                        left: this.props.state.left + 'px',
                        width: this.props.state.width + 'px',
                        height: this.props.state.height + 'px',
                    }
                }
            >
                <div
                    className="corner left-top"
                    onMouseDown={(e) => this.props.onMouseDown(e)}
                ></div>
                <div
                    className="corner right-top"
                    onMouseDown={(e) => this.props.onMouseDown(e)}
                ></div>
                <div
                    className="corner left-bottom"
                    onMouseDown={(e) => this.props.onMouseDown(e)}
                ></div>
                <div
                    className="corner right-bottom"
                    onMouseDown={(e) => this.props.onMouseDown(e)}
                ></div>
            </div>
        );
    }
};
