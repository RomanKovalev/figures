import React, { Component } from 'react';

import './boxitem.css'

export default class Boxitem extends Component {
    state = {
        left: 40,
        top: 40,
        width: 200,
        height: 200,
        draggable: true,
        offsetx: 0,
        offsety: 0,
        resizer: null
    }

    onDragStart = (ev) => {
        console.log('onDragStart')
        let style = window.getComputedStyle(ev.target, null);
        ev.dataTransfer.setData("text/plain",
            (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY));
            ev.dataTransfer.setData("effectAllowed", 'copy')
            ev.dataTransfer.setDragImage(ev.target, window.outerWidth, window.outerHeight)
    }

    onDrag = (ev) => {
        console.log('DRAGDRADRAG')
        return false;
    }

    onDrop = (ev) => {
        ev.preventDefault();
        console.log('onDrop')
        if (this.state.resizer === 'corner left-top') {
            this.setState({
                width: this.state.width - (ev.clientX - this.state.offsetx),
                height: this.state.height - (ev.clientY - this.state.offsety),
                left: ev.clientX,
                top: ev.clientY,
            })
            console.log()
        } else if (this.state.resizer === 'corner right-top') {
            console.log('corner right-top', ev.clientY, this.state.offsety, this.state.left)
            this.setState({
                width: this.state.width - (this.state.offsetx - ev.clientX),
                top: ev.clientY,
                height: this.state.height - (ev.clientY - this.state.offsety),
                left: this.state.left,
            })
        } else if (this.state.resizer === 'corner left-bottom') {
            this.setState({
                width: this.state.width - (ev.clientX - this.state.offsetx),
                left: ev.clientX,
                height: this.state.height - (this.state.offsety - ev.clientY),
                top: this.state.top
            })
        } else if (this.state.resizer === 'corner right-bottom') {
            this.setState({
                width: this.state.width - (this.state.offsetx - ev.clientX),
                height: this.state.height - (this.state.offsety - ev.clientY),
                top: this.state.top,
                left: this.state.left,
            })
        } else {
            const offset = ev.dataTransfer.getData("text/plain").split(',')
            this.setState({ left: ev.clientX + parseInt(offset[0], 10) })
            this.setState({ top: ev.clientY + parseInt(offset[1], 10) })
        }
        this.setState({ 'resizer': null })

        return false;
    }

    onDragOver = (ev) => {
        console.log('DragOver')
        ev.preventDefault();
    }

    onDragEnd = (ev) => {
        console.log('onDragEnd')
        ev.preventDefault();
    }

    onMouseDown = (ev) => {
        console.log('onMouseDown')
        this.setState({
            offsetx: ev.clientX,
            offsety: ev.clientY,
            resizer: ev.target.className,
            draggable: true,
        })
        return false;
    }

    onMouseUp = (ev) => {
        ev.preventDefault()
        console.log('onMouseUp')


    }


    render() {
        return (
            <div className="container-drag">
                <div className="wrapper"
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => { this.onDrop(e) }}
                    onMouseUp={(e) => this.onMouseUp(e)}
                >
                    <div
                        className="area"
                        draggable={this.state.draggable}
                        onDragStart={(e) => this.onDragStart(e)}
                        style={
                            {
                                top: this.state.top + 'px',
                                left: this.state.left + 'px',
                                width: this.state.width + 'px',
                                height: this.state.height + 'px',
                            }
                        }
                    >
                        TOP: {this.state.top}<br />
                        LEFT: {this.state.left}<br />
                        WIDTH: {this.state.width}<br />
                        HEIGHT: {this.state.height}<br />
                        Draggable: {this.state.draggable}<br />
                        Resizer: {this.state.resizer}<br />
                        <div
                            className="corner left-top"
                            onMouseDown={(e) => this.onMouseDown(e)}
                        ></div>
                        <div
                            className="corner right-top"
                            onMouseDown={(e) => this.onMouseDown(e)}
                        ></div>
                        <div
                            className="corner left-bottom"
                            onMouseDown={(e) => this.onMouseDown(e)}
                        ></div>
                        <div
                            className="corner right-bottom"
                            onMouseDown={(e) => this.onMouseDown(e)}
                        ></div>
                    </div>
                </div >
            </div >
        );
    }
};
