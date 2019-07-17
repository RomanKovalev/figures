import React, { Component } from 'react';
import Boxitem from "../boxitem";

import './app.css'


export default class App extends Component {

  state = {
    left: 40,
    top: 40,
    width: 100,
    height: 200,
    draggable: true,
    offsetx: 0,
    offsety: 0,
    resizer: null
  }

  onDrop = (ev) => {
    console.log('onDrop')
    console.log(this.state.left)
    ev.preventDefault();
    if (this.state.resizer === 'corner left-top') {
      this.setState({
        width: this.state.width - (ev.clientX - this.state.offsetx),
        height: this.state.height - (ev.clientY - this.state.offsety),
        left: ev.clientX,
        top: ev.clientY,
      })
    } else if (this.state.resizer === 'corner right-top') {
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
    console.log('onDragOver')

    ev.preventDefault();
  }

  onMouseUp = (ev) => {
    console.log('onMouseUp')

    ev.preventDefault()
  }

  onDragStart = (ev) => {
    console.log('onDragStart')
    let style = window.getComputedStyle(ev.target, null);
    ev.dataTransfer.setData("text/plain",
      (parseInt(style.getPropertyValue("left"), 10) - ev.clientX) + ',' + (parseInt(style.getPropertyValue("top"), 10) - ev.clientY));
    ev.dataTransfer.setDragImage(ev.target, window.outerWidth, window.outerHeight)
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

  render() {
    return (
      <div>
        <div className="container-drag">
          <div className="wrapper"
            onDragOver={(e) => this.onDragOver(e)}
            onDrop={(e) => this.onDrop(e) }
            onMouseUp={(e) => this.onMouseUp(e)}
          >
            <Boxitem
              state={this.state}
              onDragStart={ (e) => this.onDragStart(e)}
              onMouseDown={ (e) =>this.onMouseDown(e)}
            />
          </div>
        </div>
      </div>
    );
  };
}

