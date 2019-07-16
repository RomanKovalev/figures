import React, { Component } from 'react';

import './boxitem.css'

export default class Boxitem extends Component {
    state = {
        left:40,
        top: 40
    }

    onDragStart = (ev) => {
        console.log('onDragStart')
        let style = window.getComputedStyle(ev.target, null);
        // ev.dataTransfer.setData("id",)
        ev.dataTransfer.setData("text/plain",
            (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY));
        // console.log(ev.dataTransfer.getData("text/plain"))
        // ev.dataTransfer.setData("dropEffect", "move");
    }

    onDrag = (ev) => {
        console.log('DRAGDRADRAG')
        return false;
    }

    onDrop = (ev) => {
        ev.preventDefault();
        console.log('onDrop')
        const offset = ev.dataTransfer.getData("text/plain").split(',')
        // console.log(ev.clientX, ev.clientY)
        // const id = ev.dataTransfer.getData("id")
        // console.log(id)
        // const dm = document.getElementById(id)
        // console.log(dm)
        this.setState({left: ev.clientX + parseInt(offset[0], 10) + "px"})
        this.setState({top: ev.clientY + parseInt(offset[1], 10) + "px"})

        // dm.style.left = ev.clientX + parseInt(offset[0], 10) + "px";
        // dm.style.top = ev.clientY + parseInt(offset[1], 10) + "px";
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


    render() {
        return (
            <div className="container-drag">
                <div className="wrapper"
                    onDragOver={(e) => this.onDragOver(e)}
                    onDrop={(e) => { this.onDrop(e) }}>
                    <div
                        id="con1"
                        className="area"
                        draggable="true"
                        onDragStart={(e) => this.onDragStart(e)}
                        style={
                            {
                                top : this.state.top,
                                left : this.state.left
                            }
                        }
                    >   
                        <div className="corner left-top" ></div>
                        <div className="corner right-top"></div>
                        <div className="corner left-bottom"></div>
                        <div className="corner right-bottom"></div>
                    </div>
                </div >
            </div >
        );
    }
};
